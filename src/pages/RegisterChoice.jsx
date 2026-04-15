import { Link } from "react-router-dom";
import { Heart, Shield, UserPlus, ArrowLeft, Compass, Sparkles } from "lucide-react";

const RegisterChoice = () => {
  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Neural Link Break (Home)
        </Link>

        <div className="text-center mb-16 animate-in fade-in zoom-in duration-700">
           <div className="w-16 h-16 bg-indigo-600 rounded-[28px] mx-auto mb-8 flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Compass className="w-8 h-8 text-white" />
           </div>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-none">Initialize <span className="text-indigo-600">Identity.</span></h1>
           <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-[0.2em] text-[10px]">Select your operational clearance level</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
           {/* User Registration */}
           <Link to="/register/user" className="bg-white dark:bg-slate-900 p-12 rounded-[56px] border border-slate-100 dark:border-slate-800 shadow-2xl hover:scale-[1.05] transition-all duration-500 text-left group flex flex-col items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                 <Sparkles className="w-32 h-32 text-indigo-600" />
              </div>
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-10 flex items-center justify-center group-hover:rotate-6 transition-all">
                 <UserPlus className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Personal Identity</h3>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12">Start your journey to track your emotional frequency and build better cognitive rituals.</p>
              <div className="mt-auto inline-flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-600">Register <ArrowLeft className="w-3 h-3 ml-2 rotate-180" /></div>
           </Link>

           {/* Admin Registration */}
           <Link to="/register/admin" className="bg-white dark:bg-slate-900 p-12 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl hover:scale-[1.05] transition-all duration-500 text-left group flex flex-col items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                 <Sparkles className="w-32 h-32 text-emerald-600" />
              </div>
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl mb-10 flex items-center justify-center group-hover:rotate-6 transition-all">
                 <Shield className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Admin Protocol</h3>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12">Authorize a professional administrative link to oversee ecosystem data and metrics.</p>
              <div className="mt-auto inline-flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-600">Authorize Path <ArrowLeft className="w-3 h-3 ml-2 rotate-180" /></div>
           </Link>
        </div>

        <div className="mt-20 text-center">
          <p className="text-slate-500 text-xs font-medium">
            Existing Identity?{" "}
            <Link to="/login" className="text-indigo-600 font-black uppercase tracking-widest ml-2 hover:underline underline-offset-4">
              Portal Log
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterChoice;