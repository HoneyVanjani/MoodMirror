import { useState, useEffect } from "react";
import { X, Wind, BrainCircuit, CheckCircle2 } from "lucide-react";
import { storage } from "../../utils/storage";
import { toast } from "../common/Toast";

const SosMode = ({ onClose, userId }) => {
  const [activeTab, setActiveTab] = useState("breathe"); // "breathe" or "cbt"
  const [breathPhase, setBreathPhase] = useState("Inhale");
  const [breathTime, setBreathTime] = useState(4);
  const [isBreathing, setIsBreathing] = useState(false);
  const [cbtData, setCbtData] = useState({
    trigger: "",
    negativeThought: "",
    reframedThought: "",
  });

  // Breathing Animation Logic (4-4-6 method)
  useEffect(() => {
    let interval;
    if (isBreathing) {
      let currentPhase = "Inhale";
      let timeLeft = 4;
      setBreathPhase(currentPhase);
      setBreathTime(timeLeft);

      interval = setInterval(() => {
        timeLeft -= 1;
        
        if (timeLeft <= 0) {
          if (currentPhase === "Inhale") {
            currentPhase = "Hold";
            timeLeft = 4;
          } else if (currentPhase === "Hold") {
            currentPhase = "Exhale";
            timeLeft = 6;
          } else {
            currentPhase = "Inhale";
            timeLeft = 4;
          }
          setBreathPhase(currentPhase);
        }
        setBreathTime(timeLeft);
      }, 1000);
    } else {
      setBreathPhase("Ready");
      setBreathTime(0);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  const handleCbtSubmit = async (e) => {
    e.preventDefault();
    if (!cbtData.trigger || !cbtData.negativeThought || !cbtData.reframedThought) {
      toast.error("Please fill out all fields to complete the reframing.");
      return;
    }
    
    // In the future this will hit our advanced Laravel endpoint
    // For now, we simulate saving the CBT exercise via activity log
    try {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`breathed_${today}`, 'true');
        toast.success("Cognitive Reframing saved. Inhale peace, exhale stress. 🤍");
        setTimeout(() => onClose(), 2000);
    } catch(err) {
        toast.error("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">SOS Crisis Mode</h2>
            <p className="text-slate-500 dark:text-slate-400">Take a deep breath. You are safe here. Let's work through this together.</p>
          </div>

          {/* Custom Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl mb-8">
            <button 
              onClick={() => setActiveTab("breathe")}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all ${activeTab === 'breathe' ? 'bg-white dark:bg-slate-800 shadow-sm text-sky-600 dark:text-sky-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              <Wind className="w-5 h-5" />
              <span>4-4-6 Breathing</span>
            </button>
            <button 
              onClick={() => setActiveTab("cbt")}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all ${activeTab === 'cbt' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            >
              <BrainCircuit className="w-5 h-5" />
              <span>CBT Reframing</span>
            </button>
          </div>

          {/* BREATHING MODULE */}
          {activeTab === "breathe" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                {/* Expanding / Contracting Circle based on phase */}
                <div 
                   className={`absolute rounded-full bg-sky-200/50 dark:bg-sky-900/50 transition-all duration-1000 ease-in-out ${
                     !isBreathing ? 'w-48 h-48' :
                     breathPhase === 'Inhale' ? 'w-64 h-64' :
                     breathPhase === 'Hold' ? 'w-64 h-64' : 'w-32 h-32'
                   }`}
                />
                <div className="absolute z-10 text-center">
                  <span className="block text-3xl font-bold text-sky-700 dark:text-sky-300">
                    {breathPhase}
                  </span>
                  {isBreathing && (
                    <span className="block text-xl font-medium text-sky-600/80 dark:text-sky-400 mt-2">
                      {breathTime}s
                    </span>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setIsBreathing(!isBreathing)}
                className={`px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${
                  isBreathing 
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white'
                }`}
              >
                {isBreathing ? "Stop Exercise" : "Start Breathing Exercise"}
              </button>
            </div>
          )}

          {/* CBT REFRAMING MODULE */}
          {activeTab === "cbt" && (
            <form onSubmit={handleCbtSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">1. The Trigger (What happened?)</label>
                <textarea 
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-24"
                  placeholder="e.g., I made a minor mistake at work today..."
                  value={cbtData.trigger}
                  onChange={(e) => setCbtData({...cbtData, trigger: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">2. Automatic Negative Thought</label>
                <textarea 
                  className="w-full p-4 rounded-xl bg-red-50 dark:bg-rose-900/20 border border-red-200 dark:border-rose-800 focus:ring-2 focus:ring-red-400 outline-none transition-all resize-none h-24"
                  placeholder="e.g., I am completely incompetent and going to be fired..."
                  value={cbtData.negativeThought}
                  onChange={(e) => setCbtData({...cbtData, negativeThought: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">3. Cognitive Reframe (Is 100% true? Look for the balance)</label>
                <textarea 
                  className="w-full p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-400 outline-none transition-all resize-none h-24"
                  placeholder="e.g., I made one mistake, but I've done great work all year. Every human makes mistakes..."
                  value={cbtData.reframedThought}
                  onChange={(e) => setCbtData({...cbtData, reframedThought: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full flex justify-center items-center py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-1"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Save Reframe & Return
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default SosMode;
