import { Heart, Target, Users, Lightbulb, Compass, Shield, Zap, Info } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/20 blur-[120px] rounded-full" />

      <header className="fixed top-0 inset-x-0 z-[100] h-24 backdrop-blur-2xl border-b border-white/10 dark:border-slate-800/50">
        <div className="container mx-auto px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4 group">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-all">
                <Compass className="w-7 h-7 text-white" />
             </div>
             <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter uppercase italic leading-none">MoodMirror</span>
                <span className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase">Origins</span>
             </div>
          </Link>
          <Link to="/login" className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[18px] text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
             Portal Log
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-8 pt-56 pb-32 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Segment */}
          <div className="mb-32">
            <div className="inline-flex items-center space-x-3 px-5 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-8">
               <Info className="w-4 h-4 text-indigo-600" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Cognitive Blueprint</span>
            </div>
            <h1 className="text-[80px] md:text-[120px] font-black tracking-tighter leading-[0.8] uppercase italic text-slate-900 dark:text-white mb-12">
                Neural <br />
                <span className="text-indigo-600">Foundations.</span>
            </h1>
            <p className="text-2xl md:text-3xl text-slate-500 dark:text-slate-400 font-medium max-w-4xl leading-tight">
                MoodMirror is not just a tracker; it's a sophisticated architecture designed to map the human emotional spectrum. We bridge the gap between biological sentiment and digital clarity.
            </p>
          </div>

          {/* Core Directives */}
          <div className="grid md:grid-cols-2 gap-12 mb-32">
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[56px] shadow-2xl border border-slate-100 dark:border-slate-800 space-y-8">
               <div className="w-16 h-16 bg-indigo-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-indigo-600" />
               </div>
               <h2 className="text-4xl font-black uppercase tracking-tighter italic">Mission Protocol</h2>
               <p className="text-xl text-slate-500 font-medium leading-relaxed">
                  To democratize cognitive wellness by providing professional-grade tracking infrastructure for the individual. We believe in data sovereignty and emotional transparency.
               </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-12 rounded-[56px] shadow-2xl border border-slate-100 dark:border-slate-800 space-y-8">
               <div className="w-16 h-16 bg-emerald-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-emerald-600" />
               </div>
               <h2 className="text-4xl font-black uppercase tracking-tighter italic">Vision Synthesis</h2>
               <p className="text-xl text-slate-500 font-medium leading-relaxed">
                  A future where mental health is quantified with precision and supported with empathy. A world where every individual has a perfect mirror of their inner state.
               </p>
            </div>
          </div>

          {/* Architectural Pillars */}
          <div className="mb-32">
             <h2 className="text-center text-6xl md:text-8xl font-black uppercase tracking-tighter italic mb-20">Core <span className="text-indigo-600">Pillars</span>.</h2>
             <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: 'Privacy Shield', desc: 'Neural narratives are end-to-end encrypted. No unauthorized interceptions.', icon: Shield },
                    { title: 'Ritual Logic', desc: 'Engineered habits based on behavioral psychology and neuroscience.', icon: Zap },
                    { title: 'Collective Sync', desc: 'Anonymous pattern synthesis to better understand the human condition.', icon: Users }
                ].map((pillar, i) => (
                    <div key={i} className="text-center p-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[48px] border border-white dark:border-slate-800 shadow-xl group hover:bg-white dark:hover:bg-slate-900 transition-all">
                        <div className="w-20 h-20 bg-indigo-600 rounded-[30px] mx-auto mb-10 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-all">
                            <pillar.icon className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-6">{pillar.title}</h3>
                        <p className="text-slate-500 font-medium italic">{pillar.desc}</p>
                    </div>
                ))}
             </div>
          </div>

          {/* Call to Action */}
          <div className="bg-slate-900 dark:bg-white rounded-[64px] p-24 text-center space-y-12">
             <h2 className="text-5xl md:text-8xl font-black text-white dark:text-slate-900 uppercase italic tracking-tighter leading-none">
                Begin your <br />
                <span className="text-indigo-500">Initialization.</span>
             </h2>
             <Link to="/register-choice" className="inline-flex px-16 py-8 bg-indigo-600 text-white rounded-[32px] font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all">
                Establish Link
             </Link>
          </div>
        </div>
      </main>

      <footer className="py-20 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">MoodMirror Alpha v2.0.4</span>
            <div className="flex space-x-12">
                <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">Core</Link>
                <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">Portal</Link>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default About;