import { useState, useEffect } from 'react';
import { Building, Lightbulb } from 'lucide-react';
import { Card } from '../components/ui/Layout';
import { cn } from '../utils/cn';
import type { CompanyCompareData } from '../types';

export const CompanyComparison = ({ industry, year, authenticatedFetch }: { industry: string, year: number, authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response> }) => {
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
    const [allCompanies, setAllCompanies] = useState<string[]>([]);
    const [comparisonData, setComparisonData] = useState<CompanyCompareData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        authenticatedFetch(`http://localhost:8000/companies/${industry}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.companies) {
                    setAllCompanies(data.companies);
                    setSelectedCompanies(data.companies.slice(0, 2));
                }
            })
            .catch(err => console.error("Error fetching companies:", err));
    }, [industry, authenticatedFetch]);

    useEffect(() => {
        if (selectedCompanies.length < 2) return;
        setLoading(true);
        authenticatedFetch(`http://localhost:8000/company/compare?industry=${industry}&companies=${selectedCompanies.join(',')}&year=${year}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setComparisonData(data);
                } else {
                    setComparisonData([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching comparison:", err);
                setLoading(false);
            });
    }, [industry, year, selectedCompanies, authenticatedFetch]);

    const toggleCompany = (company: string) => {
        if (selectedCompanies.includes(company)) {
            if (selectedCompanies.length > 2) {
                setSelectedCompanies(selectedCompanies.filter(c => c !== company));
            }
        } else {
            if (selectedCompanies.length < 4) {
                setSelectedCompanies([...selectedCompanies, company]);
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="p-6 bg-card/30 backdrop-blur-md border-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Company Selector</h3>
                        <p className="text-sm text-muted-foreground">Select 2-4 companies to compare within {industry}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {allCompanies.map(company => (
                            <button
                                key={company}
                                onClick={() => toggleCompany(company)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                    selectedCompanies.includes(company)
                                        ? "bg-primary/20 text-primary border-primary/30"
                                        : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
                                )}
                            >
                                {company}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-black uppercase tracking-widest animate-pulse">Running Comparative Analysis...</p>
                </div>
            ) : allCompanies.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-4">
                    <Building className="w-12 h-12 opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest opacity-40">No Companies Found in {industry}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Array.isArray(comparisonData) && comparisonData.map(comp => (
                        <Card key={comp.Company} className="p-8 border-l-4 border-l-purple-500 hover:border-l-pink-500 transition-all group">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h4 className="text-2xl font-black text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400">
                                        {comp.Company}
                                    </h4>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Enterprise Metrics</div>
                                </div>
                                <div className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    comp.Metrics.Risk_Level === 'Low Risk' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                        comp.Metrics.Risk_Level === 'Medium Risk' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                            "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                )}>
                                    {comp.Metrics.Risk_Level}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Supply Score</span>
                                        <span className="text-sm font-black text-purple-400">{comp.Metrics.Supply_Score}</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500" style={{ width: `${comp.Metrics.Supply_Score}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Demand Score</span>
                                        <span className="text-sm font-black text-pink-400">{comp.Metrics.Demand_Score}</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-pink-500" style={{ width: `${comp.Metrics.Demand_Score}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 p-4 bg-white/5 rounded-2xl border border-white/5 mb-8">
                                <div>
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 text-center">Attrition Rate</div>
                                    <div className="text-xl font-black text-white text-center">{(comp.Metrics.Attrition_Rate * 100).toFixed(1)}%</div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 text-center">Hiring Surge</div>
                                    <div className="text-xl font-black text-purple-400 text-center animate-pulse">{comp.Metrics.Hiring_Surge || 'Steady'}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {comp.Insights.map((insight: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                                        <Lightbulb className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-white/70 leading-relaxed">{insight}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
