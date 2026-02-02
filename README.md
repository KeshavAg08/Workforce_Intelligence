# Workforce Pipeline Risk Forecasting System 🚀

An end-to-end **Workforce Intelligence Platform** that predicts talent shortages, hiring timelines, and skill gaps by connecting **industry trends, company behavior, and student readiness**.

This project goes beyond dashboards — it turns workforce data into **actionable decisions** for both **industries** and **job seekers**.

---

## 🌍 Problem Statement

Industries struggle to answer:
- When will we need to hire?
- Is our talent pipeline strong enough?
- Which companies will face hiring pressure first?

Students struggle to answer:
- Which industries are hiring next?
- Which companies should I target?
- How ready is my resume for future jobs?

**This system bridges that gap.**

---

## 🧠 Solution Overview

The platform uses **rule-based, explainable AI logic** (not black-box models) to:

- Forecast workforce risk
- Predict hiring surge timelines
- Compare companies within an industry
- Guide students on skills, jobs, and resume readiness

> Same data. Different decisions.

---

## 🧩 Key Features

### 🔹 Industry Dashboard
- Talent Supply vs Demand analysis
- Workforce Risk Score (0–100)
- Dynamic baseline risk
- Hiring Surge Prediction (2026 only)
- What-If Simulation for workforce planning

### 🔹 Student / Job Seeker Dashboard
- Hiring outlook in simple terms
- Competition level (High / Balanced / Opportunity-rich)
- Skill demand intelligence
- Career preparation guidance
- Industry switch suggestions

### 🔹 Company-Wise Comparison
- Compare companies within the same industry
- Supply, Demand, Risk & Hiring Timeline
- Synthetic but logically derived company data

### 🔹 Resume Analyzer
- ATS Match Score (0–100)
- Skill gap detection:
  - Critical gaps
  - Industry alignment gaps
  - Future readiness gaps
- Resume improvement guidance
- Aligned with future hiring trends

### 🔹 Security & Role-Based Access (RBAC)
- JWT-based authentication
- Two roles:
  - **INDUSTRY_USER** → Industry Dashboard only
  - **STUDENT_USER** → Student Dashboard, Company Comparison, Resume Analyzer

---

## 🏗️ Architecture

User (Browser)
↓
Frontend (React + TypeScript + Tailwind)
↓ REST APIs (JSON)
Backend (FastAPI – Python)
↓
Analytics & Simulation Logic
↓
SQLite Database (Dev) / PostgreSQL (Prod-ready)


---

## 📐 Core Logic & Formulas

### Talent Supply
Supply = Internship_Intake × Conversion_Rate


### Talent Demand
Demand = Growth_Rate + (Attrition_Rate × 1.5)


### Normalization
- Percentile-based normalization (P5–P95)
- Applied per industry
- Prevents artificial 0/100 spikes

### Workforce Risk Score
Core_Risk = (Demand_Score − Supply_Score) + (Attrition × 15)

Baseline_Risk = 5 + (Attrition × 10) + (Demand_Trend × 0.5)

Final_Risk = max(Core_Risk, Baseline_Risk)


### Hiring Pressure Index (HPI)
HPI = (Demand − Supply) + (Attrition × 20) + (Demand_Trend × 0.8)


Mapped to:
- **1–3 months** → Immediate hiring
- **4–6 months** → Near-term hiring
- **6–12 months** → Planned hiring

---

## 🛠️ Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Recharts

### Backend
- FastAPI (Python)
- Pydantic
- SQLAlchemy

### Database
- SQLite (development)
- PostgreSQL (production-ready)

### Security
- JWT Authentication
- Role-Based Access Control
- Password hashing (bcrypt)

---

## 📊 Data Strategy

- Synthetic but derived data
- No random values at runtime
- Company data derived from industry baselines
- Deterministic and reproducible outputs

---

## 🧪 Validation & Reliability

- Percentile normalization avoids misleading extremes
- Debug logging for intermediate values
- Same inputs → same outputs
- Stable across refreshes
- Transparent and judge-friendly

---
## 🛠️ How to Run Locally

🔹 Backend Setup

cd backend
pip install -r requirements.txt
uvicorn main:app --reload
🔹 Frontend Setup

cd frontend
npm install
npm run dev

---

## 🎯 Project Highlights
Unlike generic dashboards, this project focuses on high-impact insights:

Specific Utility: Not a LinkedIn clone or a generic ML dashboard.

Predictive Power: Focuses specifically on when hiring will happen.

Bridging the Gap: Directly connects industry decisions with student career planning.

Transparency: Built with Fully Explainable AI (XAI) logic so users understand the "why" behind the predictions.

## 🧠 Future Enhancements
- Real Job Postings: Integration with live job boards.

- Resume Versioning: Track how different resume iterations perform.

- Skill Similarity Mapping: Visualizing how current skills align with market demand.

- Admin Analytics: Insights for institutional or platform administrators.

- Cloud Deployment: Moving from local hosting to AWS/GCP/Azure.
---
## 📌 License
This project is for educational and demonstration purposes.

## 🙌 Author
Keshav Agarwal.