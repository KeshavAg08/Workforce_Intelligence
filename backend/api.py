import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from industry_analysis import IndustryDashboard
from company_analysis import CompanyAnalysis
from resume_analyzer import ResumeAnalyzer
import uvicorn
from typing import List
from fastapi import UploadFile, File, Form, Depends
from fastapi.security import OAuth2PasswordRequestForm
import os
import shutil
from sqlalchemy.orm import Session
import database, models, auth

app = FastAPI(title="Workforce Pipeline Risk System API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Logic
dashboard_logic = IndustryDashboard()
company_logic = CompanyAnalysis()
resume_logic = ResumeAnalyzer()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Industry Dashboard API is running"}

# --- AUTH ENDPOINTS ---

@app.post("/auth/register")
def register_user(
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    db: Session = Depends(database.get_db)
):
    if role not in ["INDUSTRY_USER", "STUDENT_USER"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user = models.User(
        email=email,
        hashed_password=auth.get_password_hash(password),
        role=role
    )
    db.add(user)
    db.commit()
    return {"message": "User registered successfully"}

@app.post("/auth/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

# --- PROTECTED DATA ENDPOINTS ---

@app.get("/industries")
def get_industries():
    # Publicly accessible for now to populate selectors
    if dashboard_logic.data is None:
        dashboard_logic.load_data()
    industries = dashboard_logic.data['Industry'].unique().tolist()
    return {"industries": industries}

@app.get("/companies/{industry}")
def get_companies(
    industry: str,
    current_user: models.User = Depends(auth.get_current_user)
):
    # Both roles can see companies
    companies = company_logic.companies.get(industry, [])
    if not companies:
        raise HTTPException(status_code=404, detail="Industry not found")
    return {"companies": companies}

@app.get("/jobs/{industry}")
def get_jobs(
    industry: str,
    current_user: models.User = Depends(auth.get_current_user)
):
    # Student focused but safe for both
    jobs_data = resume_logic.load_jobs()
    jobs = jobs_data.get(industry, [])
    return {"jobs": jobs}

@app.get("/dashboard/{industry}/{year}")
def get_dashboard_data(
    industry: str, 
    year: int,
    user: models.User = Depends(auth.role_required(["INDUSTRY_USER"]))
):
    try:
        result = dashboard_logic.run_analysis(industry, year)
        if "error" in result:
             raise HTTPException(status_code=404, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/student/dashboard/{industry}/{year}")
def get_student_dashboard_data(
    industry: str, 
    year: int,
    user: models.User = Depends(auth.role_required(["STUDENT_USER"]))
):
    try:
        result = dashboard_logic.run_student_analysis(industry, year)
        if "error" in result:
             raise HTTPException(status_code=404, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/company/compare")
def compare_companies(
    industry: str, 
    companies: str, 
    year: int,
    user: models.User = Depends(auth.role_required(["STUDENT_USER"]))
):
    try:
        company_list = companies.split(',')
        result = company_logic.compare_companies(industry, company_list, year)
        if isinstance(result, dict) and "error" in result:
             raise HTTPException(status_code=404, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/resume/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    industry: str = Form(...),
    company: str = Form(...),
    job_title: str = Form(...),
    year: int = Form(2026),
    user: models.User = Depends(auth.role_required(["STUDENT_USER"]))
):
    try:
        temp_dir = "temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        file_path = os.path.join(temp_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        result = resume_logic.analyze_resume(file_path, industry, company, job_title, year)
        os.remove(file_path)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
