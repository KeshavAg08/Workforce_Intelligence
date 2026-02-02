import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Lightbulb, Activity, Zap, Users, TrendingUp, Layout, Clock, Briefcase, RefreshCcw, BarChart3, GraduationCap } from 'lucide-react';
import { Card, ProgressBar } from '../components/ui/Layout';
import { WhatIfSimulation } from '../components/simulation/WhatIfSimulation';
import type { DashboardData } from '../types';

export const AdminDashboard = ({ data, year }: { data: DashboardData, year: number }) => {
    return (
        <div className="space-y-8">
            <div className="glass-card flex items-start gap-6 p-8 border-l-4 border-l-purple-500 bg-white/[0.02] rounded-[2rem] overflow-hidden">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/20 shrink-0">
                    <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                    <h3 className="font-black text-2xl text-white tracking-tight">Strategic Workforce Insight</h3>
                    <p className="text-white/60 text-base leading-relaxed font-medium">
                        {data.AI_Explanation}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="p-2 w-fit rounded-lg bg-pink-500/20 text-pink-400 mb-4">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Risk Score</div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">{data.Metrics.Workforce_Risk_Score.toFixed(1)}</span>
                        <span className="text-lg font-bold text-muted-foreground">/100</span>
                    </div>
                    <ProgressBar
                        value={data.Metrics.Workforce_Risk_Score}
                        colorClass="bg-gradient-to-r from-pink-500 to-rose-500"
                    />
                </Card>

                <Card>
                    <div className="p-2 w-fit rounded-lg bg-blue-500/20 text-blue-400 mb-4">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Risk Level</div>
                    <div className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                        {data.Metrics.Risk_Level}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Based on supply-demand gap analysis</p>
                </Card>

                <Card>
                    <div className="p-2 w-fit rounded-lg bg-emerald-500/20 text-emerald-400 mb-4">
                        <Users className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Talent Supply Score</div>
                    <div className="flex items-center gap-2">
                        <span className="text-4xl font-black text-white">{data.Metrics.Talent_Supply_Score.toFixed(1)}</span>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <ProgressBar
                        value={data.Metrics.Talent_Supply_Score}
                        colorClass="bg-gradient-to-r from-emerald-500 to-teal-400"
                    />
                </Card>

                <Card>
                    <div className="p-2 w-fit rounded-lg bg-purple-500/20 text-purple-400 mb-4">
                        <Layout className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Talent Demand Score</div>
                    <div className="flex items-center gap-2">
                        <span className="text-4xl font-black text-white">{data.Metrics.Talent_Demand_Score.toFixed(1)}</span>
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <ProgressBar
                        value={data.Metrics.Talent_Demand_Score}
                        colorClass="bg-gradient-to-r from-purple-500 to-indigo-400"
                    />
                </Card>
            </div>

            {data.Hiring_Surge_Timeline && (
                <Card className="relative overflow-hidden border border-orange-500/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10" />
                    <div className="relative flex items-center gap-6 p-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 blur-xl opacity-40 animate-pulse" />
                            <div className="relative p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-2xl shadow-orange-500/30">
                                <Clock className="w-8 h-8 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-xl text-white">Hiring Surge Prediction</h3>
                                <div className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 rounded-full">
                                    <span className="text-xs font-medium text-orange-400">2026 Forecast</span>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-3 mb-3">
                                <span className="text-5xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                    {data.Hiring_Surge_Timeline}
                                </span>
                                <div className="flex items-center gap-1 text-orange-400">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-medium">Expected Window</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Predictive hiring acceleration based on <span className="text-orange-400 font-medium">supply-demand gap</span>,
                                momentum indicators.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            <Card className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="font-bold text-lg text-white">Supply vs Demand Trend</h3>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                            <span className="text-sm text-muted-foreground">Supply</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                            <span className="text-sm text-muted-foreground">Demand</span>
                        </div>
                    </div>
                </div>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.Supply_Demand_Trend}>
                            <defs>
                                <linearGradient id="gSupply" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gDemand" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="Year" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1d182e',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                                }}
                                itemStyle={{ color: 'white' }}
                            />
                            <Area type="monotone" dataKey="Talent_Supply" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#gSupply)" />
                            <Area type="monotone" dataKey="Talent_Demand" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#gDemand)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="space-y-8 pt-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-500/20">
                            <Briefcase className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white">Pipeline Dynamics</h3>
                            <p className="text-sm text-muted-foreground">Detailed workforce flow and retention metrics</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="hover:border-purple-500/30 transition-colors group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2.5 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                                <GraduationCap className="w-6 h-6 text-purple-400" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-5xl font-black text-white">{data.Metrics.Internship_Intake.toLocaleString()}</span>
                        </div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Internship Intake</div>
                    </Card>
                    <Card className="hover:border-teal-500/30 transition-colors group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2.5 bg-teal-500/10 rounded-xl group-hover:bg-teal-500/20 transition-colors">
                                <RefreshCcw className="w-6 h-6 text-teal-400" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-5xl font-black text-white">{(data.Metrics.Conversion_Rate * 100).toFixed(0)}%</span>
                        </div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Pipeline Conversion</div>
                    </Card>
                    <Card className="hover:border-orange-500/30 transition-colors group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2.5 bg-orange-500/10 rounded-xl group-hover:bg-orange-500/20 transition-colors">
                                <BarChart3 className="w-6 h-6 text-orange-400" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-5xl font-black text-white">{(data.Metrics.Attrition_Rate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Attrition Velocity</div>
                    </Card>
                </div>
            </div>

            {data.Simulation_Context && (
                <WhatIfSimulation
                    context={data.Simulation_Context}
                    baselineMetrics={data.Metrics}
                    year={year}
                />
            )}
        </div>
    );
};
