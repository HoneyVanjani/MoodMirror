import { Link } from "react-router-dom";
import { ArrowLeft, Activity as ActivityIcon, Filter, Calendar as CalIcon, Search, Clock, ChevronRight } from "lucide-react";
import { storage } from "../utils/storage.js";
import { useState, useEffect } from "react";
import DashboardHeader from "../components/common/DashboardHeader.jsx";

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");
  const auth = storage.getAuth();

  useEffect(() => {
    if (!auth?.id) return;
    storage.getActivity(auth.id)
      .then(data => {
        if (Array.isArray(data.activities)) {
          setActivities(data.activities);
        } else {
          setActivities([]);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setActivities([]);
      });
  }, [auth?.id]);

  const filteredActivities = activities.filter(activity => {
    if (filter === "all") return true;
    if (filter === "mood") return activity.type.includes("mood");
    if (filter === "login") return activity.type === "login"; 
    return true;
  });

  const getActivityTheme = (type) => {
    if (type.includes("mood")) return { icon: "😊", color: "bg-indigo-50 text-indigo-600", border: "border-indigo-100" };
    if (type === "login") return { icon: "🔐", color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" };
    if (type.includes("registered")) return { icon: "👋", color: "bg-purple-50 text-purple-600", border: "border-purple-100" };
    if (type.includes("onboarding")) return { icon: "🎨", color: "bg-amber-50 text-amber-600", border: "border-amber-100" };
    return { icon: "📝", color: "bg-slate-50 text-slate-600", border: "border-slate-100" };
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <DashboardHeader />

      <main className="container mx-auto px-6 pt-32 pb-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                    <ActivityIcon className="w-3 h-3 text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Activity Stream</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-slate-900 dark:text-white">
                    Wellness <span className="text-indigo-600">History</span>.
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-xl">
                    A comprehensive log of your emotional evolution and system interactions.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 flex items-center space-x-2">
                {[
                  { id: "all", label: "All" },
                  { id: "mood", label: "Moods" },
                  { id: "login", label: "Access" }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFilter(opt.id)}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      filter === opt.id
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
            </div>
        </div>

        <div className="grid gap-6">
           {filteredActivities.length === 0 ? (
             <div className="bg-white dark:bg-slate-900 rounded-[48px] p-20 shadow-2xl border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8">
                   <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">No data streams detected</h3>
                <p className="text-slate-500 font-medium max-w-sm mb-10 text-lg">Your activity history will materialize here as you interact with the system.</p>
                <Link to="/dashboard" className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all">Back to Dashboard</Link>
             </div>
           ) : (
             filteredActivities.map((activity, idx) => {
               const theme = getActivityTheme(activity.type);
               const timeObj = formatDate(activity.timestamp);
               return (
                 <div 
                   key={activity.id || activity._id || idx} 
                   className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl border border-slate-50 dark:border-slate-800 flex items-center group hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:translate-x-2"
                 >
                    <div className={`w-16 h-16 ${theme.color} rounded-3xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform`}>
                        {theme.icon}
                    </div>
                    <div className="flex-1 ml-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-1">{activity.type.replace('_', ' ')}</p>
                        <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">{activity.description}</h4>
                        <div className="flex items-center space-x-6 mt-4 opacity-50">
                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest">
                                <CalIcon className="w-3 h-3 mr-2" />
                                {timeObj.date}
                            </div>
                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest">
                                <Clock className="w-3 h-3 mr-2" />
                                {timeObj.time}
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all ml-4" />
                 </div>
               );
             })
           )}
        </div>
      </main>

      {/* Floating Decor */}
      <div className="fixed top-[20%] right-[-5%] w-96 h-96 bg-indigo-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[10%] left-[-5%] w-96 h-96 bg-purple-200/20 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default Activity;