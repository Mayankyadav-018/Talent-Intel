# Talent-Intel

> AI-powered talent intelligence and candidate scoring platform for streamlined recruitment.

Talent-Intel is a full-stack recruitment platform designed to help recruiters ingest candidate information, process resumes, evaluate candidate profiles, and manage recruitment data through a centralized interface.

The project follows a service-oriented architecture with a dedicated frontend and backend candidate service, backed by Supabase for data persistence and storage.

---

## 🚀 Features

- 📄 **Resume Ingestion**
  - Upload and process candidate resumes.
  - Extract structured candidate information from uploaded documents.

- 👤 **Candidate Management**
  - Store and manage candidate profiles.
  - View detailed candidate information through a dedicated candidate dashboard.

- 📊 **Candidate Scoring**
  - Evaluate candidates using a structured talent-scoring system.
  - Generate candidate scores based on profile information and relevant attributes.

- 🔎 **Candidate Search**
  - Search and browse candidate profiles.
  - Quickly access candidate information from the recruitment dashboard.

- 🔐 **Authentication & Data Management**
  - Supabase-powered authentication and database integration.
  - Secure separation between client-side and server-side operations.

- 🏗️ **Service-Oriented Backend**
  - Dedicated candidate service for resume processing, candidate management, and backend operations.
  - REST API endpoints for frontend-backend communication.

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │      Recruiter      │
                         │     Web Interface   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Frontend       │
                         │   Talent-Intel UI   │
                         │ React + TypeScript  │
                         └──────────┬──────────┘
                                    │
                              HTTP / API
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │       Candidate Service      │
                    │                              │
                    │  Controllers                 │
                    │  Routes                      │
                    │  Candidate Service            │
                    │  Resume Processing            │
                    │  Scoring                      │
                    └──────────────┬───────────────┘
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
          ┌─────────────────────┐     ┌─────────────────────┐
          │      Supabase       │     │   Resume / AI       │
          │                     │     │    Processing        │
          │ Database + Storage  │     │                     │
          └─────────────────────┘     └─────────────────────┘

🛠️ Tech Stack
Frontend
React
TypeScript
Vite
TanStack Router
Tailwind CSS
shadcn/ui
Backend
Node.js
TypeScript
Hono
Cloudflare Workers
REST APIs
Database & Storage
Supabase
PostgreSQL
Supabase Storage
Development
Git & GitHub
VS Code
npm / Bun
Wrangler
📁 Project Structure
Talent-Intel/
│
├── candidate-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── package.json
│   └── wrangler.jsonc
│
├── talent-spark-92-main/
│   └── talent-spark-92-main/
│       ├── src/
│       │   ├── components/
│       │   ├── integrations/
│       │   ├── lib/
│       │   └── routes/
│       │
│       ├── public/
│       ├── package.json
│       └── vite.config.ts
│
├── docs/
│   ├── architecture.md
│   ├── api-contract.md
│   ├── database-schema.md
│   └── integration-guide.md
│
├── .env.example
├── .gitignore
└── README.md
🔄 Application Flow
1. Candidate Ingestion

A recruiter uploads a candidate resume through the Talent-Intel frontend.

2. Backend Processing

The frontend communicates with the Candidate Service through API endpoints.

3. Resume Processing

The backend processes the uploaded resume and converts relevant candidate information into structured data.

4. Candidate Storage

Candidate information and associated resume data are stored using Supabase.

5. Candidate Scoring

The candidate profile is evaluated using the platform's talent-scoring logic.

6. Recruiter Dashboard

Recruiters can browse candidates, inspect individual profiles, and use the resulting candidate information to support recruitment decisions.

⚙️ Getting Started
Prerequisites

Make sure you have:

Node.js 18+
npm
Git
A Supabase project
Clone the Repository
git clone https://github.com/Mayankyadav-018/Talent-Intel.git

cd Talent-Intel
🔧 Backend Setup
cd candidate-service

npm install

Create the required environment variables using the provided example:

cp ../.env.example .env

Configure your Supabase and other backend credentials in .env.

Start the development server:

npm run dev
💻 Frontend Setup

Open another terminal:

cd talent-spark-92-main/talent-spark-92-main

npm install

Configure the required frontend environment variables.

Start the development server:

npm run dev

The frontend will then be available through the local Vite development server.

🔐 Environment Variables

Environment variables are intentionally excluded from version control.

Create your local .env file based on:

.env.example

Never commit API keys, service-role keys, or other credentials to GitHub.

📚 Documentation

Additional project documentation is available in the docs directory.

Architecture
API Contract
Database Schema
Integration Guide
Development Plan
🎯 Project Goals

Talent-Intel was developed to demonstrate how a modern recruitment platform can combine:

Full-stack web development
REST API architecture
Cloud-based backend services
Document processing
Candidate data management
Automated candidate scoring
Database and object storage
Authentication
Service-oriented application design
🔮 Future Improvements

Potential future enhancements include:

Advanced semantic candidate search
Job-description-to-candidate matching
Improved ranking algorithms
Recruiter analytics and hiring dashboards
Candidate recommendation pipelines
Automated interview workflows
Production-grade observability and monitoring
Role-based access control
👨‍💻 Author

Mayank Yadav

Third-year Electronics & Telecommunication Engineering student at Symbiosis Institute of Technology, Pune.

Interested in:

Cloud Computing
Backend Engineering
Full-Stack Development
DevOps
Distributed Systems
⭐ Project

If you find this project interesting, consider giving the repository a ⭐.

GitHub:
https://github.com/Mayankyadav-018/Talent-Intel


## 📸 Screenshots

### Recruiter Dashboard

![Recruiter Dashboard](./docs/screenshots/dashboard.png)

### Candidate Profile

![Candidate Profile](./docs/screenshots/candidate-profile.png)

### Resume Ingestion

![Resume Ingestion](./docs/screenshots/resume-ingestion.png)