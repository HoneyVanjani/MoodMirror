import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Palette, ArrowRight, ArrowLeft, Star, Compass } from "lucide-react";
import { storage } from "../utils/storage.js";
import { toast } from "../components/common/Toast.jsx";

const OnboardingPalette = ({ onComplete, isInsideRegister = false, prevStep }) => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");

  const colorThemes = [
    { id: "lavender", name: "Lavender Purple", colors: ["#A78BFA", "#C4B5FD"] },
    { id: "sky", name: "Sky Blue", colors: ["#7DD3FC", "#93C5FD"] },
    { id: "mint", name: "Mint Green", colors: ["#6EE7B7", "#A7F3D0"] },
    { id: "peach", name: "Peach Orange", colors: ["#FDBA74", "#FED7AA"] }
  ];

  const emojiThemes = [
    { id: "soft", name: "Soft & Friendly", emojis: ["😌", "🌸", "💙", "🌟", "🤗"] },
    { id: "nature", name: "Nature Emojis", emojis: ["🌱", "🌿", "🌻", "🦋", "🌈"] },
    { id: "classic", name: "Classic Icons", emojis: ["😊", "😔", "😐", "😄", "🌟"] },
    { id: "minimal", name: "Simple Shapes", emojis: ["●", "◐", "○", "◆", "★"] }
  ];

  const handleComplete = () => {
    if (!selectedTheme || !selectedEmoji) {
      toast.error("Please complete your setup.");
      return;
    }
    const selectedThemeObj = colorThemes.find(t => t.id === selectedTheme);
    const selectedEmojiSet = emojiThemes.find(e => e.id === selectedEmoji);
    
    localStorage.setItem('userTheme', JSON.stringify(selectedThemeObj));
    localStorage.setItem('userEmojis', JSON.stringify(selectedEmojiSet));
    document.body.classList.add(`theme-${selectedTheme}`);
    
    if (isInsideRegister) {
      onComplete(selectedTheme, selectedEmoji);
    } else {
      navigate("/dashboard");
    }
  };

  const Content = (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
      <div className="space-y-8">
        <div>
           <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 block mb-2">Theme Setup</label>
           <h2 className="text-2xl font-black uppercase tracking-tighter">Choose Color Style</h2>
           <div className="grid grid-cols-2 gap-4 mt-6">
              {colorThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-6 rounded-[32px] transition-all text-left border-2 flex items-center space-x-4 ${
                    selectedTheme === theme.id 
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-500/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex -space-x-2">
                    {theme.colors.map((color, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <span className="font-black uppercase tracking-widest text-[10px]">{theme.name}</span>
                </button>
              ))}
           </div>
        </div>

        <div>
           <h2 className="text-2xl font-black uppercase tracking-tighter">Emoji Set</h2>
           <div className="grid grid-cols-2 gap-4 mt-6">
              {emojiThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedEmoji(theme.id)}
                  className={`p-6 rounded-[32px] transition-all text-left border-2 ${
                    selectedEmoji === theme.id 
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-500/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex space-x-2 text-xl mb-2">
                    {theme.emojis.slice(0, 3).map((emoji, i) => (
                      <span key={i}>{emoji}</span>
                    ))}
                  </div>
                  <span className="font-black uppercase tracking-widest text-[10px]">{theme.name}</span>
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6">
         {prevStep && (
            <button onClick={prevStep} className="p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
               <ArrowLeft className="w-6 h-6" />
            </button>
         )}
         <div className="flex items-center space-x-6 ml-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Finish Setup</span>
            <button
               onClick={handleComplete}
               disabled={!selectedTheme || !selectedEmoji}
               className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 hover:scale-110 active:scale-95 disabled:opacity-50 transition-all font-black text-xs uppercase"
            >
               Finish
            </button>
         </div>
      </div>
    </div>
  );

  if (isInsideRegister) return Content;

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 p-6 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/20 blur-[100px] rounded-full" />
        <div className="max-w-2xl w-full bg-white dark:bg-slate-900 p-14 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 relative z-10">
           {Content}
        </div>
    </div>
  );
};

export default OnboardingPalette;