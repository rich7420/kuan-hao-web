# 部署與運行指南 (Deployment & Setup Guide)

這份文件詳細說明如何設置本地開發環境，以及如何將 `kuan-hao-web` Monorepo 部署到 Google Cloud Run。

## 1. 本地開發環境 (Local Development)

### 前置需求
-   **Rust**: 安裝最新版 (建議使用 `rustup`)。
-   **Node.js**: v18 或更高版本 (建議 v20)。
-   **Docker**: 用於運行本地 PostgreSQL 資料庫 (可選，若你已有 Postgres 則不需)。
-   **PostgreSQL**: 資料庫。

### 步驟 1: 啟動資料庫
如果你沒有安裝 PostgreSQL，可以使用 Docker 快速啟動一個：
```bash
docker run --name kuan-hao-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=kuan_hao_web -p 5432:5432 -d postgres
```

### 步驟 2: 設定後端 (Backend)
1.  進入 `backend` 目錄：
    ```bash
    cd backend
    ```
2.  建立 `.env` 檔案：
    ```bash
    echo "DATABASE_URL=postgres://postgres:password@localhost:5432/kuan_hao_web" > .env
    echo "RUST_LOG=info" >> .env
    ```
3.  安裝 sqlx-cli (用於資料庫遷移)：
    ```bash
    cargo install sqlx-cli
    ```
4.  執行資料庫遷移 (建立資料表)：
    ```bash
    sqlx migrate run
    ```
5.  啟動後端伺服器 (預設 Port 3001)：
    ```bash
    cargo run
    ```

### 步驟 3: 設定前端 (Frontend)
1.  進入 `frontend` 目錄：
    ```bash
    cd frontend
    ```
2.  安裝依賴：
    ```bash
    npm install
    ```
3.  建立 `.env.local` 檔案 (指向本地後端)：
    ```bash
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
    ```
4.  啟動前端開發伺服器 (預設 Port 3000)：
    ```bash
    npm run dev
    ```
5.  開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)。

---

## 2. GCP 部署（Cloud Run + Cloud SQL）

**部署前檢查清單**

- [ ] GCP 專案已建立、計費已啟用，並已啟用 Cloud Run / Cloud SQL Admin / Container Registry API
- [ ] 已建立 Service Account（含 Cloud Run 管理員、Cloud SQL 管理員、Storage 管理員）、下載 JSON 金鑰
- [ ] GitHub Secrets 已設定：`GCP_CREDENTIALS`、`CLOUD_SQL_PASSWORD`
- [ ] `.github/workflows/deploy.yml` 頂部已將 `PROJECT_ID`、`REGION` 改為你的專案與區域
- [ ] 程式碼已 push 到 `main`，到 Actions 頁面確認 workflow 執行成功

---

### 部署流程概覽

- **應用**：Backend、Frontend 跑在 **Cloud Run**（無狀態容器）。
- **資料庫**：PostgreSQL 跑在 **Cloud SQL**（GCP 託管），不跑在 Cloud Run 上。
- **一鍵部署**：Push 到 `main` 後，Workflow 會**先確保 Cloud SQL 存在**（沒有就建立，有則不動、**不清空既有資料**），再建置並部署 Backend、Frontend。

---

### 部署步驟（依序執行）

#### 步驟 1：GCP 專案與 API

1. 到 [Google Cloud Console](https://console.cloud.google.com/) 建立或選擇專案。
2. 啟用計費（Cloud SQL 與 Cloud Run 需專案啟用計費）。
3. 啟用以下 API（Workflow 也會在 `setup-cloudsql` 時啟用部分 API，可事先手動啟用）：
   - **Cloud Run API**
   - **Cloud SQL Admin API**
   - **Container Registry API**（workflow 使用 `gcr.io` 推映像）

#### 步驟 2：Service Account（給 GitHub Actions 用）

1. IAM 與管理 > 服務帳戶 > 建立服務帳戶（例如名稱 `github-actions`）。
2. 賦予以下角色：
   - **Cloud Run 管理員**
   - **Cloud SQL 管理員**（或至少能建立/查詢 instance 與 database）
   - **Storage 管理員**（用於推映像到 GCR）或 **Artifact Registry 寫入者**（若改用 Artifact Registry）
   - **Service Account 使用者**
3. 建立金鑰（JSON），下載並妥善保存。

#### 步驟 3：GitHub Secrets 與 workflow 設定

1. 到 Repo **Settings > Secrets and variables > Actions**，新增：
   - **`GCP_CREDENTIALS`**：貼上上述 Service Account 的 **整個 JSON 檔案內容**。
   - **`CLOUD_SQL_PASSWORD`**：Cloud SQL 的 **postgres** 密碼（首次部署會用來建立 instance 的 root 密碼；之後用來組 `DATABASE_URL`）。密碼請勿含 `@`、`#`、`?`、`/` 等會破壞 URL 的字元。

2. 編輯 `.github/workflows/deploy.yml` 頂部 **env**：
   - **`PROJECT_ID`**：改成你的 GCP 專案 ID（必改）。
   - **`REGION`**：改成你要的區域，例如 `asia-east1`（台灣）。
   - 可選：`CLOUD_SQL_INSTANCE`（預設 `kuan-hao-db`）、`DB_NAME`（預設 `kuan_hao_web`）。

#### 步驟 4：觸發部署

1. 將上述變更 commit 並 **push 到 `main`**。
2. 到 GitHub **Actions** 分頁查看 workflow「Build and Deploy to Cloud Run」：
   - **setup-cloudsql**：若無 Cloud SQL 實例/資料庫則建立（約 5–10 分鐘）；已有則跳過。
   - **deploy-backend**：建置 Backend 映像、推送到 GCR、部署到 Cloud Run 並掛上 Cloud SQL。
   - **deploy-frontend**：取得 Backend URL、建置 Frontend、部署到 Cloud Run。
3. 完成後在 [Cloud Run 主控台](https://console.cloud.google.com/run) 可看到 `backend-service` 與 `frontend-service`，點擊 URL 即可訪問。

---

### 架構與注意事項

- **setup-cloudsql**：若沒有 Cloud SQL 實例/資料庫會自動建立；若已有則跳過，**不會刪除或清空既有資料**。
- **deploy-backend / deploy-frontend**：應用跑在 **Cloud Run**，資料庫跑在 **Cloud SQL**。
- **Backend**：讀取 `PORT`（8080）與 `DATABASE_URL`（由 workflow 從 `CLOUD_SQL_PASSWORD` 與 connection name 組出）。
- **Frontend**：建置時帶入 `NEXT_PUBLIC_API_URL`（Backend 的 Cloud Run URL）。

---

## 2.2 費用估算（GitHub Actions + GCP Cloud Run）

### GitHub Actions（Private Repo）

| 方案 | 每月免費分鐘數 | 超出後單價 (Linux 2-core) |
|------|----------------|---------------------------|
| GitHub Free | 2,000 分鐘 | 約 $0.006/分鐘 |
| GitHub Pro / Team | 3,000 分鐘 | 同上 |

- 一次完整部署（backend + frontend 兩 job）：約 **5–15 分鐘**（依 Rust/Node 建置時間而異）。
- 若每月部署約 **20–50 次**，約 100–750 分鐘，Free 方案可能需付費超出部分；Pro/Team 通常仍在免費額度內。

### GCP Cloud Run（Request-based billing，以 asia-east1 為例）

官方免費額度（每月、每帳戶）：

- **vCPU**：180,000 vCPU-seconds
- **記憶體**：360,000 GiB-seconds  
- **請求數**：**200 萬次**

超出後單價（Tier 1，台灣 asia-east1）：

- vCPU：約 **$0.000024 / vCPU-second**
- 記憶體：約 **$0.0000025 / GiB-second**
- 請求：**$0.40 / 百萬次**

**粗估（個人/小流量網站）**：

- 假設 2 個服務（backend + frontend）、各 0.5 vCPU、512 MiB、每月 10 萬請求、平均每請求 0.3 秒：
  - 請求：10 萬 << 200 萬 → **$0**
  - 運算：多數落在免費 vCPU/GiB-seconds 內 → **約 $0**
- 結論：**輕量使用下，Cloud Run 每月很可能為 $0**；若流量與請求數提高，再依上述單價估算。

### 其他可能費用

- **Cloud SQL**：若使用託管 PostgreSQL，依實例規格計費（不在 Cloud Run 免費額度內）。
- **Artifact Registry / GCR**：存放 Docker 映像會佔儲存空間，小專案通常在免費額度內。
- **網路**：同一 region 內 Cloud Run 對 Cloud Run、對其他 GCP 服務的流量免費；出站到網際網路依流量計費，每月 1 GB 後開始計費。

以上金額與免費額度以官方最新公告為準：  
[Cloud Run 定價](https://cloud.google.com/run/pricing) · [GitHub Actions 計費](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions)

---

## 3. 手動部署 (不使用 GitHub Actions)

如果你想手動部署到 Cloud Run：

### Backend
```bash
cd backend

# 建置 Docker Image
docker build -t gcr.io/YOUR_PROJECT_ID/backend:latest .

# Push 到 GCR
docker push gcr.io/YOUR_PROJECT_ID/backend:latest

# 部署到 Cloud Run
gcloud run deploy backend-service \
  --image gcr.io/YOUR_PROJECT_ID/backend:latest \
  --region asia-east1 \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances YOUR_PROJECT:REGION:INSTANCE \
  --set-env-vars DATABASE_URL="postgres://user:password@/dbname?host=/cloudsql/YOUR_PROJECT:REGION:INSTANCE"
```

### Frontend
```bash
cd frontend

# 建置 Docker Image (需要設定 Backend URL)
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://backend-service-xxx.a.run.app \
  -t gcr.io/YOUR_PROJECT_ID/frontend:latest .

# Push 到 GCR
docker push gcr.io/YOUR_PROJECT_ID/frontend:latest

# 部署到 Cloud Run
gcloud run deploy frontend-service \
  --image gcr.io/YOUR_PROJECT_ID/frontend:latest \
  --region asia-east1 \
  --platform managed \
  --allow-unauthenticated
```

---

## 4. 常見問題與除錯

-   **已有外部 PostgreSQL，不想用 Cloud SQL？**  
    目前 workflow 設計為「部署全部」並自動建立/使用 Cloud SQL。若你要改用既有資料庫（例如自架或他雲），可改回手動設定：在 `deploy.yml` 中改為使用 `secrets.DATABASE_URL`、並加上 `--add-cloudsql-instances`（僅在連 Cloud SQL 時需要）；或改為手動部署（見下方「手動部署」），不跑 `setup-cloudsql`。

-   **Backend 連不到 Database**:
    -   確認 Cloud Run 的 "Connections" 設定中有加入 Cloud SQL Instance。
    -   確認 `DATABASE_URL` 正確 (socket 路徑)。
-   **Frontend 連不到 Backend**:
    -   確認 Frontend 的環境變數 `NEXT_PUBLIC_API_URL` 是 Backend 的 Cloud Run URL (https://...) 而非 localhost。
-   **CORS 錯誤**:
    -   Backend 的 `main.rs` 中 `CorsLayer` 需允許 Frontend 的 Cloud Run 網域。目前設定為 `allow_origin(Any)` (開發方便)，正式環境建議鎖定來源。

---

## 5. 檔案結構回顧
-   **`/backend`**：Rust API（Axum + SQLx）。
-   **`/frontend`**：Next.js 前端。
-   **`/.github/workflows`**：GitHub Actions CI/CD（`deploy.yml`）。
-   **`docker-compose.yml`**：本地開發用（可選）。

---

## 6. 環境變數總覽

### Backend
-   `DATABASE_URL`: PostgreSQL 連線字串
-   `RUST_LOG`: 日誌等級 (例如 `info`, `debug`)
-   `PORT`: Cloud Run 會自動設定 (通常是 8080)

### Frontend
-   `NEXT_PUBLIC_API_URL`: Backend API URL (必須是 `NEXT_PUBLIC_` 開頭才能在瀏覽器使用)

---

## 7. 下一步建議

1.  **設定自訂網域**: 在 Cloud Run 設定自訂網域 (需要驗證 DNS)。
2.  **設定 CDN**: 使用 Cloud CDN 加速靜態資源。
3.  **監控與日誌**: 使用 Cloud Logging 和 Cloud Monitoring 追蹤效能。
4.  **安全性**: 
    -   鎖定 CORS 來源。
    -   使用 Secret Manager 管理敏感資訊。
    -   設定 Cloud Armor 防護 DDoS。
