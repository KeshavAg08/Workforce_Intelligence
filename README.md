# Workforce Intelligence Analytics System

A full-stack predictive analytics platform for monitoring industry workforce risk, talent supply-demand gaps, and providing AI-driven career intelligence for students.

## 🚀 Project Structure

```text
Testing/
├── backend/              # Core API and Analytic logic
│   ├── api.py            # FastAPI entry point
│   └── industry_analysis.py # ML & Risk Forecasting Logic
├── data/                 # Dataset CSVs
│   ├── attrition_data.csv
│   ├── industry_growth.csv
│   └── internship_data.csv
├── frontend/             # Vite + React + Tailwind Dashboard
└── README.md             # This file
```

## 🛠️ Features
- **Industry View**: High-level risk monitoring, percentile-based normalization, and 2026 hiring pressure forecasting.
- **Student View**: Reframed Career Intelligence with action-oriented guidance, differentiated competition labels, and skill intelligence mapping.
- **Predictive Engine**: Random Forest and Linear Regression models for multi-factor trend forecasting.

## 🏃 Running the Project

### 1. Start Backend
```bash
cd backend
python api.py
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
