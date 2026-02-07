# Kuan-Hao Personal Website

A high-performance personal website built with **Rust (Axum)** backend and **Next.js 16** frontend, deployed to **Google Cloud Run**.

## 🚀 Architecture

### Tech Stack
- **Backend**: Rust + Axum + SQLx + PostgreSQL
- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Database**: PostgreSQL 15
- **Deployment**: Docker + Google Cloud Run
- **CI/CD**: GitHub Actions

### Features
- ⚡ **Blazing Fast**: Rust backend with nanosecond-precision health checks
- 📊 **Visitor Analytics**: Real-time visitor tracking stored in PostgreSQL
- 📬 **Contact Form**: Message submission with persistent storage
- 🎮 **Hidden Dashboard**: Secret admin panel (trigger with Konami Code: ↑↑↓↓←→←→BA)
- 🔒 **Secure**: Protected endpoints with custom header authentication
- 🐳 **Optimized Docker**: Multi-stage builds with `cargo-chef` for fast CI/CD

## 📁 Project Structure

```
.
├── backend/              # Rust Axum API
│   ├── src/
│   │   ├── main.rs      # Server entry point
│   │   ├── handlers.rs  # Route handlers
│   │   └── state.rs     # Application state
│   ├── migrations/      # SQL migrations
│   └── Dockerfile       # Optimized with cargo-chef
├── frontend/            # Next.js 16 App
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── components/ # React components
│   │   └── lib/        # API client & utilities
│   ├── content/posts/  # Markdown blog posts
│   └── Dockerfile      # Standalone output mode
├── ops/                # Operations & scripts
├── docker-compose.yml  # Local PostgreSQL
└── .github/workflows/  # CI/CD pipelines
```

## 🛠️ Local Development

### Prerequisites
- **Rust** 1.84+ (`rustup`)
- **Node.js** 20+
- **Docker** & Docker Compose
- **PostgreSQL** (via Docker)

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd kuan-hao-web
```

2. **Start PostgreSQL**
```bash
docker-compose up -d
```

3. **Backend Setup**
```bash
cd backend
cp .env.example .env
# Edit .env if needed
cargo run
```
Backend will run on `http://localhost:3001`

4. **Frontend Setup**
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (returns nanosecond timestamp) |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/dashboard` | Admin dashboard (requires `x-magic-key: open-sesame`) |

### Hidden Features

**Konami Code Dashboard**: On the homepage, type the Konami Code sequence:
```
↑ ↑ ↓ ↓ ← → ← → B A
```
This will reveal the admin dashboard showing visitor stats and recent messages.

## 🚢 Deployment

### Google Cloud Run

1. **Setup GCP Project**
   - Create a new GCP project
   - Enable Cloud Run API
   - Create Cloud SQL PostgreSQL instance
   - Create Service Account with necessary permissions

2. **Configure GitHub Secrets**
   - `GCP_CREDENTIALS`: Service account JSON key
   - `DATABASE_URL`: PostgreSQL connection string (Cloud SQL)

3. **Update Workflow**
   Edit `.github/workflows/deploy.yml`:
   - Set `PROJECT_ID` to your GCP project ID
   - Set `REGION` to your preferred region

4. **Deploy**
   Push to `main` branch to trigger automatic deployment:
   ```bash
   git push origin main
   ```

## 🔧 Configuration

### Backend Environment Variables
```bash
DATABASE_URL=postgres://user:password@host:5432/dbname
RUST_LOG=info
```

### Frontend Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.run.app
```

## 📝 Content Management

Add new blog posts by creating Markdown files in `frontend/content/posts/`:

```markdown
---
title: "Your Post Title"
date: "2026-02-07"
description: "Post description"
---

# Your Content Here
```

## 🎨 Design Philosophy

- **Dark Mode First**: Sleek, modern dark theme with glassmorphism
- **Bento Grid Layout**: Modern, card-based homepage design
- **Micro-animations**: Smooth transitions and hover effects
- **Performance**: Optimized for speed with Rust backend and Next.js standalone output

## 🔒 Security Notes

- The dashboard magic key (`open-sesame`) should be changed in production
- Use environment variables for all sensitive configuration
- Enable CORS only for your frontend domain in production
- Use Cloud SQL Auth Proxy for secure database connections

## 📊 Performance

- **Backend**: Sub-millisecond response times with Rust
- **Frontend**: Optimized bundle size with standalone output
- **Docker**: Fast builds with cargo-chef dependency caching
- **Database**: Connection pooling with SQLx

## 🤝 Contributing

This is a personal website, but feel free to fork and adapt for your own use!

## 📄 License

MIT License - feel free to use this as a template for your own site.

---

Built with ❤️ using Rust and Next.js
