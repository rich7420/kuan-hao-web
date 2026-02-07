---
title: "我的開源救贖與攻略"
date: "2026-02-07"
description: "從競賽到開源貢獻之路"
---

# 從焦慮的競賽者到 Apache Committer：我的開源救贖與攻略

**Kuan-Hao Huang (Rich Huang)** · 6 min read · Jan 28, 2026

---

> 「才能是可以栽培開花的，靈感是可以研磨雕琢的。」——及川徹《排球少年》

## The Beginning

故事的起點，始於大三時的專題。當時在 **賴冠州教授（Prof. Kuan-Chou Lai）** 的帶領下，我們接觸了 **[Apache Yunikorn](https://yunikorn.apache.org/)**。看著學長們，特別是已經拿到 PMC 的 **宥騰學長大大** 在社群中發光發熱，心中充滿了嚮往，但也伴隨著巨大的距離感。這是世界都在用的開源專案，我們能做到什麼？

後來，賴教授將我們引薦給了 **蔡嘉平博士（Dr. Chia-Ping Tsai）**，也就是「**[原來適你（Open Source for You）](https://www.facebook.com/groups/opensourceforyou)**」的創辦人。初入社群，大神環繞，但我卻像個迷路的孩子。雖然斷斷續續貢獻過 Apache Yunikorn 和 [Apache Ambari](https://ambari.apache.org/)，從貢獻了一個 PR 之後有短暫的興奮與悸動，想要繼續往前衝，但有點無腦，後來始終覺得缺乏一股「衝勁」，不確定自己的方向在哪，也不知未來該往何處發展。

> 「在戰場上，只有強者和弱者，沒有中間地帶。」——《藍色監獄》

## The Detour

因為迷惘，這時有朋友介紹，我便轉戰雲端運算競賽（AWS, GCP）。雖然取得了一些成績，但那種感覺卻令人窒息。這些競賽的本質是殘酷的零和遊戲 **「第一名拿走一切（The winner takes it all）」**。

比賽時，我盯著 Dashboard，看著別人的分數高高在上，而自己因為題目剛好是對手擅長的領域而落在中下游。那是一種隨時怕被追上的恐懼，半夜驚醒的焦慮，覺得自己好像還練不夠。雖然可能拿到一點名次，但我心裡始終覺得這好像不是我想要的方向。

. . .

> 「心，燃燒起來！」——煉獄杏壽郎《鬼滅之刃》

## The Turning Point

就在這時，我看到了昔日「第一屆香菜饅頭營」的組員 **翰儒（Han-Ju Chen）** 在 Terry 的影片中分享開源帶給他的成長。看著他自信的分享，我心裡的慾望被喚醒了：**我想出國賺錢、我想跟世界頂尖高手合作、我想讓世界很多技術背後可以使用我有參與的專案**。

這顆火苗在心裡種下，但真正讓它變成熊熊大火的，是嘉平博士的一席話。當我向他抱怨競賽「贏家全拿」的殘酷時，他疑惑地問我：**「為什麼不選一條做長久、大家都可以一起成長、獲利的道路呢？」**

這句話如醍醐灌頂（struck me like lightning）。原來，我不必擊敗別人才能證明自己，我可以透過成就別人來成就自己。我重新投入了開源的懷抱，而這一次，我希望自己沒有再停下。

. . .

> 「正因為我們不完美，所以才能繼續向前走。」——《鋼之鍊金術師》

## The Trial

回歸後，我並不知道要選哪個專案，但是正因為有「原來適你」的友善環境，我才有機會將 **[Apache Ozone](https://ozone.apache.org/), [Airflow](https://airflow.apache.org/), [OpenDAL](https://opendal.apache.org/), [Gravitino](https://gravitino.apache.org/), [Flyte](https://flyte.org/), Gthulhu, [Mahout](https://mahout.apache.org/), Kai-scheduler** 全部摸索了一遍。

這過程中我犯過很多無腦的錯：用 AI 生成程式碼沒仔細檢查就提交、漏看別人的 Issue 討論忘了加 Co-author。但社群的大大們總是善意地提醒。這些錯誤讓我更戰戰兢兢，也學會了對每一行程式碼負責。

. . .

> 「相信自己，不是相信那個『相信著我的你』，也不是相信那個『相信著你的我』，而是相信那個『相信著自己的自己』！」——卡米那《天元突破》

## The Strategy

我是怎麼選專案？我的核心策略是：**尋找被低估的基礎設施專案**

### A. 目標是賣鏟子給淘金者
AI 時代的兩大瓶頸是 **算力（GPU）** 與 **存儲（Storage）**。不管模型怎麼變，底層的設施永遠是剛需。

* **Apache Ozone (Storage):** 解決海量數據存儲（Data Lake）。雖然 Star 數僅 1.1k，但在 SSD 漲價與大數據時代，它的價值只會越來越高。
* **Kai-scheduler (Compute):** 源自被 Nvidia 收購的 Run:ai。雖然 Star 數不多，但在 GPU 調度的精細度上，目前無人能敵。

### B. 觀察企業趨勢
Kai-scheduler 曾是 Run:ai 的核心產品，這代表其技術路徑是被市場（Nvidia）驗證過的頂級水準。即便 Star 數低，但技術含金量極高。

### C. 避開紅海，差異化競爭
當大家都去卷模型或主流框架時，我們選擇在 Mahout 做 **QDP（Quantum Data Plane）**，避開了與 Nvidia CUDA-Q 的正面對決，這就是經典的差異化競爭。

### D. 活躍度 > Star 數
像 Ozone 這樣每週活躍人數穩定的專案，比那些 Star 數高但無人維護的專案更有生命力。

但我覺得最最重要的標準還是：**你真的喜歡它嗎？喜歡到願意用週末一整天的時間去貢獻它嗎？**

. . .

> 「人類的能力是有限的，但正因為如此，我們才需要依靠夥伴。」——《火影忍者》

## The Rebirth of Mahout

2025 年 11 月左右，我和 **冠銘（Guan-Ming Chiu）** 討論 Apache Mahout 的未來。當時 Mahout 處於勢微階段，僅剩量子計算平台（qumat）這條路，卻面臨 Nvidia CUDA-Q 的強勢競爭。

我們不想重造輪子，於是冠銘和我擬定了一個 Proposal：**QDP (Quantum Data Plane)**。我們的目標是解決 **QML 的前處理痛點**：將 Raw Data 直接用演算法算出結果，並在 GPU 上轉成量子態給 QML 使用。這解決了傳統 Qiskit 和 Pennylane 在大數據時代必須依賴 CPU 跑演算法的效能瓶頸。

POC 的成功，歸功於強大的夥伴：

* **Jie-Kai 大大**
* **Ryan Huang 大大**
* **Guan-ming 大大**

沒有他們，這一切不可能發生。最終，在冠銘、Trevor 和 akm 大大的舉薦下，我有幸成為 **Apache Mahout Committer**。這條路還沒走完。未來，我將繼續深耕 Mahout，並在 Ozone 與 Kai-scheduler 上貢獻更多。

這段開源的旅程對我來說才剛剛開始，有很多在學校或在一般職場學習不到的東西：到在十幾萬行的程式碼中開發，理解現有的龐大架構、邏輯與歷史包袱的基礎上開發或修改，與來自不同國家的大神們互動，經歷很有系統、嚴謹的開發流程，當然還有很多要學的地方，這都是學校裡面永遠學習不到的。

開源不是一場「贏家全拿」的競賽，而是一場「無限賽局」。在這裡，我們不需要踩著別人往上爬，而是與世界頂尖的高手們，**一起把餅做大，一起去那更高更遠的地方**。最最感謝嘉平大大與原來適你的各位，一起成長一起學習。

> 「我們接下來要去的地方，光是靠勇氣可是去不了的。」——《海賊王》

---

## 如果想參與開源但不知道方向
* [原來適你 FB](https://www.facebook.com/opensource4you/)
* [原來適你 Slack](opensource4you.tw/slack/join)
    我在裡面 ID 是黃冠澔 Kuan-Hao Huang，有問題可以來 slack 私我

. . .

## 如果成為 Apache committer 會有什麼好處呢？
* IntelliJ 全家桶
* Azure 福利
* 酷酷的 apache.org 帳號

. . .

小小宣傳 [LinkedIn](https://www.linkedin.com/in/kuan-hao-h/)