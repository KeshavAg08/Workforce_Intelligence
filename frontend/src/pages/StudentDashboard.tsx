import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GraduationCap, Activity, Clock, Lightbulb, RefreshCcw, TrendingUp, Zap, Layout, BarChart3 } from 'lucide-react';
import { Card, ProgressBar } from '../components/ui/Layout';
import { cn } from '../utils/cn';
import type { DashboardData } from '../types';

export const StudentDashboard = ({ data, setIndustry, authenticatedFetch }: { data: DashboardData, setIndustry: (i: string) => void, authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response> }) => {


    if (!data.Student_Insights) return null;
    const insights = data.Student_Insights;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                <Card className="lg:col-span-2 flex flex-col justify-center border-l-4 border-l-purple-500 overflow-hidden min-h-[280px]">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <GraduationCap className="w-32 h-32" />
                    </div>
                    <div className="relative">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 opacity-60">
                            Your Path in {data.Industry}
                        </div>
                        <h2 className={cn(
                            "text-6xl md:text-7xl font-black mb-4 leading-none drop-shadow-xl translate-x-[-2px]",
                            insights.Hiring_Outlook === 'Favorable' ? "text-emerald-400" :
                                insights.Hiring_Outlook === 'Moderate' ? "text-blue-400" : "text-orange-400"
                        )}>
                            {insights.Hiring_Outlook}
                        </h2>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-[2px] w-12 bg-purple-500/50"></span>
                            <p className="text-lg font-bold text-white/90 uppercase tracking-widest text-xs">
                                Official Career Outlook
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            {insights.Outlook_Description}
                        </p>
                    </div>
                </Card>

                <Card className="flex flex-col items-center justify-center text-center min-h-[280px]">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
                        <Activity className={cn(
                            "w-8 h-8",
                            insights.Competition_Level === 'Opportunity-rich' ? "text-emerald-400" :
                                insights.Competition_Level === 'Balanced' ? "text-blue-400" : "text-rose-400"
                        )} />
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Competition</div>
                    <div className="text-3xl font-black text-white mb-2">{insights.Competition_Level}</div>
                    <p className="text-[11px] text-center text-muted-foreground px-2 line-clamp-2">
                        {insights.Competition_Description}
                    </p>
                    <div className="w-full mt-4 px-2">
                        <ProgressBar
                            value={insights.Competition_Level === 'Opportunity-rich' ? 30 : insights.Competition_Level === 'Balanced' ? 60 : 90}
                            colorClass={insights.Competition_Level === 'Opportunity-rich' ? "bg-emerald-500" : insights.Competition_Level === 'Balanced' ? "bg-blue-500" : "bg-rose-500"}
                        />
                    </div>
                </Card>

                <Card className="flex flex-col items-center justify-center text-center border-orange-500/20 min-h-[280px]">
                    <div className="p-3 bg-orange-500/10 rounded-2xl mb-4 border border-orange-500/20">
                        <Clock className="w-8 h-8 text-orange-400" />
                    </div>
                    <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Hiring Peak</div>
                    {data.Hiring_Surge_Timeline ? (
                        <>
                            <div className="text-4xl font-black text-white mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(251,146,60,0.3)]">
                                {data.Hiring_Surge_Timeline}
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed px-2">
                                Acceleration window. Align your prep with this horizon.
                            </p>
                        </>
                    ) : (
                        <div className="py-4">
                            <Activity className="w-6 h-6 text-muted-foreground opacity-20 mx-auto mb-2" />
                            <p className="text-[10px] text-muted-foreground italic">Forecast Pending</p>
                        </div>
                    )}
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <Card className={cn(
                    "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20",
                    insights.Industry_Switch ? "lg:col-span-2" : "col-span-full"
                )}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                                <Lightbulb className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-white tracking-tight">Preparation Guidance</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">Strategic Action Plan</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {insights.Preparation_Guidance?.map((step: string, idx: number) => (
                            <div key={idx} className="group relative pl-12 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-indigo-400">
                                    {idx + 1}
                                </div>
                                <p className="text-sm text-white/80 leading-relaxed font-medium group-hover:text-white transition-colors">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>

                {insights.Industry_Switch && (
                    <Card className="bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer group h-full flex flex-col" onClick={() => setIndustry(insights.Industry_Switch!.Target_Industry)}>
                        <div className="flex flex-col gap-6 h-full">
                            <div className="p-4 bg-emerald-500/20 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                                <RefreshCcw className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Recommended Switch</span>
                                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 leading-tight">
                                    Better growth in <span className="text-emerald-400">{insights.Industry_Switch.Target_Industry}</span>?
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {insights.Industry_Switch.Reason}
                                </p>
                            </div>
                            <div className="mt-auto pt-6 border-t border-white/5 text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">
                                Click to Pivot Metrics →
                            </div>
                        </div>
                    </Card>
                )}
            </div>



            <div className="flex items-center justify-between gap-3 p-6 bg-white/5 rounded-2xl border border-white/5 mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-2xl text-white tracking-tight">Skill Intelligence</h3>
                        <p className="text-sm text-muted-foreground">Strategic competency mapping for {data.Industry}</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                    Updated for {data.Year}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['core', 'in_demand', 'future'] as const).map(cat => (
                    <div key={cat} className="space-y-4">
                        <div className="flex items-center gap-2 px-2 py-3 border-b border-white/5 mb-4">
                            {cat === 'core' ? <Layout className="w-4 h-4 text-purple-400" /> :
                                cat === 'in_demand' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> :
                                    <Lightbulb className="w-4 h-4 text-orange-400" />}
                            <div className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                {cat === 'core' ? 'Fundamental Core' : cat === 'in_demand' ? 'High Velocity' : 'Next-Gen Edge'}
                            </div>
                        </div>
                        {insights.Skills?.[cat]?.map((skill: any, idx: number) => skill && (
                            <div key={idx} className="glass-card p-5 hover:border-white/20 hover:bg-white/[0.07] transition-all group overflow-visible border-white/5 rounded-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-black text-white group-hover:text-primary transition-colors tracking-tight text-lg">{skill.name}</span>
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter",
                                        skill.level === 'High' ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                                            skill.level === 'Medium' ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                                                "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                    )}>
                                        {skill.level} Priority
                                    </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium group-hover:text-muted-foreground/80 transition-colors">{skill.why}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <Card className="p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg text-white">Talent Competition Horizon</h3>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.Supply_Demand_Trend}>
                            <XAxis dataKey="Year" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1d182e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                formatter={(value: any) => [`${Number(value).toFixed(1)} competition score`, '']}
                            />
                            <Area type="monotone" dataKey="Talent_Supply" stroke="#a855f7" fill="rgba(168, 85, 247, 0.1)" strokeWidth={3} name="Competition (Supply)" />
                            <Area type="monotone" dataKey="Talent_Demand" stroke="#ec4899" fill="rgba(236, 72, 153, 0.1)" strokeWidth={3} name="Opportunities (Demand)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};
