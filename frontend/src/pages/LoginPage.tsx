import { useState } from 'react';
import { GraduationCap, ChevronRight, Building } from 'lucide-react';
import { cn } from '../utils/cn';

export const LoginPage = ({ onLogin, onBack }: { onLogin: (role: string, email: string, pass: string) => void, onBack: () => void }) => {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [industryEmail, setIndustryEmail] = useState("");
    const [industryPass, setIndustryPass] = useState("");
    const [studentEmail, setStudentEmail] = useState("");
    const [studentPass, setStudentPass] = useState("");

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f0a1e] relative overflow-hidden font-sans text-foreground">
            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600/20 blur-[150px] rounded-full animate-float opacity-60" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-pink-600/20 blur-[150px] rounded-full animate-float opacity-60" style={{ animationDelay: '-3s' }} />
                <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse opacity-40" />
            </div>

            <button
                onClick={onBack}
                className="absolute top-8 left-8 flex items-center gap-3 text-white/50 hover:text-white transition-all duration-300 font-bold uppercase tracking-widest text-[10px] z-[1000] group"
            >
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                </div>
                <span>Back to Home</span>
            </button>

            <div className={cn("auth-container shadow-2xl shadow-purple-900/20", isRightPanelActive && "right-panel-active mx-auto")}>
                {/* Industry Login Form */}
                <div className={cn("auth-form-container left-0", !isRightPanelActive ? "opacity-100 z-[2] translate-x-0" : "opacity-0 z-[1] translate-x-[-20%]")}>
                    <form className="w-full max-w-[340px] text-center" onSubmit={(e) => { e.preventDefault(); onLogin('industry', industryEmail, industryPass); }}>
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-xl shadow-purple-500/10 backdrop-blur-sm group hover:scale-105 transition-transform duration-500">
                            <Building className="w-10 h-10 text-purple-400 drop-shadow-md" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Industry Login</h1>
                        <p className="text-white/40 text-sm font-medium mb-10 leading-relaxed">Access strategic workforce analytics and predictive risk modeling.</p>

                        <div className="space-y-4 mb-8">
                            <div className="group relative">
                                <input
                                    type="email" placeholder="Corporate Email" value={industryEmail}
                                    onChange={(e) => setIndustryEmail(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-semibold text-white placeholder:text-white/20 outline-none focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                                />
                            </div>
                            <div className="group relative">
                                <input
                                    type="password" placeholder="Password" value={industryPass}
                                    onChange={(e) => setIndustryPass(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-semibold text-white placeholder:text-white/20 outline-none focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group">
                            <span className="relative z-10">Sign In</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </form>
                </div>

                {/* Student Login Form */}
                <div className={cn("auth-form-container right-0", isRightPanelActive ? "opacity-100 z-[5] translate-x-0" : "opacity-0 z-[1] translate-x-[20%]")}>
                    <form className="w-full max-w-[340px] text-center" onSubmit={(e) => { e.preventDefault(); onLogin('student', studentEmail, studentPass); }}>
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-xl shadow-pink-500/10 backdrop-blur-sm group hover:scale-105 transition-transform duration-500">
                            <GraduationCap className="w-10 h-10 text-pink-400 drop-shadow-md" />
                        </div>
                        <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Student Login</h1>
                        <p className="text-white/40 text-sm font-medium mb-10 leading-relaxed">Unlock personalized career intelligence and skill gap analysis.</p>

                        <div className="space-y-4 mb-8">
                            <div className="group relative">
                                <input
                                    type="email" placeholder="Student Email" value={studentEmail}
                                    onChange={(e) => setStudentEmail(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-semibold text-white placeholder:text-white/20 outline-none focus:bg-white/[0.05] focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all duration-300"
                                />
                            </div>
                            <div className="group relative">
                                <input
                                    type="password" placeholder="Password" value={studentPass}
                                    onChange={(e) => setStudentPass(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-semibold text-white placeholder:text-white/20 outline-none focus:bg-white/[0.05] focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-pink-600/20 hover:shadow-pink-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group">
                            <span className="relative z-10">Sign In</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </form>
                </div>

                {/* Overlay Container */}
                <div className="auth-overlay-container">
                    <div className="auth-overlay bg-gradient-to-br from-[#2d1b69] to-[#1f1147]">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />

                        {/* Left Overlay Panel (Visible initially) -> Asks "Industry User?" when Student form is active */}
                        <div className={cn("auth-overlay-panel left-0 flex flex-col items-center justify-center text-center", isRightPanelActive ? "translate-x-0" : "translate-x-[-20%]")}>
                            <div className="max-w-[360px]">
                                <h1 className="text-5xl font-black text-white mb-6 leading-tight">Industry<br />Portal</h1>
                                <p className="text-indigo-200 mb-8 font-medium text-lg leading-relaxed">
                                    Managing workforce strategy? Log in here.
                                </p>
                                <button
                                    onClick={() => setIsRightPanelActive(false)}
                                    className="px-10 py-4 rounded-full border border-white/20 bg-white/5 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-indigo-900 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                >
                                    Switch to Industry
                                </button>
                            </div>
                        </div>

                        {/* Right Overlay Panel (Visible when Switched) -> Asks "Student User?" when Industry form is active */}
                        <div className={cn("auth-overlay-panel right-0 flex flex-col items-center justify-center text-center", isRightPanelActive ? "translate-x-[20%]" : "translate-x-0")}>
                            <div className="max-w-[360px]">
                                <h1 className="text-5xl font-black text-white mb-6 leading-tight">Student<br />Portal</h1>
                                <p className="text-purple-200 mb-8 font-medium text-lg leading-relaxed">
                                    Looking for career insights? Log in here.
                                </p>
                                <button
                                    onClick={() => setIsRightPanelActive(true)}
                                    className="px-10 py-4 rounded-full border border-white/20 bg-white/5 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-purple-900 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                >
                                    Switch to Student
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
