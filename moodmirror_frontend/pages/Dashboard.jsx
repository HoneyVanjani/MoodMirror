import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Star,
  TrendingUp,
  Calendar,
  BarChart3,
  BookOpen,
  LifeBuoy,
  LogOut,
  Zap,
  Activity,
  Smile,
  ShieldAlert,
  Plus,
  Compass,
  Award,
  Flame,
  CloudLightning,
  SunMedium
} from "lucide-react";
import { storage } from "../utils/storage.js";
import SosMode from "../components/wellness/SosMode.jsx";
import ZenGarden from "../components/wellness/ZenGarden.jsx";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { toast } from "../components/common/Toast.jsx";
import DashboardHeader from "../components/common/DashboardHeader.jsx";

const Dashboard = () => {
  const auth = storage.getAuth();
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [alert, setAlert] = useState(storage.getAlertCache() || null);
  const [streak, setStreak] = useState(storage.getStreakCache() || null);
  const [motivation, setMotivation] = useState(localStorage.getItem("motivation") || "");
  const [showSos, setShowSos] = useState(false);
  const [rituals, setRituals] = useState({
    water: false, breath: false, voice: false, log: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.id) return;
    refreshData();
  }, [auth?.id]);

  const refreshData = async () => {
    try {
      const summary = await storage.getWeeklySummary(auth.id);
      setWeeklySummary(summary);

      const today = new Date().toISOString().split('T')[0];
      const moods = await storage.getMoods(auth.id);
      const todayLogs = moods.filter(m => m.date?.startsWith(today));
      
      setRituals(prev => ({
        ...prev,
        log: todayLogs.length > 0,
        voice: localStorage.getItem(`journaled_${today}`) === 'true',
        breath: localStorage.getItem(`breathed_${today}`) === 'true',
      }));

      storage.getMoodAlert(auth.id).then(setAlert);
      storage.getMoodStreak(auth.id).then(setStreak);
      
      const lastMood = todayLogs.length > 0 ? todayLogs[todayLogs.length-1].mood : 'neutral';
      const motivationData = await storage.getMotivation(lastMood);
      setMotivation(motivationData || "Keep going! You're doing great 💪");
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoodQuickLog = async (moodId) => {
    const today = new Date().toISOString().split('T')[0];
    const moods = await storage.getMoods(auth.id);
    const todayLogs = moods.filter(m => m.date?.startsWith(today));

    if (todayLogs.length >= 5) {
      toast.error("Daily log limit reached (5/5).");
      return;
    }

    try {
      await storage.addMood({
        mood: moodId,
        date: today,
        user_id: auth.id
      });
      toast.success(`${moodId.toUpperCase()} logged!`);
      refreshData();
    } catch (err) {
      toast.error("Cloud sync failed.");
    }
  };

  const handleSignOut = () => {
    storage.clearAuth();
    navigate("/");
  };

  const getStanding = (s) => {
    if (s >= 10) return { name: "Apex Prophet", color: "from-purple-500 to-indigo-600" };
    if (s >= 7) return { name: "Elite Sentinel", color: "from-cyan-400 to-blue-500" };
    if (s >= 5) return { name: "Neural Stabilizer", color: "from-yellow-400 to-orange-500" };
    if (s >= 3) return { name: "Cognitive Initiate", color: "from-slate-300 to-slate-500" };
    return { name: "Binary Observer", color: "from-orange-700 to-amber-900" };
  };
  const standing = getStanding(streak?.streak || 0);

  const pieData = weeklySummary?.summary && (weeklySummary.summary.excellent || weeklySummary.summary.good || weeklySummary.summary.okay || weeklySummary.summary.bad || weeklySummary.summary.terrible)
    ? [
        { name: "Excellent", value: weeklySummary.summary.excellent || 0, color: "#6366f1" },
        { name: "Positive", value: weeklySummary.summary.good || 0, color: "#10b981" },
        { name: "Stable", value: weeklySummary.summary.okay || 0, color: "#f59e0b" },
        { name: "Declining", value: weeklySummary.summary.bad || 0, color: "#f97316" },
        { name: "Critical", value: weeklySummary.summary.terrible || 0, color: "#ef4444" },
      ].filter(d => d.value > 0)
    : [];

  const vitalityScore = weeklySummary?.score || 0;
  const moodTrend = [
    { name: 'M', val: Math.max(0, vitalityScore - 10) },
    { name: 'T', val: Math.max(0, vitalityScore - 5) },
    { name: 'W', val: Math.max(0, vitalityScore + 5) },
    { name: 'T', val: vitalityScore },
    { name: 'F', val: Math.min(100, vitalityScore + 10) },
    { name: 'S', val: Math.min(100, vitalityScore + 2) },
    { name: 'S', val: vitalityScore },
  ];

  const ritualsDoneCount = Object.values(rituals).filter(Boolean).length;
  const ritualProgress = (ritualsDoneCount / 4) * 100;

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100">
      <DashboardHeader />

      <main className="container mx-auto px-6 pt-32 pb-40">
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-8 space-y-8">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h1 className="text-5xl md:text-[80px] font-black tracking-tighter leading-[0.85] uppercase italic mb-6 text-slate-900 dark:text-white">
                        Access, <br /><span className="text-indigo-600">{auth?.username || "Identity"}</span>.
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-xl">
                        Neural clarity is currently {vitalityScore}% synchronized.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 bg-white dark:bg-slate-900 p-5 pr-10 rounded-[36px] shadow-2xl border border-slate-100 dark:border-slate-800 group hover:scale-105 transition-all">
                     <div className={`w-16 h-16 bg-gradient-to-br ${standing.color} rounded-3xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-all`}>
                        <Award className="w-8 h-8 text-white" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nexus Standing</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase leading-tight italic tracking-tighter">{standing.name}</p>
                     </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-slate-900 rounded-[56px] p-12 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <Activity className="w-80 h-80 text-indigo-500" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-16 relative z-10">
                     <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center">
                           <TrendingUp className="w-4 h-4 mr-3 text-emerald-500" />
                           Emotional Trajectory
                        </h3>
                        <div className="h-44">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={moodTrend}>
                                <defs>
                                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorVal)" />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                     <div className="flex flex-col justify-center">
                        <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[40px] border border-indigo-100 dark:border-indigo-800/50">
                           <h4 className="flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4">
                              <Zap className="w-4 h-4 mr-3" />
                              Nexus Insight
                           </h4>
                           <p className="text-3xl font-black tracking-tighter italic leading-[1.1] mb-3 text-slate-900 dark:text-white uppercase">
                             "{weeklySummary?.prediction || 'Initializing Analysis...'}"
                           </p>
                           <p className="text-sm text-slate-500 font-medium italic">Synchronized with your latest neurological log cycles.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900 text-white rounded-[56px] p-12 shadow-2xl flex flex-col items-center justify-between text-center overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-10">Cognitive Rituals</h3>
                <div className="relative w-52 h-52 flex items-center justify-center mb-10">
                   <svg className="w-full h-full -rotate-90">
                      <circle cx="104" cy="104" r="96" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800" />
                      <circle cx="104" cy="104" r="96" stroke="#6366f1" strokeWidth="10" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 96} 
                        strokeDashoffset={2 * Math.PI * 96 * (1 - ritualProgress / 100)} 
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                   </svg>
                   <div className="absolute flex flex-col items-center">
                      <span className="text-[56px] font-black leading-none">{Math.round(ritualProgress)}%</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Sync Level</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                    {[
                      { id: 'water', label: 'Hydrate', icon: Zap, hint: 'Log manual' },
                      { id: 'breath', label: 'Breathing', icon: Activity, hint: 'Zen Garden' },
                      { id: 'voice', label: 'Identity', icon: BookOpen, hint: 'Journal' },
                      { id: 'log', label: 'Mood Log', icon: Smile, hint: 'Quick Dock' }
                    ].map(r => (
                      <div 
                        key={r.id} 
                        onClick={() => r.id === 'water' && setRituals(p => ({...p, water: true}))}
                        className={`p-5 rounded-[32px] transition-all flex flex-col items-center gap-2 border-2 cursor-pointer group ${
                          rituals[r.id] ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-transparent hover:border-slate-700'
                        }`}
                      >
                         <r.icon className={`w-5 h-5 ${rituals[r.id] ? 'text-white' : 'text-slate-500'}`} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{r.label}</span>
                         <span className={`text-[8px] font-black uppercase ${rituals[r.id] ? 'text-indigo-200' : 'text-slate-500'}`}>
                            {rituals[r.id] ? 'Synchronized' : r.hint}
                         </span>
                      </div>
                    ))}
                </div>

                <div className="mt-10 pt-10 border-t border-slate-800 w-full flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                      <Flame className="w-6 h-6 text-orange-500 animate-pulse transition-transform" />
                      <span className="text-2xl font-black italic tracking-tighter">{streak?.streak || 0}-CYCLE STREAK</span>
                   </div>
                   <button onClick={() => setShowSos(true)} className="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg">
                      <ShieldAlert className="w-6 h-6" />
                   </button>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[56px] p-12 shadow-xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">Sentiment Spectrum</h3>
                <div className="h-72">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie data={pieData} innerRadius={80} outerRadius={105} paddingAngle={10} dataKey="value">
                            {pieData.map((e, i) => <Cell key={i} fill={e.color} className="outline-none" />)}
                          </Pie>
                         <Tooltip 
                            contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                         />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="mt-8 space-y-4">
                   {pieData.length > 0 ? pieData.map(d => (
                     <div key={d.name} className="flex items-center justify-between group">
                        <div className="flex items-center space-x-3">
                           <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                           <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{d.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">{d.value} Cycles</span>
                     </div>
                   )) : (
                     <p className="text-sm text-center text-slate-400 font-black uppercase tracking-widest py-10">Zero Data Materialized</p>
                   )}
                </div>
            </div>

            <div className={`lg:col-span-8 rounded-[56px] p-16 relative overflow-hidden flex flex-col transition-all duration-700 border ${
                alert?.alerts?.length > 0 
                ? 'bg-rose-600 border-transparent text-white shadow-rose-500/30' 
                : 'bg-indigo-600 border-transparent text-white shadow-indigo-500/30'
            }`}>
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full gap-12">
                  <div className="flex-1 space-y-10">
                     <span className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest inline-block border border-white/10 backdrop-blur-md">System Awareness Protocol</span>
                     <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] uppercase italic">
                        {alert?.alerts?.length > 0 ? alert.alerts[0] : "Your emotional frequency is stabilizing nicely. Keep the momentum going."}
                     </h2>
                     <div className="flex flex-wrap gap-4">
                        <Link to="/journal" className="px-10 py-5 bg-white text-slate-900 rounded-[28px] font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl">Establish Deep Log</Link>
                        {alert?.alerts?.length > 0 && (
                            <button onClick={() => setShowSos(true)} className="px-10 py-5 bg-rose-900/40 text-white rounded-[28px] font-black uppercase tracking-widest text-[10px] border border-white/20 hover:bg-rose-900/60 transition-all backdrop-blur-md">Deploy SOS</button>
                        )}
                     </div>
                  </div>
                  <div className="hidden xl:flex flex-col items-center">
                      <div className="w-32 h-32 rounded-[40px] border-4 border-white/20 flex items-center justify-center animate-pulse shadow-inner bg-white/5">
                         {alert?.alerts?.length > 0 ? <CloudLightning className="w-16 h-16" /> : <SunMedium className="w-16 h-16" />}
                      </div>
                      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Frequency Status</p>
                  </div>
               </div>
               
               {/* Abstract Background for Card */}
               <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
            </div>
        </div>
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6">
         <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-5 rounded-[48px] shadow-[0_40px_80px_rgba(0,0,0,0.25)] border border-white dark:border-slate-800 flex items-center justify-between gap-2">
            {[
              { id: 'terrible', em: '😞' },
              { id: 'bad', em: '😟' },
              { id: 'okay', em: '🙂' },
              { id: 'good', em: '😄' },
              { id: 'excellent', em: '🌟' }
            ].map(m => (
              <button 
                key={m.id} 
                onClick={() => handleMoodQuickLog(m.id)}
                className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] flex items-center justify-center text-3xl hover:bg-indigo-600 hover:text-white hover:-translate-y-4 hover:scale-110 transition-all shadow-sm group relative"
                title={m.id}
              >
                {m.em}
                <div className="absolute -top-12 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all font-black uppercase tracking-widest pointer-events-none translate-y-2 group-hover:translate-y-0">{m.id}</div>
              </button>
            ))}
            <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-800/80 rounded-full flex items-center justify-center ml-4 cursor-help group relative border border-indigo-100 dark:border-slate-700">
               <Plus className="w-6 h-6 text-indigo-600" />
               <div className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-4 py-2 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all font-black uppercase tracking-widest translate-y-2 group-hover:translate-y-0">Quick Orbit</div>
            </div>
         </div>
      </div>
      
      {showSos && <SosMode onClose={() => setShowSos(false)} userId={auth?.id} />}
    </div>
  );
};

export default Dashboard;