import { Link } from "react-router-dom";
import { Heart, Users, Shield, TrendingUp, Compass, Activity, Zap, Star, ArrowRight, Sparkles } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden relative font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/20 blur-[120px] rounded-full" />

      <header className="fixed top-0 inset-x-0 z-[100] h-24 backdrop-blur-2xl border-b border-white/10 dark:border-slate-800/50">
        <div className="container mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4 group cursor-pointer">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-all">
                <Compass className="w-7 h-7 text-white" />
             </div>
             <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter uppercase italic leading-none">MoodMirror</span>
                <span className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase">V2.0 Core</span>
             </div>
          </div>
          <nav className="hidden md:flex items-center space-x-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <Link to="/about" className="hover:text-indigo-600 transition-colors">Origins</Link>
             <Link to="/login" className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[18px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10">
                Portal Log
             </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-8 pt-56 pb-32 relative z-10">
        <div className="text-center max-w-6xl mx-auto mb-32">
          <div className="inline-flex items-center space-x-3 px-5 py-2 bg-white dark:bg-slate-900 rounded-full mb-10 shadow-xl border border-slate-100 dark:border-slate-800">
             <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Cognitive Wellness Infrastructure</span>
          </div>
          
          <h1 className="text-[100px] md:text-[160px] font-black tracking-tighter leading-[0.75] mb-12 text-slate-900 dark:text-white uppercase italic">
            Mirror Your <br />
            <span className="text-indigo-600 ml-[-5px]">Essence.</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-slate-500 dark:text-slate-400 mb-16 max-w-4xl mx-auto font-medium leading-tight">
            A premium neural architecture for mental clarity. Decrypt your patterns, synthesize wellness, and achieve emotional equilibrium.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register-choice"
              className="px-16 py-8 bg-indigo-600 text-white rounded-[32px] font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center"
            >
              Begin Initialization
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {[
            { title: "Neuro-Logs", icon: TrendingUp, text: "Advanced time-series visualization for your emotional frequency.", color: "text-indigo-600", bg: "bg-indigo-50" },
            { title: "Bio-Rituals", icon: Zap, text: "Engineered habits designed to recalibrate your focus and energy.", color: "text-emerald-500", bg: "bg-emerald-50" },
            { title: "Privacy Node", icon: Shield, text: "Bank-grade encryption for your most private internal narratives.", color: "text-rose-500", bg: "bg-rose-50" }
          ].map((feature, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-12 rounded-[56px] shadow-2xl border border-slate-100 dark:border-slate-800 group hover:scale-[1.03] transition-all duration-500">
              <div className={`w-20 h-20 ${feature.bg} dark:bg-slate-800 rounded-3xl mb-10 flex items-center justify-center group-hover:rotate-12 transition-all shadow-inner`}>
                <feature.icon className={`w-10 h-10 ${feature.color}`} />
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">{feature.title}</h3>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        {/* Abstract Section */}
        <div className="mt-40 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[64px] p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:rotate-45 transition-transform duration-1000">
                <Sparkles className="w-64 h-64" />
            </div>
            <div className="max-w-2xl relative z-10">
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8 italic">Ready to <span className="text-indigo-500">Sync?</span></h2>
                <p className="text-xl opacity-60 font-medium mb-12">Join 10,000+ individuals optimizing their mental state with MoodMirror.</p>
                <Link to="/register-choice" className="inline-flex items-center px-12 py-6 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all">
                    Establish Connection
                </Link>
            </div>
            <div className="hidden lg:block w-80 h-80 bg-indigo-600 rounded-full blur-[100px] opacity-20" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-v2 bg-[#f8faff] dark:bg-slate-950 py-32">
         <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-20">
                <div className="max-w-xs space-y-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
                            <Compass className="w-6 h-6 text-white dark:text-slate-900" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic">MoodMirror</span>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed">Defining the standard for emotional data sovereignty and cognitive health.</p>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-20">
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Protocol</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-400">
                            <li><Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">The Vision</Link></li>
                            <li><Link to="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">Access Portal</Link></li>
                        </ul>
                     </div>
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Legal</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-400">
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Shield</a></li>
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">User Terms</a></li>
                        </ul>
                     </div>
                </div>
            </div>
            <div className="mt-32 pt-12 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                <span>© 2026 MoodMirror Neuro-Systems</span>
                <span className="text-indigo-500">Stability Confirmed</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Landing;