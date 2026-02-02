import { ChevronRight, Database, ShieldCheck, BrainCircuit, Cpu, Stethoscope, Factory, BatteryCharging, Wallet, Clock, RefreshCcw, BarChart3, Monitor, Calendar, BookOpen, Lightbulb, Building, Zap } from 'lucide-react';
import { Card } from '../components/ui/Layout';
import { cn } from '../utils/cn';

export const LandingPage = ({ onExplore }: { onExplore: () => void }) => {
    return (
        <div className="min-h-screen bg-[#1d182e] text-white selection:bg-purple-500/30">
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#1d182e]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white/90">Workforce Intelligence</span>
                    </div>
                    <div className="hidden md:flex items-center gap-10">
                        {["Features", "Industries", "Insights"].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-white/60 hover:text-white transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onExplore}
                            className="px-8 py-2.5 rounded-full text-sm font-black bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20 hover:scale-105 hover:shadow-purple-500/40 active:scale-95 transition-all"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 space-y-32">
                <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1]">
                                Real-Time <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Workforce Metrics</span>
                            </h1>
                            <p className="text-lg text-white/50 max-w-lg leading-relaxed font-medium">
                                Access comprehensive data on hiring trends, attrition rates, skill demands, and internship pipelines across all major industries.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "5 Years of Historical Data", sub: "2022-2026 comprehensive metrics", color: "from-pink-500 to-rose-600", icon: Database, glow: "group-hover:shadow-pink-500/30" },
                                { label: "25+ Leading Companies", sub: "Skill profiles and hiring patterns", color: "from-blue-500 to-indigo-600", icon: ShieldCheck, glow: "group-hover:shadow-blue-500/30" },
                                { label: "ML-Powered Predictions", sub: "Supply & demand forecasting", color: "from-emerald-500 to-teal-600", icon: BrainCircuit, glow: "group-hover:shadow-emerald-500/30" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 group relative overflow-hidden active:scale-95">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl",
                                        item.color,
                                        item.glow
                                    )}>
                                        <item.icon className="w-7 h-7 text-white drop-shadow-md" />
                                    </div>
                                    <div className="relative">
                                        <h4 className="font-black text-xl text-white/90 tracking-tight group-hover:text-white transition-colors">{item.label}</h4>
                                        <p className="text-sm text-white/40 font-medium group-hover:text-white/60 transition-colors">{item.sub}</p>
                                    </div>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
                                        <ChevronRight className="w-5 h-5 text-white/20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/5 border-purple-500/20 shadow-xl overflow-hidden group">
                            <div className="flex items-center justify-between mb-8 relative">
                                <h3 className="font-black text-xl text-white/90 tracking-tight">2026 Internship Pipeline</h3>
                                <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/30 animate-pulse">
                                    Latest
                                </span>
                            </div>
                            <div className="grid grid-cols-5 gap-4 relative">
                                {[
                                    { label: "IT & Tech", val: "1,485", color: "text-blue-400", bg: "bg-blue-400/5", icon: Cpu },
                                    { label: "Health", val: "596", color: "text-emerald-400", bg: "bg-emerald-400/10", icon: Stethoscope },
                                    { label: "Mfg", val: "605", color: "text-orange-400", bg: "bg-orange-400/5", icon: Factory },
                                    { label: "EV", val: "769", color: "text-pink-400", bg: "bg-pink-400/5", icon: BatteryCharging },
                                    { label: "Finance", val: "614", color: "text-amber-400", bg: "bg-amber-400/5", icon: Wallet }
                                ].map((item, idx) => (
                                    <div key={idx} className={cn("text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105", item.bg)}>
                                        <item.icon className={cn("w-5 h-5 mx-auto mb-3", item.color)} />
                                        <div className={cn("text-xl font-black mb-1", item.color)}>{item.val}</div>
                                        <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest leading-none">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-6">
                            <Card className="bg-white/[0.02] hover:bg-white/[0.04] transition-all group overflow-hidden border-white/5 hover:border-purple-500/20">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Clock className="w-16 h-16" />
                                </div>
                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Avg Hiring Time</div>
                                <div className="flex items-end gap-3 mb-6 relative">
                                    <span className="text-5xl font-black text-white group-hover:text-purple-400 transition-colors">45</span>
                                    <span className="text-xs font-bold text-white/40 pb-1.5 uppercase tracking-widest">Days (IT)</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-purple-500/10 animate-pulse" />
                                    <div className="relative h-full w-2/3 bg-gradient-to-r from-purple-600 to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                                </div>
                            </Card>
                            <Card className="bg-white/[0.02] hover:bg-white/[0.04] transition-all group overflow-hidden border-white/5 hover:border-pink-500/20">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <RefreshCcw className="w-16 h-16" />
                                </div>
                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Conversion Rate</div>
                                <div className="flex items-end gap-3 mb-6 relative">
                                    <span className="text-5xl font-black text-white group-hover:text-pink-400 transition-colors">48%</span>
                                    <span className="text-xs font-bold text-white/40 pb-1.5 uppercase tracking-widest">FTE Yield</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-pink-500/10 animate-pulse" />
                                    <div className="relative h-full w-[48%] bg-gradient-to-r from-pink-600 to-rose-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]" />
                                </div>
                            </Card>
                        </div>

                        <Card className="bg-white/[0.02] border-white/5 hover:border-white/10 group">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Top Emerging Skills</h4>
                                <div className="p-1.5 bg-amber-500/10 rounded-lg group-hover:animate-bounce">
                                    <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {[
                                    { name: "GenAI", color: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20" },
                                    { name: "Cloud Native", color: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20" },
                                    { name: "AI Diagnostics", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-400/20" },
                                    { name: "Smart Factory", color: "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20" },
                                    { name: "Solid State Batteries", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20" },
                                    { name: "Blockchain", color: "bg-pink-500/10 text-pink-400 border-pink-500/20 hover:bg-pink-500/20" }
                                ].map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-default",
                                            skill.color
                                        )}
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </div>
                </section>

                <section id="features" className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-5xl font-black tracking-tight text-white">Everything You Need</h2>
                        <p className="text-lg text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
                            Comprehensive tools for workforce intelligence and strategic planning
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: BarChart3,
                                title: "Real-time Risk Scoring",
                                desc: "AI-powered risk analysis combining attrition, hiring velocity, and market trends for instant workforce health assessment.",
                                tags: ["AI Analysis", "Predictive"],
                                color: "from-purple-500 to-indigo-500",
                                shadow: "shadow-purple-500/20"
                            },
                            {
                                icon: Monitor,
                                title: "What-If Simulations",
                                desc: "Test hypothetical scenarios by adjusting conversion rates, attrition, and hiring velocity to see projected outcomes.",
                                tags: ["Simulation", "Planning"],
                                color: "from-blue-500 to-cyan-500",
                                shadow: "shadow-blue-500/20"
                            },
                            {
                                icon: Calendar,
                                title: "3-Year Forecasts",
                                desc: "Machine learning models trained on historical data to predict supply and demand trends for strategic workforce planning.",
                                tags: ["ML Models", "Forecasting"],
                                color: "from-pink-500 to-rose-500",
                                shadow: "shadow-pink-500/20"
                            },
                            {
                                icon: Building,
                                title: "Company Comparison",
                                desc: "Compare skill requirements and workforce metrics across top companies in each industry sector.",
                                tags: ["Benchmarking", "Skills"],
                                color: "from-indigo-500 to-purple-500",
                                shadow: "shadow-indigo-500/20"
                            },
                            {
                                icon: BookOpen,
                                title: "Career Intelligence",
                                desc: "Job seekers get personalized insights on industry opportunities, skill demands, and entry barriers.",
                                tags: ["Career", "Guidance"],
                                color: "from-emerald-500 to-teal-500",
                                shadow: "shadow-emerald-500/20"
                            },
                            {
                                icon: Lightbulb,
                                title: "AI-Powered Insights",
                                desc: "Contextual recommendations and natural language insights generated from complex workforce data patterns.",
                                tags: ["NLP", "Insights"],
                                color: "from-orange-500 to-amber-500",
                                shadow: "shadow-orange-500/20"
                            }
                        ].map((feature, idx) => (
                            <Card key={idx} className="bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 group border-white/5 hover:border-white/10 hover:-translate-y-2">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl",
                                    feature.color,
                                    feature.shadow
                                )}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-white/50 leading-relaxed font-medium mb-8 group-hover:text-white/70 transition-colors">
                                    {feature.desc}
                                </p>
                                <div className="flex gap-2">
                                    {feature.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/5 group-hover:border-white/10 group-hover:bg-white/10 transition-all">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section id="industries" className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-5xl font-black tracking-tight text-white">5 Key Industries</h2>
                        <p className="text-lg text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
                            Deep workforce analytics across India's fastest-growing sectors
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            { name: "IT & Tech", growth: "13.3%", tags: ["Python", "GenAI"], color: "text-blue-400", bg: "bg-blue-400/10", icon: Cpu, glow: "group-hover:shadow-blue-500/20" },
                            { name: "Healthcare", growth: "7.8%", tags: ["AI Diagnostics"], color: "text-emerald-400", bg: "bg-emerald-400/10", icon: Stethoscope, glow: "group-hover:shadow-emerald-500/20" },
                            { name: "Manufacturing", growth: "1.4%", tags: ["Smart Factory"], color: "text-orange-400", bg: "bg-orange-400/10", icon: Factory, glow: "group-hover:shadow-orange-500/20" },
                            { name: "EV Sector", growth: "19.8%", tags: ["Battery Tech"], color: "text-pink-400", bg: "bg-pink-400/10", icon: BatteryCharging, glow: "group-hover:shadow-pink-500/20" },
                            { name: "FinTech", growth: "5.7%", tags: ["Blockchain"], color: "text-amber-400", bg: "bg-amber-400/10", icon: Wallet, glow: "group-hover:shadow-amber-500/20" }
                        ].map((ind, idx) => (
                            <Card key={idx} className="bg-white/[0.01] text-center p-10 transition-all duration-500 border-white/5 group">
                                <div className={cn(
                                    "w-20 h-20 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl",
                                    ind.bg,
                                    ind.glow
                                )}>
                                    <ind.icon className={cn("w-10 h-10 drop-shadow-lg", ind.color)} />
                                </div>
                                <h4 className="text-xl font-black text-white mb-3 tracking-tight">{ind.name}</h4>
                                <div className="space-y-1 mb-8">
                                    <div className={cn("text-3xl font-black tracking-tighter", ind.color)}>{ind.growth}</div>
                                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Annual Growth</div>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {ind.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/30 border border-white/5 group-hover:border-white/10 group-hover:text-white/50 transition-all">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="max-w-5xl mx-auto px-6">
                    <Card className="bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent border-purple-500/20 p-16 text-center space-y-10">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 mx-auto flex items-center justify-center border border-white/10 shadow-2xl">
                            <Zap className="w-10 h-10 text-purple-400" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black tracking-tight leading-tight">
                                Ready to Transform Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Workforce Strategy?</span>
                            </h2>
                            <p className="text-lg text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
                                Join organizations making data-driven workforce decisions with AI-powered intelligence
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-6">
                            <button
                                onClick={onExplore}
                                className="px-12 py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto] text-lg font-black text-white shadow-2xl shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group/btn"
                            >
                                Start Free Trial <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-xs font-bold text-white/20 uppercase tracking-[0.2em]">No credit card required</p>
                        </div>
                    </Card>
                </section>
            </main>

            <footer className="border-t border-white/5 py-12 bg-black/20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3 opacity-50">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold tracking-tight">Workforce Intelligence</span>
                    </div>
                    <p className="text-xs font-medium text-white/20">© 2026 Workforce Intelligence Analytics. All rights reserved.</p>
                    <div className="flex gap-8">
                        {["Privacy", "Terms", "Support"].map(item => (
                            <a key={item} href="#" className="text-xs font-bold text-white/20 hover:text-white transition-colors">{item}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};
