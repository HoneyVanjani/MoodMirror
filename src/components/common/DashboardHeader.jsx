import { Link, useNavigate, useLocation } from "react-router-dom";
import { Compass, LogOut } from "lucide-react";
import { storage } from "../../utils/storage.js";
import { toast } from "./Toast.jsx";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = storage.getAuth();
  const isAdmin = auth?.role === "admin";

  const handleSignOut = () => {
    storage.clearAuth();
    toast.success("Connection terminated safely.");
    navigate("/");
  };

  const userTabs = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Journal', path: '/journal' },
    { name: 'Activity', path: '/activity' },
    { name: 'Feedback', path: '/feedback' }
  ];

  const adminTabs = [
    { name: 'Admin Console', path: '/admin' }
  ];

  const tabs = isAdmin ? adminTabs : userTabs;
  const dashboardPath = isAdmin ? "/admin" : "/dashboard";

  return (
    <header className="fixed top-0 inset-x-0 z-[100] h-20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link to={dashboardPath} className="flex items-center space-x-4 group">
           <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-all">
              <Compass className="w-6 h-6 text-white" />
           </div>
           <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase italic leading-none text-slate-900 dark:text-white">MoodMirror</span>
              <span className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase">{isAdmin ? "Admin Protocol" : "V2.0 Core"}</span>
           </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-10">
           {tabs.map(tab => (
             <Link 
                key={tab.name} 
                to={tab.path} 
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                    location.pathname === tab.path 
                    ? 'text-indigo-600 underline underline-offset-8 decoration-2' 
                    : 'text-slate-400 hover:text-indigo-600'
                }`}
             >
                {tab.name}
             </Link>
           ))}
           <button 
              onClick={handleSignOut} 
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 transition-all ml-4"
              title="Sign Out"
           >
              <LogOut className="w-5 h-5" />
           </button>
        </nav>

        <div className="lg:hidden flex items-center space-x-4">
            <Link to={dashboardPath} className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                {isAdmin ? "Admin" : "Dash"}
            </Link>
            <button onClick={handleSignOut} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400">
                <LogOut className="w-5 h-5" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

