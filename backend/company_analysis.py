import pandas as pd
import numpy as np
from industry_analysis import IndustryDashboard
import json

class CompanyAnalysis:
    def __init__(self, dashboard=None):
        self.industry_dashboard = dashboard or IndustryDashboard()
        self.companies = {
            "IT": ["MetaSystems", "CyberCloud", "DataPulse", "NexTech", "CloudCore"],
            "Healthcare": ["BioHealth", "MediLife", "NanoCare", "PulseMedical", "LifeStream"],
            "Manufacturing": ["SteelForge", "AutoMaker", "IndustrialX", "GlobalFab", "PrecisionParts"],
            "EV": ["VoltMotors", "ChargePoint", "EcoDrive", "LithiumIon", "SparkEV"],
            "Finance": ["WealthWise", "SecureBank", "FinFlow", "CapitalOne", "TradeMaster"]
        }

    def get_company_metrics(self, industry, year, company_name):
        """
        Derives deterministic company metrics from industry baselines.
        Uses the company name as a seed for stable scaling factors.
        """
        # Get industry baseline
        industry_data = self.industry_dashboard.run_analysis(industry, year, include_companies=False)
        if "error" in industry_data:
            return industry_data

        metrics = industry_data["Metrics"]
        
        # Use company name to generate a stable seed
        seed = sum(ord(c) for c in company_name) + year
        np.random.seed(seed)

        # Scale Factor ∈ [0.8, 1.2]
        scale_factor = 0.8 + (np.random.rand() * 0.4)
        # Growth Bias reflects startup vs enterprise (randomly assigned but stable)
        growth_bias = 0.7 + (np.random.rand() * 0.6)
        # Variance for attrition and conversion
        attr_variance = (np.random.rand() - 0.5) * 0.05
        conv_variance = (np.random.rand() - 0.5) * 0.04

        # Company Level Raw Metrics
        comp_intern_intake = metrics["Internship_Intake"] * scale_factor
        comp_conv_rate = max(0.4, min(0.95, metrics["Conversion_Rate"] + conv_variance))
        comp_attr_rate = max(0.02, min(0.35, metrics["Attrition_Rate"] + attr_variance))
        comp_growth_rate = metrics["Growth_Rate"] * growth_bias

        # Talent Supply (Raw)
        supply_raw = comp_intern_intake * comp_conv_rate
        # Talent Demand (Raw)
        demand_raw = comp_growth_rate + (comp_attr_rate * 1.5)

        return {
            "Company": company_name,
            "Industry": industry,
            "Year": year,
            "Raw": {
                "Supply": supply_raw,
                "Demand": demand_raw,
                "Internship_Intake": comp_intern_intake,
                "Conversion_Rate": comp_conv_rate,
                "Attrition_Rate": comp_attr_rate,
                "Growth_Rate": comp_growth_rate
            }
        }

    def compare_companies(self, industry, selected_companies, year):
        """
        Compares multiple companies in an industry with P5-P95 normalization.
        """
        # 1. Generate Raw Metrics for ALL companies in the industry for normalization context
        all_companies = self.companies.get(industry, [])
        if not all_companies:
            return {"error": f"Industry {industry} not found"}

        industry_raw_data = []
        for company in all_companies:
            data = self.get_company_metrics(industry, year, company)
            industry_raw_data.append(data)

        # 2. Compute P5/P95 within industry
        df = pd.DataFrame([
            {
                "Company": d["Company"],
                "Supply_Raw": d["Raw"]["Supply"],
                "Demand_Raw": d["Raw"]["Demand"],
                "Attrition": d["Raw"]["Attrition_Rate"],
                "Conversion": d["Raw"]["Conversion_Rate"]
            }
            for d in industry_raw_data
        ])

        p5_supply = df["Supply_Raw"].quantile(0.05)
        p95_supply = df["Supply_Raw"].quantile(0.95)
        p5_demand = df["Demand_Raw"].quantile(0.05)
        p95_demand = df["Demand_Raw"].quantile(0.95)

        # Logging for validation
        print(f"\n--- Normalization Context ({industry} {year}) ---")
        print(f"P5 Supply: {p5_supply:.2f}, P95 Supply: {p95_supply:.2f}")
        print(f"P5 Demand: {p5_demand:.2f}, P95 Demand: {p95_demand:.2f}")

        def normalize(val, p5, p95):
            range_val = p95 - p5 if p95 != p5 else 1.0
            clipped = np.clip(val, p5, p95)
            return ((clipped - p5) / range_val) * 100

        comparison_results = []
        for d in industry_raw_data:
            if d["Company"] not in selected_companies:
                continue

            supply_score = normalize(d["Raw"]["Supply"], p5_supply, p95_supply)
            demand_score = normalize(d["Raw"]["Demand"], p5_demand, p95_demand)

            # Clamp to [10, 90] for better UI separation
            supply_score = max(10, min(90, supply_score))
            demand_score = max(10, min(90, demand_score))

            # Risk = (Demand_Score - Supply_Score) + (Attrition * 15)
            risk = (demand_score - supply_score) + (d["Raw"]["Attrition_Rate"] * 15)
            risk = max(0, min(100, risk))

            # HPI = (Demand_Score - Supply_Score) + (Attrition * 20) + (Demand_Trend * 0.8)
            # Since we don't have multi-year company trend yet, we use a stable company-specific random trend
            np.random.seed(sum(ord(c) for c in d["Company"]))
            trend_proxy = (np.random.rand() - 0.5) * 10
            hpi = (demand_score - supply_score) + (d["Raw"]["Attrition_Rate"] * 20) + (trend_proxy * 0.8)

            # Surge Mapping
            if hpi >= 30:
                surge = "1-3 months"
            elif hpi >= 15 or trend_proxy > 0:
                surge = "4-6 months"
            else:
                surge = "6-12 months"

            # Rule-based Insights
            insights = []
            if d["Raw"]["Attrition_Rate"] > 0.15:
                insights.append("High attrition is driving elevated hiring pressure.")
            if supply_score > 70:
                insights.append("Strong internal talent pipeline reduces supply-side risk.")
            if demand_score > 75:
                insights.append("Rapid growth requirements are outpacing current supply.")
            if risk < 30:
                insights.append("Workforce stability is exceptionally high.")
            
            if not insights:
                insights.append("Workforce metrics are currently in a state of equilibrium.")

            comparison_results.append({
                "Company": d["Company"],
                "Metrics": {
                    "Supply_Score": round(supply_score, 2),
                    "Demand_Score": round(demand_score, 2),
                    "Risk_Score": round(risk, 2),
                    "Risk_Level": "Low Risk" if risk < 30 else "Medium Risk" if risk < 60 else "High Risk",
                    "Attrition_Rate": round(d["Raw"]["Attrition_Rate"], 3),
                    "Hiring_Surge": surge if year == 2026 else None
                },
                "Insights": insights[:2]
            })

        return comparison_results

if __name__ == "__main__":
    ca = CompanyAnalysis()
    print("\n--- Testing Comparison for IT 2026 ---")
    results = ca.compare_companies("IT", ["MetaSystems", "CyberCloud", "NexTech"], 2026)
    print(json.dumps(results, indent=2))
