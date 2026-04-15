import { Link } from "react-router-dom";
import { Home, ArrowLeft, AlertCircle, Sparkles } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/20 blur-[150px] rounded-full" />

      <div className="max-w-2xl w-full relative z-10 text-center space-y-12">
        <div className="relative inline-block">
            <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 mx-auto">
                <AlertCircle className="w-16 h-16 text-indigo-600" />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <Sparkles className="w-6 h-6" />
            </div>
        </div>

        <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Error 404</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none text-slate-900 dark:text-white">
                Lost <span className="text-indigo-600">Node</span>.
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                The synaptic path you requested does not exist or has been archived from the neural network.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <Link
            to="/"
            className="w-full sm:w-auto px-10 py-6 bg-indigo-600 text-white rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
          >
            <Home className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
            Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-10 py-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-[32px] font-black uppercase tracking-widest text-xs border border-slate-100 dark:border-slate-800 shadow-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center group"
          >
            <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;