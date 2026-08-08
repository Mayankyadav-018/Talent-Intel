# Candidate Service

Data Ingestion & Parsing Service for the **Logic Loop Hackathon**.

---

## 📌 Overview

The Candidate Service is responsible for ingesting candidate data from multiple sources, parsing and normalizing it, and exposing clean REST APIs for other modules in the platform.

This service acts as the central source of candidate information for downstream AI and recruiter modules.

---

## 🚀 Tech Stack

- Hono
- Cloudflare Workers
- TypeScript
- Supabase (PostgreSQL)
- GitHub API
- Google Gemini (planned)

---

## 📂 Features

- Resume Upload
- Resume Parsing
- GitHub Integration
- PPT Parsing
- Data Normalization
- Candidate Profile APIs

---

## 📦 Installation

```bash
npm install
```

---

## ▶️ Run Locally

```bash
npm run dev
```

---

## 🚀 Deploy

```bash
npm run deploy
```

---

## 🔧 Generate Cloudflare Types

```bash
npm run cf-typegen
```

---

## 📁 Project Status

🚧 Under Development