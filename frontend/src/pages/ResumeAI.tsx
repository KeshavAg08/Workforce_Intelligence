import { useState, useEffect } from 'react';
import { Monitor, BookOpen, Layout, BrainCircuit, Lightbulb } from 'lucide-react';
import { Card } from '../components/ui/Layout';
import { cn } from '../utils/cn';
import type { ResumeAnalysisResult } from '../types';

export const ResumeAI = ({ industry, year, authenticatedFetch }: { industry: string, year: number, authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response> }) => {
    const [file, setFile] = useState<File | null>(null);
    const [company, setCompany] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [companies, setCompanies] = useState<string[]>([]);
    const [jobs, setJobs] = useState<string[]>([]);
    const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        authenticatedFetch(`http://localhost:8000/companies/${industry}`)
            .then(res => res.json())
            .then(data => {
                setCompanies(data.companies || []);
                if (data.companies?.length > 0) setCompany(data.companies[0]);
            });

        authenticatedFetch(`http://localhost:8000/jobs/${industry}`)
            .then(res => res.json())
            .then(data => {
                setJobs(data.jobs || []);
                if (data.jobs?.length > 0) setJobTitle(data.jobs[0]);
            });
    }, [industry, authenticatedFetch]);

    const handleAnalyze = async () => {
        if (!file || !company || !jobTitle) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('industry', industry);
        formData.append('company', company);
        formData.append('job_title', jobTitle);
        formData.append('year', year.toString());

        try {
            const res = await authenticatedFetch('http://localhost:8000/resume/analyze', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 bg-card/30 backdrop-blur-md border-white/5">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Monitor className="w-5 h-5 text-purple-400" /> Analysis Specs
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Upload Resume (PDF)</label>
                                <div className="relative group/upload h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                    {file ? (
                                        <>
                                            <BookOpen className="w-8 h-8 text-purple-400" />
                                            <span className="text-xs font-bold text-white max-w-[150px] truncate">{file.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Layout className="w-8 h-8 text-muted-foreground group-hover/upload:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Drop PDF Here</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Target Company</label>
                                <select
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full bg-secondary border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-bold appearance-none"
                                >
                                    {companies.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Target Job</label>
                                <select
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    className="w-full bg-secondary border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-bold appearance-none"
                                >
                                    {jobs.map(j => <option key={j} value={j}>{j}</option>)}
                                </select>
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !file}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 mt-4 h-12 flex items-center justify-center"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Run Intelligence Analysis"}
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-card/10 rounded-3xl border border-white/5 border-dashed">
                            <BrainCircuit className="w-16 h-16 text-muted-foreground opacity-20 mb-6" />
                            <h4 className="text-xl font-bold text-white/40 mb-2">Awaiting Intelligence Core</h4>
                            <p className="text-sm text-white/20 max-w-[300px]">Upload your resume and select a target role to generate readiness scores and skill gap insights.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="p-8 border-l-4 border-l-purple-500">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">ATS Match Score</div>
                                    <div className="flex items-end gap-3 mb-6">
                                        <span className="text-6xl font-black text-white leading-none">{result.ATS_Match_Score}</span>
                                        <span className="text-xl font-black text-purple-500 pb-1">/ 100</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${result.ATS_Match_Score}%` }} />
                                    </div>
                                </Card>
                                <Card className="p-8 border-l-4 border-l-pink-500 flex flex-col justify-center">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Readiness Level</div>
                                    <div className={cn(
                                        "text-3xl font-black uppercase tracking-tighter",
                                        result.Readiness_Level === 'High' ? "text-emerald-400" :
                                            result.Readiness_Level === 'Moderate' ? "text-amber-400" : "text-rose-400"
                                    )}>
                                        {result.Readiness_Level}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4 font-medium leading-relaxed">
                                        {result.ATS_Match_Score > 75 ? "Your profile is highly competitive for the 2026 hiring cycle." :
                                            result.ATS_Match_Score > 50 ? "You have the foundation but need specific industry alignment." :
                                                "Critical foundational gaps identified. Immediate preparation recommended."}
                                    </p>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-widest pl-2">Critical Gaps</h5>
                                    <div className="space-y-2">
                                        {result.Missing_Critical_Skills.length > 0 ? result.Missing_Critical_Skills.map((s: string) => (
                                            <div key={s} className="px-4 py-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-xs font-bold text-rose-200">
                                                {s}
                                            </div>
                                        )) : (
                                            <div className="px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs font-bold text-emerald-400/80">
                                                No Critical Gaps
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest pl-2">Industry Alignment</h5>
                                    <div className="space-y-2">
                                        {result.Missing_Industry_Skills.length > 0 ? result.Missing_Industry_Skills.map((s: string) => (
                                            <div key={s} className="px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs font-bold text-amber-200">
                                                {s}
                                            </div>
                                        )) : (
                                            <div className="px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs font-bold text-emerald-400/80">
                                                Perfect Industry Alignment
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black text-purple-500 uppercase tracking-widest pl-2">Future Readiness</h5>
                                    <div className="space-y-2">
                                        {result.Missing_Future_Skills.length > 0 ? result.Missing_Future_Skills.map((s: string) => (
                                            <div key={s} className="px-4 py-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs font-bold text-purple-200">
                                                {s}
                                            </div>
                                        )) : (
                                            <div className="px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs font-bold text-emerald-400/80">
                                                2026 Future-Ready
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <Lightbulb className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white">Strategic Recommendations</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {result.Recommendations.map((rec: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                                            <div className="text-xs font-black text-purple-500 opacity-40">0{idx + 1}</div>
                                            <p className="text-xs text-white/70 leading-relaxed">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
