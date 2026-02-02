import { useState, useEffect } from 'react';
import { Zap, Building, LogOut, Briefcase, Layout } from 'lucide-react';
import { cn } from './utils/cn';
import type { DashboardData } from './types';

// Page Components
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { CompanyComparison } from './pages/CompanyComparison';
import { ResumeAI } from './pages/ResumeAI';

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState("IT");
  const [year, setYear] = useState(2026);
  const [industries, setIndustries] = useState<string[]>(["IT", "Healthcare", "Manufacturing", "EV", "Finance"]);
  const [view, setView] = useState<'landing' | 'industry' | 'student' | 'compare' | 'resume' | 'auth'>('landing');
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("role"));

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      "Authorization": `Bearer ${token}`
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      handleLogout();
      throw new Error("Unauthorized");
    }
    return res;
  };

  const years = [2024, 2025, 2026, 2027, 2028, 2029];

  useEffect(() => {
    fetch('http://localhost:8000/industries')
      .then(res => res.json())
      .then(data => setIndustries(data.industries))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (view === 'landing' || view === 'auth') return;
    if (!token || !userRole) {
      setView('auth');
      return;
    }

    if (userRole === 'INDUSTRY_USER' && view !== 'industry') {
      setView('industry');
    } else if (userRole === 'STUDENT_USER' && (view === 'industry')) {
      setView('student');
    }

    setLoading(true);
    const endpoint = view === 'student' ? '/student/dashboard' : '/dashboard';

    authenticatedFetch(`http://localhost:8000${endpoint}/${industry}/${year}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then(setData)
      .catch(err => {
        console.error("Dashboard Fetch Error:", err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [industry, year, view, token, userRole]);

  const handleLogin = async (_role: 'industry' | 'student', email: string, pass: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', pass);

      const res = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Invalid credentials");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      setToken(data.access_token);
      setUserRole(data.role);

      if (data.role === 'INDUSTRY_USER') setView('industry');
      else setView('student');
    } catch (err) {
      alert("Login failed: " + (err as Error).message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUserRole(null);
    setView('landing');
  };

  if (view === 'auth') {
    return <LoginPage onLogin={(role, email, pass) => handleLogin(role as any, email, pass)} onBack={() => setView('landing')} />;
  }

  if (view === 'landing') {
    return <LandingPage onExplore={() => setView('auth')} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <nav className="border-b border-white/5 bg-card/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-all"
              onClick={() => setView('landing')}
            >
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-bold text-lg tracking-wide gradient-text">Workforce Intelligence</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {userRole === 'INDUSTRY_USER' ? (
                <button
                  onClick={() => setView('industry')}
                  className={cn(
                    "px-4 py-1.5 rounded-full font-medium text-sm transition-all",
                    view === 'industry' ? "bg-primary/20 text-primary-foreground border border-primary/20" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Industry Analytics
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setView('student')}
                    className={cn(
                      "px-4 py-1.5 rounded-full font-medium text-sm transition-all",
                      view === 'student' ? "bg-primary/20 text-primary-foreground border border-primary/20" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Student Intelligence
                  </button>
                  <button
                    onClick={() => setView('compare')}
                    className={cn(
                      "px-4 py-1.5 rounded-full font-medium text-sm transition-all",
                      view === 'compare' ? "bg-primary/20 text-primary-foreground border border-primary/20" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Company Compare
                  </button>
                  <button
                    onClick={() => setView('resume')}
                    className={cn(
                      "px-4 py-1.5 rounded-full font-medium text-sm transition-all",
                      view === 'resume' ? "bg-primary/20 text-primary-foreground border border-primary/20" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Resume AI
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">
                {userRole?.replace('_', ' ')}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all group"
              title="Logout"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {view === 'industry' ? 'Industry Analytics' : 'Career Intelligence'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            {view === 'industry' ? 'Real-time workforce insights and predictive analytics' :
              view === 'student' ? 'Data-driven preparation and hiring outlook for students' :
                'Direct workforce performance comparison across top industry players'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="space-y-2">
            <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Select Industry</label>
            <div className="relative">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-secondary border border-white/10 text-foreground rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 appearance-none font-bold"
              >
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <Building className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Select Year</label>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-secondary border border-white/10 text-foreground rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 appearance-none font-bold"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold animate-pulse text-xs uppercase tracking-widest">Hydrating Dashboard...</p>
          </div>
        ) : (
          view === 'compare' ? (
            <CompanyComparison industry={industry} year={year} authenticatedFetch={authenticatedFetch} />
          ) : view === 'resume' ? (
            <ResumeAI industry={industry} year={year} authenticatedFetch={authenticatedFetch} />
          ) : !data ? (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-4">
              <Layout className="w-12 h-12 opacity-20" />
              <p className="font-bold text-xs uppercase tracking-widest opacity-40">No Industry Data Available</p>
            </div>
          ) : view === 'student' ? (
            <StudentDashboard data={data} setIndustry={setIndustry} authenticatedFetch={authenticatedFetch} />
          ) : (
            <AdminDashboard data={data} year={year} />
          )
        )}
      </div>
    </div>
  );
}
