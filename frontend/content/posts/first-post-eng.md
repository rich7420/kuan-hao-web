---
title: "My Open Source Redemption and Strategy"
date: "2026-02-07"
description: "From competitions to Apache committer"
---

# From Anxious Competitor to Apache Committer: My Open Source Redemption and Strategy

**Kuan-Hao Huang (Rich Huang)** · 6 min read · Jan 28, 2026

---

> "Talent is something you make bloom, instinct is something you polish." — Oikawa Tooru, *Haikyu!!*

## The Beginning

The story begins with my junior year capstone project. Under the guidance of **Prof. Kuan-Chou Lai**, we were introduced to **[Apache Yunikorn](https://yunikorn.apache.org/)**. Watching my seniors, especially **You-Teng (a PMC member)**, shine in the community filled me with admiration, but also a huge sense of distance. This was an open-source project used by the world—what could *we* possibly achieve?

Later, Prof. Lai introduced us to **Dr. Chia-Ping Tsai**, the founder of "**[Open Source for You](https://www.facebook.com/groups/opensourceforyou)**." Entering the community, I was surrounded by experts, yet I felt like a lost child. Although I made intermittent contributions to Apache Yunikorn and [Apache Ambari](https://ambari.apache.org/), and felt a brief rush of excitement after contributing a PR, I was moving forward blindly. Eventually, I felt I lacked a "drive"—I wasn't sure of my direction or where my future lay.

> "On the battlefield, there are only the strong and the weak. There is no middle ground." — *Blue Lock*

## The Detour

Feeling lost, I followed a friend's recommendation and pivoted to cloud computing competitions (AWS, GCP). Although I achieved some results, the atmosphere was suffocating. The nature of these competitions is a cruel zero-sum game: **"The winner takes it all."**

During competitions, I would stare at the dashboard, watching others' scores tower above mine, while I fell into the lower ranks simply because the problem set happened to favor my opponents' strengths. It was a fear of constantly being overtaken, an anxiety that woke me up in the middle of the night, feeling like I hadn't practiced enough. Although I might have won some rankings, deep down I began to feel that this wasn't the direction I wanted.

. . .

> "Set your heart ablaze!" — Rengoku Kyojuro, *Demon Slayer*

## The Turning Point

Just then, I saw a video featuring **Han-Ju Chen**, a former team member from the "First Coriander Steamed Bun Camp," sharing how open source had fostered his growth on Terry's channel. Watching him share his story with such confidence awakened a desire within me: **I want to go abroad to earn money, I want to work with the world's top experts, and I want the technology behind the world to use projects I participated in.**

This spark was planted in my heart, but what truly turned it into a roaring fire was a conversation with Dr. Chia-Ping Tsai. When I complained to him about the cruelty of the "winner takes all" nature of competitions, he asked me puzzledly: **"Why not choose a path where everyone can grow and win together for the long haul?"**

This sentence struck me like lightning. I realized I didn't have to defeat others to prove myself; I could achieve self-fulfillment by helping others succeed. I threw myself back into the embrace of open source, and this time, I hoped I wouldn't stop again.

. . .

> "Because we are not perfect, we can keep moving forward." — *Fullmetal Alchemist*

## The Trial

After returning, I didn't know which project to choose. But thanks to the friendly environment of "Open Source for You," I had the opportunity to explore **[Apache Ozone](https://ozone.apache.org/), [Airflow](https://airflow.apache.org/), [OpenDAL](https://opendal.apache.org/), [Gravitino](https://gravitino.apache.org/), [Flyte](https://flyte.org/), Gthulhu, [Mahout](https://mahout.apache.org/), and Kai-scheduler.**

I made many mindless mistakes during this process: submitting AI-generated code without careful checking, missing co-authors because I overlooked issue discussions. But the mentors in the community always reminded me with kindness. These mistakes made me more cautious and taught me to be responsible for every line of code.

. . .

> "Believe in yourself. Not in the you who believes in me. Not in the me who believes in you. Believe in the you who believes in yourself!" — Kamina, *Gurren Lagann*

## The Strategy

How did I choose a project? My core strategy was: **Find undervalued infrastructure projects.**

### A. Aim to sell shovels to gold diggers
The two major bottlenecks in the AI era are **Compute (GPU)** and **Storage**. No matter how models change, the underlying infrastructure is always a necessity.

* **Apache Ozone (Storage):** Solves massive data storage (Data Lake). Although it only has 1.1k stars, in the era of rising SSD prices and Big Data, its value will only increase.
* **Kai-scheduler (Compute):** Originated from Run:ai (acquired by Nvidia). Although it doesn't have many stars, it is currently unrivaled in the granularity of GPU scheduling.

### B. Observe corporate trends
Kai-scheduler was the core product of Run:ai, which means its technical path has been verified by the market (Nvidia) as top-tier. Even with a low star count, the technical value is extremely high.

### C. Avoid red oceans, compete through differentiation
When everyone was rushing to build models or mainstream frameworks, we chose to work on **QDP (Quantum Data Plane)** in Mahout, avoiding a direct confrontation with Nvidia CUDA-Q. This is classic differentiation strategy.

### D. Activity > Star Count
A project like Ozone, with stable weekly active contributors, is much more vital than projects with high star counts but no maintenance.

But I think the most important criterion is: **Do you really like it? Do you like it enough to dedicate a whole weekend to contributing to it?**

. . .

> "Human ability is limited, but exactly because of that, we need to rely on partners." — *Naruto*

## The Rebirth of Mahout

Around November 2025, **Guan-Ming Chiu** and I discussed the future of Apache Mahout. At that time, Mahout was in decline, with only the quantum computing platform (qumat) path left, yet it faced strong competition from Nvidia CUDA-Q.

We didn't want to reinvent the wheel, so Guan-Ming and I drafted a proposal: **QDP (Quantum Data Plane)**. Our goal was to solve the **pain points of QML preprocessing**: calculating results from Raw Data directly using algorithms and converting them into quantum states on GPUs for QML use. This solved the performance bottleneck of traditional Qiskit and Pennylane, which had to rely on CPUs to run algorithms in the Big Data era.

The success of the POC is attributed to powerful partners:

* **Jie-Kai**
* **Ryan Huang**
* **Guan-ming**

Without them, none of this would have been possible. Finally, with the recommendations of Guan-Ming, Trevor, and akm, I was honored to become an **Apache Mahout Committer**. This road is not over yet. In the future, I will continue to deepen my work in Mahout and contribute more to Ozone and Kai-scheduler.

This open-source journey has just begun for me. I've learned many things that cannot be learned in school or typical workplaces: developing within hundreds of thousands of lines of code, understanding existing massive architectures, logic, and historical baggage while developing or modifying, interacting with experts from different countries, and experiencing a systematic, rigorous development process. Of course, there is still much to learn.

Open source is not a "winner takes all" competition, but an "Infinite Game." Here, we don't need to step on others to climb up. Instead, we work with the world's top experts to **make the pie bigger and go to higher, further places together**. My deepest thanks to Dr. Tsai and everyone at "Open Source for You" for growing and learning together.

> "The place we are heading to next cannot be reached by courage alone." — *One Piece*

---

## If you want to join Open Source but don't know the direction
* [Open Source for You FB](https://www.facebook.com/opensource4you/)
* [Open Source for You Slack](opensource4you.tw/slack/join)
    My ID inside is **Kuan-Hao Huang**. Feel free to DM me on Slack if you have questions.

. . .

## What are the benefits of becoming an Apache Committer?
* IntelliJ All Products Pack
* Azure Credits/Benefits
* A cool `apache.org` email account

. . .

A small plug for my [LinkedIn](https://www.linkedin.com/in/kuan-hao-h/)