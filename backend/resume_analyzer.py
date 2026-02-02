import PyPDF2
import re
import json
import os
from industry_analysis import IndustryDashboard
from company_analysis import CompanyAnalysis

class ResumeAnalyzer:
    def __init__(self):
        self.industry_dashboard = IndustryDashboard()
        self.company_logic = CompanyAnalysis()
        self.data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
        self.jobs_file = os.path.join(self.data_dir, 'jobs.json')
        self.skill_normalization = {
            "ml": "machine learning",
            "ai": "artificial intelligence",
            "js": "javascript",
            "aws": "amazon web services",
            "genai": "generative ai",
            "nlp": "natural language processing"
        }

    def load_jobs(self):
        if os.path.exists(self.jobs_file):
            with open(self.jobs_file, 'r') as f:
                return json.load(f)
        return {}

    def extract_text(self, pdf_path):
        """Extracts and normalizes text from a PDF file."""
        text = ""
        try:
            with open(pdf_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    content = page.extract_text()
                    if content:
                        text += content + " "
        except Exception as e:
            print(f"Error extracting PDF: {e}")
            return ""
        
        # Normalize
        text = text.lower()
        # Remove non-alphanumeric characters but keep spaces
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        return text

    def analyze_resume(self, pdf_path, industry, company, job_title, year=2026):
        resume_text = self.extract_text(pdf_path)
        if not resume_text:
            return {"error": "Could not extract text from resume"}

        # 1. Load Skills Dictionary
        jobs_data = self.load_jobs()
        industry_jobs = jobs_data.get(industry, [])
        selected_job = next((j for j in industry_jobs if j['title'] == job_title), None)
        
        if not selected_job:
            return {"error": f"Job {job_title} not found in {industry}"}

        core_skills = [s.lower() for s in selected_job['core_skills']]
        
        # Industry & Future Skills from IndustryDashboard
        industry_info = self.industry_dashboard.run_student_analysis(industry, year)
        industry_skills_raw = industry_info.get("Student_Insights", {}).get("Skills", {})
        
        # Flatten skills
        def extract_names(skill_list):
            return [s['name'].lower() for s in skill_list if s and 'name' in s]

        industry_skills = extract_names(industry_skills_raw.get("in_demand", []))
        future_skills = extract_names(industry_skills_raw.get("future", []))

        # 2. Matching Logic
        def check_skills(skill_list):
            found = []
            missing = []
            for skill in skill_list:
                # Basic normalization check
                variants = [skill]
                for k, v in self.skill_normalization.items():
                    if skill == v: variants.append(k)
                    if skill == k: variants.append(v)
                
                if any(re.search(r'\b' + re.escape(v) + r'\b', resume_text) for v in variants):
                    found.append(skill.title())
                else:
                    missing.append(skill.title())
            return found, missing

        found_core, missing_core = check_skills(core_skills)
        found_ind, missing_ind = check_skills(industry_skills)
        found_fut, missing_fut = check_skills(future_skills)

        # 3. ATS Match Score (0-100)
        # Match_Score = (Core/Total * 60) + (Ind/Total * 30) + (Fut/Total * 10)
        core_score = (len(found_core) / len(core_skills) * 60) if core_skills else 60
        ind_score = (len(found_ind) / len(industry_skills) * 30) if industry_skills else 30
        fut_score = (len(found_fut) / len(future_skills) * 10) if future_skills else 10
        
        final_score = round(core_score + ind_score + fut_score)
        final_score = min(100, max(0, final_score))

        # 4. Readiness Level
        if final_score >= 80: readiness = "High"
        elif final_score >= 50: readiness = "Moderate"
        else: readiness = "Critical Review Needed"

        # 5. Rule-based Recommendations
        recommendations = []
        if missing_core:
            recommendations.append(f"Focus on mastering core job requirements: {', '.join(missing_core[:2])}.")
        if missing_ind:
            recommendations.append(f"Enhance your industry alignment by adding projects related to {missing_ind[0]}.")
        if missing_fut:
            recommendations.append(f"Prepare for 2026 hiring trends by learning {missing_fut[0]}.")
        
        if final_score > 70:
            recommendations.append("Your resume shows strong readiness for the current hiring window.")
        else:
            recommendations.append("Strengthening foundational skills will significantly improve your match rate.")

        return {
            "ATS_Match_Score": final_score,
            "Readiness_Level": readiness,
            "Found_Skills": found_core + found_ind + found_fut,
            "Missing_Critical_Skills": missing_core,
            "Missing_Industry_Skills": missing_ind,
            "Missing_Future_Skills": missing_fut,
            "Recommendations": recommendations
        }
