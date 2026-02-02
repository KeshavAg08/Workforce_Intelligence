import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, RotateCcw, Lightbulb, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { Metrics, SimulationContext } from '../../types';

export const AnimatedNumber = ({ value, precision = 1 }: { value: number; precision?: number }) => {
    return (
        <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={value}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {value.toFixed(precision)}
        </motion.span>
    );
};

export const WhatIfSimulation = ({ context, baselineMetrics, year }: { context: SimulationContext, baselineMetrics: Metrics, year: number }) => {
    const [internshipDelta, setInternshipDelta] = useState(0);
    const [conversionDelta, setConversionDelta] = useState(0);
    const [attritionDelta, setAttritionDelta] = useState(0);
    const [growthDelta, setGrowthDelta] = useState(0);

    const reset = () => {
        setInternshipDelta(0);
        setConversionDelta(0);
        setAttritionDelta(0);
        setGrowthDelta(0);
    };

    const calcSimulated = () => {
        const b = context.Baseline;
        const simInterns = b.Internship_Intake * (1 + internshipDelta / 100);
        const simConversion = b.Conversion_Rate * (1 + conversionDelta / 100);
        const simAttrition = b.Attrition_Rate * (1 + attritionDelta / 100);
        const simGrowth = b.Growth_Rate * (1 + growthDelta / 100);

        const rawSupply = simInterns * simConversion;
        const rawDemand = simGrowth + (simAttrition * 1.5);

        const normalize = (val: number, p5: number, p95: number) => {
            const clipped = Math.max(p5, Math.min(p95, val));
            return ((clipped - p5) / (p95 - p5)) * 100;
        };

        const supplyScore = normalize(rawSupply, context.Supply_P5, context.Supply_P95);
        const demandScore = normalize(rawDemand, context.Demand_P5, context.Demand_P95);

        const coreRisk = (demandScore - supplyScore) + (simAttrition * 15);
        const baselineRisk = 15 + (simAttrition * 10) + (context.Demand_Trend * 0.5);
        const finalRisk = Math.max(0, Math.min(100, Math.max(baselineRisk, coreRisk)));

        let hiringSurge = null;
        if (year === 2026) {
            const hpi = (demandScore - supplyScore) + (simAttrition * 20) + (context.Demand_Trend * 0.8);
            if (hpi > 60) hiringSurge = "1-3 Months";
            else if (hpi > 30) hiringSurge = "4-6 Months";
            else hiringSurge = "6-12 Months";
        }

        return {
            Supply: supplyScore,
            Demand: demandScore,
            Risk: finalRisk,
            Surge: hiringSurge,
            Levels: {
                Risk: finalRisk >= 70 ? 'High Risk' : finalRisk >= 40 ? 'Medium Risk' : 'Low Risk'
            }
        };
    };

    const sim = calcSimulated();
    const baseline = {
        Risk: baselineMetrics.Workforce_Risk_Score,
        Supply: baselineMetrics.Talent_Supply_Score,
        Demand: baselineMetrics.Talent_Demand_Score,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 pt-12 border-t border-white/5 space-y-10"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-3xl font-black text-white tracking-tight">Strategy <span className="text-indigo-400 italic">War Room</span></h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-md leading-relaxed">
                            Explore hypothetical scenarios by adjusting workforce variables. Localized simulation for real-time strategic planning.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Simulation Mode</span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={reset}
                        className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all shadow-xl"
                        title="Reset to Baseline"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center">
                                    <Activity className="w-4 h-4 text-indigo-400" />
                                </div>
                                <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Variable Controls</h4>
                            </div>

                            {[
                                { label: 'Internship Intake', value: internshipDelta, set: setInternshipDelta, min: -30, max: 30, color: 'indigo' },
                                { label: 'Conversion Rate', value: conversionDelta, set: setConversionDelta, min: -20, max: 20, color: 'emerald' },
                                { label: 'Attrition Rate', value: attritionDelta, set: setAttritionDelta, min: -10, max: 10, color: 'rose' },
                                { label: 'Growth Rate', value: growthDelta, set: setGrowthDelta, min: -15, max: 15, color: 'purple' },
                            ].map((slider) => (
                                <div key={slider.label} className="space-y-5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">{slider.label}</span>
                                        <div className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black border",
                                            slider.value === 0 ? "bg-white/5 text-white/40 border-white/5" :
                                                slider.value > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                    "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                        )}>
                                            {slider.value > 0 ? '+' : ''}{slider.value}%
                                        </div>
                                    </div>
                                    <div className="relative group/slider">
                                        <input
                                            type="range" min={slider.min} max={slider.max} value={slider.value}
                                            onChange={(e) => slider.set(parseInt(e.target.value))}
                                            className={cn(
                                                "w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer outline-none transition-all",
                                                `accent-${slider.color}-500 hover:bg-white/10`
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <motion.div layout className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
                        <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent skew-x-12" />
                        <div className="flex gap-4 relative z-10">
                            <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0" />
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Impact Projection</p>
                                <AnimatePresence mode="wait">
                                    <motion.p key={attritionDelta + internshipDelta + conversionDelta + growthDelta} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-xs text-indigo-200/70 leading-relaxed font-medium">
                                        {attritionDelta < 0 ? `Optimizing attrition by ${Math.abs(attritionDelta)}% reduces risk pressure by ${Math.abs(baseline.Risk - sim.Risk).toFixed(1)} index points.` :
                                            attritionDelta > 0 ? `Unchecked attrition volatility adds ${Math.abs(sim.Risk - baseline.Risk).toFixed(1)} to the workforce risk score.` :
                                                internshipDelta > 0 ? "Expanding the intake funnel directly enhances structural supply stability." :
                                                    "Adjust parameters to generate a strategic dynamic impact projection."}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 overflow-hidden rounded-[2.5rem] bg-white/[0.02] border border-white/10 relative group shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
                        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className={cn("absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none", sim.Levels.Risk === 'Low Risk' ? "bg-emerald-500/20" : sim.Levels.Risk === 'Medium Risk' ? "bg-amber-500/20" : "bg-rose-500/20")} />
                        <div className="p-10 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-1">Workforce Risk Pulse</h4>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-7xl font-black text-white tracking-tighter shadow-sm">
                                            <AnimatedNumber value={sim.Risk} />
                                        </span>
                                        <div className={cn("px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border", sim.Risk > baseline.Risk ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : sim.Risk < baseline.Risk ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-white/20 bg-white/5 border-white/10")}>
                                            {sim.Risk > baseline.Risk ? '↑ Surge' : sim.Risk < baseline.Risk ? '↓ Reduced' : 'Stable'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Market Baseline</div>
                                        <div className="text-xl font-bold text-white/40">{baseline.Risk.toFixed(1)}</div>
                                    </div>
                                    <div className="w-px h-10 bg-white/10" />
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Risk Variance</div>
                                        <div className={cn("text-xl font-bold", sim.Risk > baseline.Risk ? "text-rose-400" : "text-emerald-400")}>{(sim.Risk - baseline.Risk) > 0 ? '+' : ''}{(sim.Risk - baseline.Risk).toFixed(1)}</div>
                                    </div>
                                </div>
                                <div className={cn("inline-flex items-center gap-4 px-8 py-3 rounded-2xl border-2 transition-all duration-500", sim.Levels.Risk === 'Low Risk' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]" : sim.Levels.Risk === 'Medium Risk' ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]" : "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_30px_-5px_rgba(244,63,94,0.2)]")}>
                                    <ShieldCheck className="w-6 h-6 animate-pulse" />
                                    <span className="text-lg font-black uppercase tracking-[0.1em]">{sim.Levels.Risk}</span>
                                </div>
                            </div>
                            <div className="relative h-64 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                                    <motion.circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray="283" initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 283 - (283 * sim.Risk) / 100 }} className={cn("transition-all duration-1000 ease-out", sim.Levels.Risk === 'Low Risk' ? "text-emerald-500" : sim.Levels.Risk === 'Medium Risk' ? "text-amber-500" : "text-rose-500")} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-xs font-black text-white/20 uppercase tracking-[0.2em] mb-1">Index Cap</span>
                                    <span className="text-4xl font-black text-white">100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 space-y-8">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Supply Strength</h4>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-white tracking-tight"><AnimatedNumber value={sim.Supply} /></div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold">vs {baseline.Supply.toFixed(1)}</div>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${sim.Supply}%` }} transition={{ duration: 1, ease: "circOut" }} className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 space-y-8">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Demand Pressure</h4>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-white tracking-tight"><AnimatedNumber value={sim.Demand} /></div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold">vs {baseline.Demand.toFixed(1)}</div>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${sim.Demand}%` }} transition={{ duration: 1, ease: "circOut" }} className="h-full bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]" />
                            </div>
                        </div>
                    </div>

                    {year === 2026 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-2 p-8 rounded-[2rem] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.2em] mb-1">Simulated Hiring Window</h4>
                                    <p className="text-sm text-white/60 font-medium">Predicted timeline for strategic workforce onboarding surge.</p>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <AnimatePresence mode="wait">
                                    <motion.div key={sim.Surge} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="px-10 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col items-center">
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Forecasted Window</span>
                                        <span className="text-3xl font-black text-white tracking-tight">{sim.Surge}</span>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
