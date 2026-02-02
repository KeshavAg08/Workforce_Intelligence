import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
import json
import os

# Configuration
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')

class IndustryDashboard:
    def __init__(self):
        self.data = None
        self.scalers = {}
        self.models = {}
        self.future_years = [2027, 2028, 2029]
        self.normalization_bounds = {}

    def load_data(self):
        if self.data is not None:
            return
        try:
            attrition = pd.read_csv(os.path.join(DATA_DIR, 'attrition_data.csv'))
            growth = pd.read_csv(os.path.join(DATA_DIR, 'industry_growth.csv'))
            internship = pd.read_csv(os.path.join(DATA_DIR, 'internship_data.csv'))
            
            # Merge datasets on Industry and Year
            df = attrition.merge(growth, on=['Industry', 'Year'])
            df = df.merge(internship, on=['Industry', 'Year'])
            
            self.data = df
            print("Data loaded successfully.")
        except Exception as e:
            print(f"Error loading data: {e}")
            raise

    def calculate_raw_metrics(self, df):
        # Talent Supply (Raw) = Internship_Intake * Conversion_Rate
        df['Talent_Supply_Raw'] = df['Interns_Intake'] * df['Conversion_Rate']
        
        # Talent Demand (Raw Index) = (Growth_Rate * 1.0) + (Attrition_Rate * 1.5)
        df['Talent_Demand_Raw'] = (df['Growth_Rate'] * 1.0) + (df['Attrition_Rate'] * 1.5)
        return df

    def calculate_scores(self, df):
        # Calculate raw metrics first if not present
        if 'Talent_Supply_Raw' not in df.columns:
            df = self.calculate_raw_metrics(df)
            
        print("\n--- Percentile-Based Normalization (P5-P95) ---")
        
        def normalize_group(group):
            industry = group.name
            
            # Compute P5 and P95 percentiles for outlier-resistant normalization
            p5_supply = group['Talent_Supply_Raw'].quantile(0.05)
            p95_supply = group['Talent_Supply_Raw'].quantile(0.95)
            
            p5_demand = group['Talent_Demand_Raw'].quantile(0.05)
            p95_demand = group['Talent_Demand_Raw'].quantile(0.95)
            
            print(f"  Supply P5: {p5_supply:.2f}, P95: {p95_supply:.2f}")
            print(f"  Demand P5: {p5_demand:.2f}, P95: {p95_demand:.2f}")
            
            # Store for What-If Simulation context
            self.normalization_bounds[industry] = {
                'supply': (p5_supply, p95_supply),
                'demand': (p5_demand, p95_demand)
            }
            
            # Clip values to P5-P95 range to avoid extreme outliers
            supply_clipped = group['Talent_Supply_Raw'].clip(p5_supply, p95_supply)
            demand_clipped = group['Talent_Demand_Raw'].clip(p5_demand, p95_demand)
            
            # Normalize using clipped range
            supply_range = p95_supply - p5_supply if p95_supply != p5_supply else 1.0
            demand_range = p95_demand - p5_demand if p95_demand != p5_demand else 1.0
            
            group['Talent_Supply_Score'] = ((supply_clipped - p5_supply) / supply_range) * 100
            group['Talent_Demand_Score'] = ((demand_clipped - p5_demand) / demand_range) * 100
            
            # Debug sample row (first row of group)
            if len(group) > 0:
                sample_idx = group.index[0]
                print(f"  Sample Row {group.loc[sample_idx, 'Year']:.0f}:")
                print(f"    Supply - Raw: {group.loc[sample_idx, 'Talent_Supply_Raw']:.2f}, "
                      f"Clipped: {supply_clipped.loc[sample_idx]:.2f}, "
                      f"Normalized: {group.loc[sample_idx, 'Talent_Supply_Score']:.2f}")
                print(f"    Demand - Raw: {group.loc[sample_idx, 'Talent_Demand_Raw']:.2f}, "
                      f"Clipped: {demand_clipped.loc[sample_idx]:.2f}, "
                      f"Normalized: {group.loc[sample_idx, 'Talent_Demand_Score']:.2f}")
            
            return group

        df = df.groupby('Industry', group_keys=False).apply(normalize_group)
        
        # Prevent extreme 0 and 100 values (clamp to realistic range)
        # Scores are clamped to 10-90 to avoid misleading absolutes and provide better separation
        df['Talent_Supply_Score'] = df['Talent_Supply_Score'].clip(10, 90)
        df['Talent_Demand_Score'] = df['Talent_Demand_Score'].clip(10, 90)
        
        # Dynamic Baseline Risk (varies by year based on market conditions)
        # 
        # Formula: baseline = BASE + (Attrition × Attrition_Factor) + (Demand_Trend × Trend_Factor)
        # 
        # Rationale: Risk should fluctuate naturally year-to-year, not remain constant.
        # - Attrition component: Higher attrition → higher baseline operational risk
        # - Demand trend component: Growing demand → increased baseline pressure
        # - Ensures risk never collapses to zero while maintaining year-to-year variance
        
        BASE_RISK = 5
        ATTRITION_FACTOR = 10
        TREND_FACTOR = 0.5
        ATTRITION_WEIGHT = 15
        
        # Calculate demand trend (change from previous year) per industry
        def calculate_dynamic_risk(group):
            # Sort by year to ensure correct trend calculation
            group = group.sort_values('Year')
            
            # Calculate demand trend (current - previous year)
            group['Demand_Trend'] = group['Talent_Demand_Score'].diff().fillna(0)
            
            # Dynamic baseline = BASE + (Attrition × Factor) + (Demand_Trend × Factor)
            # Ensure baseline never drops below BASE_RISK floor
            dynamic_baseline = (
                BASE_RISK 
                + (group['Attrition_Rate'] * ATTRITION_FACTOR)
                + (group['Demand_Trend'] * TREND_FACTOR)
            )
            dynamic_baseline = dynamic_baseline.clip(lower=BASE_RISK)
            
            # Core risk = (Demand - Supply) + (Attrition × Weight)
            core_risk = (
                (group['Talent_Demand_Score'] - group['Talent_Supply_Score'])
                + (group['Attrition_Rate'] * ATTRITION_WEIGHT)
            )
            
            # Final risk = max(dynamic_baseline, core_risk)
            group['Risk_Score'] = core_risk.combine(dynamic_baseline, max)
            
            return group
        
        df = df.groupby('Industry', group_keys=False).apply(calculate_dynamic_risk)
        
        # Final safety clamp
        df['Risk_Score'] = df['Risk_Score'].clip(0, 100)
        
        return df

    def get_risk_level(self, score):
        if score <= 35:
            return "Low Risk"
        elif score <= 65:
            return "Medium Risk"
        else:
            return "High Risk"

    def train_models(self):
        if self.models:
            return
        # Predict: Interns_Intake, Conversion_Rate, Growth_Rate, Attrition_Rate
        targets = ['Interns_Intake', 'Conversion_Rate', 'Growth_Rate', 'Attrition_Rate']
        
        # Features: Year, Industry (One-Hot)
        X = self.data[['Year', 'Industry']]
        X_encoded = pd.get_dummies(X, columns=['Industry'], drop_first=False)
        
        self.feature_columns = X_encoded.columns # Save for prediction alignment
        
        for target in targets:
            y = self.data[target]
            # Use LinearRegression for trend extrapolation (better for future believability than RF)
            model = LinearRegression()
            model.fit(X_encoded, y)
            self.models[target] = model
            
    def predict_future(self):
        # Create future dataframe
        future_rows = []
        industries = self.data['Industry'].unique()
        
        for industry in industries:
            for year in self.future_years:
                future_rows.append({'Industry': industry, 'Year': year})
                
        future_df = pd.DataFrame(future_rows)
        X_future = future_df[['Year', 'Industry']]
        X_future_encoded = pd.get_dummies(X_future, columns=['Industry'], drop_first=False)
        
        # Align columns
        for col in self.feature_columns:
            if col not in X_future_encoded.columns:
                X_future_encoded[col] = 0
        X_future_encoded = X_future_encoded[self.feature_columns]
        
        # Predict components
        for target, model in self.models.items():
            future_df[target] = model.predict(X_future_encoded)
            
        return future_df

    def get_hiring_surge(self, row, prev_row=None):
        """
        Calculate Hiring Pressure Index (HPI) and predict hiring surge window.
        
        HPI = (Demand - Supply) + (Attrition × 20) + (Demand_Trend × 0.8)
        
        Uses existing computed metrics (no recalculation):
        - Demand_Score, Supply_Score (normalized 0-100)
        - Attrition_Rate (0-1)
        - Demand_Trend (year-over-year delta, already in row)
        
        NOTE: Hiring surge prediction is intentionally limited to year 2026 only.
        This represents the current planning horizon. For all other years,
        this method returns None to prevent display of surge predictions.
        """
        
        # Design Decision: Limit hiring surge prediction to 2026 only
        if row['Year'] != 2026:
            return None
        
        # Extract demand trend (already calculated in calculate_dynamic_risk)
        demand_trend = row.get('Demand_Trend', 0)
        
        # Hiring Pressure Index (HPI)
        # Components:
        # 1. Supply-Demand gap (primary signal, can be negative)
        # 2. Attrition impact (weight 20, urgency amplifier)
        # 3. Demand trend (weight 0.8, momentum indicator)
        hpi = (
            (row['Talent_Demand_Score'] - row['Talent_Supply_Score'])
            + (row['Attrition_Rate'] * 20)
            + (demand_trend * 0.8)
        )
        
        # Map HPI to hiring surge window
        if hpi >= 30 or (hpi >= 20 and demand_trend > 5):
            return "1-3 months"  # Immediate hiring pressure
        elif hpi >= 15 or demand_trend > 0:
            return "4-6 months"  # Near-term hiring
        else:
            return "6-12 months"  # Long-term planning

    def generate_explanation(self, row):
        # Rule-based strategic insight (No AI/GPT mentions)
        
        risk_level = self.get_risk_level(row['Risk_Score'])
        reasons = []
        
        # 1. Supply-Demand Analysis
        gap = row['Talent_Demand_Score'] - row['Talent_Supply_Score']
        if gap > 20:
            reasons.append("demand significantly exceeds supply, creating critical shortage pressure")
        elif gap > 0:
            reasons.append("demand outpaces supply, tightening the talent pipeline")
        elif gap < -20:
            reasons.append("talent supply is robust relative to current market demand")
        else:
            reasons.append("supply and demand are currently in a state of relative equilibrium")
            
        # 2. Demand Trend / Momentum
        demand_trend = row.get('Demand_Trend', 0)
        if demand_trend > 10:
            reasons.append("strong demand momentum suggests accelerating hiring needs")
        elif demand_trend > 0:
            reasons.append("positive demand momentum indicates steady market growth")
        elif demand_trend < -10:
            reasons.append("declining demand trend is easing immediate workforce pressure")
            
        # 3. Attrition / Leakage
        if row['Attrition_Rate'] > 0.18: 
            reasons.append("aggressive attrition rates are accelerating workforce leakage")
        elif row['Attrition_Rate'] > 0.12:
            reasons.append("steady attrition continues to drive routine hiring requirements")
        elif row['Attrition_Rate'] < 0.05:
            reasons.append("exceptionally stable retention rates are mitigating overall risk")
            
        # 4. Baseline Risk Context
        if abs(row['Risk_Score'] - 5) < 5: # Near absolute minimum
            reasons.append("workforce risk is at a historic low for this industry")
        elif gap < 0 and row['Risk_Score'] > 20: 
            # High risk despite good supply? Must be baseline/attrition driven
            reasons.append("operational risk remains elevated due to high attrition despite healthy supply")

        # Select top 3 most relevant reasons to keep it concise
        selected_reasons = reasons[:3]
        reason_str = "; ".join(selected_reasons)
        
        # Add planning horizon context for 2026
        year_ctx = ""
        if row['Year'] == 2026:
            year_ctx = " (Current Planning Horizon)"
            
        return f"{risk_level}{year_ctx} detected. {reason_str.capitalize()}."

    def _prepare_data(self):
        self.load_data()
        self.train_models()
        future_df = self.predict_future()
        full_df = pd.concat([self.data, future_df], ignore_index=True)
        full_df = full_df.sort_values(by=['Industry', 'Year'])
        full_df = self.calculate_scores(full_df)
        return full_df

    def get_company_summaries(self, industry, target_year):
        from company_analysis import CompanyAnalysis
        ca = CompanyAnalysis(dashboard=self)
        all_companies = ca.companies.get(industry, [])
        
        # Get comparison results for all companies essentially
        results = ca.compare_companies(industry, all_companies, target_year)
        
        summaries = []
        if isinstance(results, list):
            for r in results:
                summaries.append({
                    "Company": r["Company"],
                    "Risk_Score": r["Metrics"]["Risk_Score"],
                    "Risk_Level": r["Metrics"]["Risk_Level"],
                    "Hiring_Surge": r["Metrics"]["Hiring_Surge"]
                })
        return summaries

    def run_analysis(self, target_industry, target_year, include_companies=True):
        print(f"\nRunning Industry analysis for {target_industry} {target_year}...")
        full_df = self._prepare_data()
        
        # 6. Extract specific request
        prev_year = target_year - 1
        
        row = full_df[(full_df['Industry'] == target_industry) & (full_df['Year'] == target_year)]
        
        if row.empty:
            return {"error": "Data not available for this year/industry"}
        
        row = row.iloc[0]
        
        prev_row = full_df[(full_df['Industry'] == target_industry) & (full_df['Year'] == prev_year)]
        prev_row = prev_row.iloc[0] if not prev_row.empty else None
        
        # Calculate recent demand trend for simulation/risk
        industry_df = full_df[full_df['Industry'] == target_industry].sort_values('Year')
        if len(industry_df) >= 3:
            recent_df = industry_df.tail(3)
            demand_trend = (recent_df['Talent_Demand_Score'].iloc[-1] - recent_df['Talent_Demand_Score'].iloc[0])
        else:
            demand_trend = 0
        
        # 7. Build Result
        
        # Historical Trend Data for Chart
        industry_df = full_df[full_df['Industry'] == target_industry]
        trend_data = []
        for _, r in industry_df.iterrows():
            trend_data.append({
                "Year": int(r['Year']),
                "Talent_Supply": round(r['Talent_Supply_Score'], 2),
                "Talent_Demand": round(r['Talent_Demand_Score'], 2)
            })


        result = {
            "Industry": target_industry,
            "Year": int(target_year),
            "Metrics": {
                "Talent_Supply_Score": round(row['Talent_Supply_Score'], 2),
                "Talent_Demand_Score": round(row['Talent_Demand_Score'], 2),
                "Workforce_Risk_Score": round(row['Risk_Score'], 2),
                "Risk_Level": self.get_risk_level(row['Risk_Score']),
                # Raw Metrics for Pipeline UI
                "Internship_Intake": int(row['Interns_Intake']),
                "Conversion_Rate": round(row['Conversion_Rate'], 2),
                "Attrition_Rate": round(row['Attrition_Rate'], 3),
                "Growth_Rate": round(row['Growth_Rate'], 3)
            },
            "Hiring_Surge_Timeline": self.get_hiring_surge(row, prev_row),
            "AI_Explanation": self.generate_explanation(row),
            "Supply_Demand_Trend": trend_data,
            "Simulation_Context": {
                "Supply_P5": round(self.normalization_bounds[target_industry]['supply'][0], 2),
                "Supply_P95": round(self.normalization_bounds[target_industry]['supply'][1], 2),
                "Demand_P5": round(self.normalization_bounds[target_industry]['demand'][0], 2),
                "Demand_P95": round(self.normalization_bounds[target_industry]['demand'][1], 2),
                "Demand_Trend": round(demand_trend, 2),
                "Baseline": {
                    "Internship_Intake": int(row['Interns_Intake']),
                    "Conversion_Rate": float(row['Conversion_Rate']),
                    "Attrition_Rate": float(row['Attrition_Rate']),
                    "Growth_Rate": float(row['Growth_Rate'])
                }
            }
        }
        
        if include_companies:
            result["Company_Metrics"] = self.get_company_summaries(target_industry, target_year)
        
        return result

    def get_skills_for_industry(self, industry, year):
        industry_data = self.data[self.data['Industry'] == industry]
        if industry_data.empty: return {"core":[], "in_demand":[], "future":[]}
        
        year_row = industry_data[industry_data['Year'] == year]
        if year_row.empty:
            year_row = industry_data.sort_values('Year', ascending=False)
            
        skills_str = year_row.iloc[0]['Top_Skills']
        all_skills = [s.strip() for s in skills_str.split(',')]
        
        # Expanded skill mapping - taking up to 2 skills per category if available
        return {
            "core": [
                {"name": all_skills[0], "level": "High", "why": "Essential foundational competency"} if len(all_skills) > 0 else None,
                {"name": "Communication", "level": "High", "why": "Cross-functional collaboration"} # Adding a generic but vital core skill
            ],
            "in_demand": [
                {"name": all_skills[1], "level": "Medium", "why": "High-velocity technical requirement"} if len(all_skills) > 1 else None,
                {"name": all_skills[2] if len(all_skills) > 4 else "Data Analysis", "level": "Medium", "why": "Data-driven decision making"} 
            ],
            "future": [
                {"name": all_skills[2] if len(all_skills) > 2 else "Generative AI", "level": "Emerging", "why": "Next-gen technical frontier"} if len(all_skills) > 2 else None,
                {"name": "Cloud Architecture", "level": "Emerging", "why": "Scalable infrastructure expertise"}
            ]
        }


    def get_industry_switch_suggestion(self, current_industry, target_year, full_df):
        all_industries = full_df['Industry'].unique()
        best_industry = None
        best_diff = -999
        
        curr_row = full_df[(full_df['Industry'] == current_industry) & (full_df['Year'] == target_year)]
        if curr_row.empty: return None
        curr_diff = curr_row.iloc[0]['Talent_Demand_Score'] - curr_row.iloc[0]['Risk_Score']
        
        for ind in all_industries:
            if ind == current_industry: continue
            ind_row = full_df[(full_df['Industry'] == ind) & (full_df['Year'] == target_year)]
            if ind_row.empty: continue
            
            diff = ind_row.iloc[0]['Talent_Demand_Score'] - ind_row.iloc[0]['Risk_Score']
            if diff > best_diff:
                best_diff = diff
                best_industry = ind
                
        if best_industry and best_diff > curr_diff:
            return {
                "Target_Industry": best_industry,
                "Reason": f"{best_industry} offers stronger opportunities with a better demand-to-risk ratio."
            }
        return None

    def get_student_insights(self, row, full_df):
        demand = row['Talent_Demand_Score']
        risk = row['Risk_Score']
        supply = row['Talent_Supply_Score']
        growth = row['Growth_Rate']
        conversion = row['Conversion_Rate']
        industry = row['Industry']
        
        # 1. Outlook mapping (More Granular Categories)
        if risk <= 30 and demand >= 60:
            outlook = "Excellent" if growth > 0.08 else "Favorable"
            if growth > 0.05:
                desc = f"Rapidly expanding {industry} market. Strong demand combined with high growth makes this an ideal entry point for early-career professionals."
            else:
                desc = f"Stable and favorable {industry} outlook. Consistent hiring and low risk provide a secure career trajectory."
        elif risk <= 55:
            outlook = "Promising" if conversion > 0.8 else "Moderate"
            if conversion > 0.75:
                desc = f"Balanced market with high internship-to-job conversion. Competition exists, but focus on hands-on experience as a primary differentiator."
            else:
                desc = f"Transitional {industry} market. Evolving industry requirements mean students should focus on both traditional and emerging skills to stay relevant."
        else:
            outlook = "Niche-only" if risk > 85 else "Competitive"
            desc = f"High-bar entry environment in {industry}. Success requires elite technical specializations and a strong professional network to bypass standard filters."
            
        # 2. Competition level (More Granular Categories)
        gap = demand - supply
        if gap < -30:
            comp_level = "Hyper-Competitive"
            comp_desc = f"Market saturation in {industry} is high. Generalist roles are extremely contested; focus on distinct technical edge cases."
        elif gap < -15:
            comp_level = "Selective"
            comp_desc = f"Applicant supply in {industry} outpaces standard demand. Focus on highly specialized niches to stand out from the general pool."
        elif gap > 20:
            comp_level = "High Opportunity"
            comp_desc = f"Significant talent shortage in {industry}. Employers are actively competing for graduates with core competencies."
        elif gap > 5 or (gap > 0 and growth > 0.08):
            comp_level = "Growth-led"
            comp_desc = f"Emerging demand in {industry} is creating new vacancies faster than they can be filled. Early entry is highly advantageous."
        else:
            comp_level = "Balanced"
            comp_desc = f"Stable talent equilibrium in {industry}. Typical recruitment cycles; standard qualifications and strong portfolios are the keys to success."


            
        # 3. Preparation Guidance (Enriched)
        guidance = []
        surge = self.get_hiring_surge(row)
        
        # Timing/Surge based
        if surge == "1-3 months":
            guidance.append("Immediate Action: Finalize your portfolio and start applying now to catch the upcoming hiring peak.")
        elif surge == "4-6 months":
            guidance.append("Strategic Prep: Use the next quarter to master 1-2 'In-Demand' skills before the surge begins.")
        else:
            guidance.append("Plan Ahead: Aim for foundational certifications and early internships to build a long-term lead.")
            
        # Risk/Competition based
        if comp_level == "High Competition":
            guidance.append("Differentiation: Focus on multi-disciplinary projects to stand out in a crowded applicant pool.")
        elif comp_level == "Opportunity-rich":
            guidance.append("Speed-to-Market: Optimize your LinkedIn and resume for rapid technical screening.")
            
        # Industry/Skill based
        guidance.append(f"Network Strategy: Connect with 3-5 professionals currently in {row['Industry']} to understand team culture.")
        
        # Conversion/Retention based
        if row['Conversion_Rate'] > 0.7:
             guidance.append("Internship Focus: Target top-tier internships here, as conversion rates to full-time roles are exceptional.")
        else:
             guidance.append("Broaden Search: Diversify your applications beyond just internships to include direct entry-level roles.")

        return {
            "Hiring_Outlook": outlook,
            "Outlook_Description": desc,
            "Competition_Level": comp_level,
            "Competition_Description": comp_desc,
            "Preparation_Guidance": guidance,
            "Industry_Switch": self.get_industry_switch_suggestion(row['Industry'], row['Year'], full_df),
            "Skills": self.get_skills_for_industry(row['Industry'], row['Year'])
        }


    def run_student_analysis(self, target_industry, target_year, include_companies=True):
        print(f"\nRunning Student analysis for {target_industry} {target_year}...")
        full_df = self._prepare_data()
        
        row = full_df[(full_df['Industry'] == target_industry) & (full_df['Year'] == target_year)]
        if row.empty: return {"error": "Data not available"}
        row = row.iloc[0]
        
        # Reuse existing industry data structure
        industry_data = self.run_analysis(target_industry, target_year, include_companies=include_companies)
        
        # Add student reframing
        industry_data["Student_Insights"] = self.get_student_insights(row, full_df)
        
        return industry_data

# Execution Scenario (Test)
if __name__ == "__main__":
    dashboard = IndustryDashboard()
    print("--- Student View IT 2026 ---")
    print(json.dumps(dashboard.run_student_analysis("IT", 2026), indent=2))
