export interface Metrics {
    Talent_Supply_Score: number;
    Talent_Demand_Score: number;
    Workforce_Risk_Score: number;
    Risk_Level: string;
    Internship_Intake: number;
    Conversion_Rate: number;
    Attrition_Rate: number;
    Growth_Rate: number;
}

export interface TrendData {
    Year: number;
    Talent_Supply: number;
    Talent_Demand: number;
}

export interface Skill {
    name: string;
    level: string;
    why: string;
}

export interface Job {
    title: string;
    core_skills: string[];
}

export interface StudentInsights {
    Hiring_Outlook: string;
    Outlook_Description: string;
    Competition_Level: string;
    Competition_Description: string;
    Preparation_Guidance: string[];
    Industry_Switch: {
        Target_Industry: string;
        Reason: string;
    } | null;
    Skills: {
        core: (Skill | null)[];
        in_demand: (Skill | null)[];
        future: (Skill | null)[];
    };
}

export interface CompanySummary {
    Company: string;
    Risk_Score: number;
    Risk_Level: string;
    Hiring_Surge: string | null;
}

export interface SimulationContext {
    Supply_P5: number;
    Supply_P95: number;
    Demand_P5: number;
    Demand_P95: number;
    Demand_Trend: number;
    Baseline: {
        Internship_Intake: number;
        Conversion_Rate: number;
        Attrition_Rate: number;
        Growth_Rate: number;
    };
}

export interface DashboardData {
    Industry: string;
    Year: number;
    Metrics: Metrics;
    Hiring_Surge_Timeline: string | null;
    AI_Explanation: string;
    Supply_Demand_Trend: TrendData[];
    Student_Insights?: StudentInsights;
    Company_Metrics: CompanySummary[];
    Simulation_Context: SimulationContext;
}

export interface CompanyCompareData {
    Company: string;
    Metrics: {
        Supply_Score: number;
        Demand_Score: number;
        Risk_Score: number;
        Risk_Level: string;
        Attrition_Rate: number;
        Hiring_Surge: string | null;
    };
    Insights: string[];
}

export interface ResumeAnalysisResult {
    ATS_Match_Score: number;
    Readiness_Level: string;
    Found_Skills: string[];
    Missing_Critical_Skills: string[];
    Missing_Industry_Skills: string[];
    Missing_Future_Skills: string[];
    Recommendations: string[];
}
