import React from "react";
import { Sprout, Leaf, Flower2, TreePine, Award } from "lucide-react";

const ZenGarden = ({ streak }) => {
  // Determine plant stage based on streak days
  const days = streak?.streak || 0;
  
  let StageIcon = Sprout;
  let stageName = "A Waiting Seed";
  let color = "text-amber-600";
  let bgGlow = "bg-amber-100";
  let message = "Log your mood today to plant your seed.";

  if (days >= 1 && days <= 2) {
    StageIcon = Leaf;
    stageName = "Little Sprout";
    color = "text-emerald-500";
    bgGlow = "bg-emerald-100";
    message = "Your mindfulness is starting to grow!";
  } else if (days >= 3 && days <= 6) {
    StageIcon = Flower2;
    stageName = "Blooming Flower";
    color = "text-rose-500";
    bgGlow = "bg-rose-100";
    message = "Beautiful! A consistent habit is blooming.";
  } else if (days >= 7) {
    StageIcon = TreePine;
    stageName = "Mighty Tree";
    color = "text-teal-600";
    bgGlow = "bg-teal-100";
    message = "Incredible streak! You have built a strong foundation.";
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mt-4 relative overflow-hidden group hover:shadow-md transition-all">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <StageIcon className="w-32 h-32" />
      </div>
      
      <div className="text-center z-10 w-full">
        <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-center">
          <span>Your Zen Garden</span>
          {days >= 7 && <Award className="w-4 h-4 ml-2 text-yellow-500" />}
        </h4>
        
        <div className={`mx-auto w-24 h-24 flex items-center justify-center rounded-full ${bgGlow} shadow-inner mb-4 transition-all duration-500 hover:scale-110`}>
          <StageIcon className={`w-12 h-12 ${color} drop-shadow-md animate-in zoom-in duration-500`} />
        </div>
        
        <h3 className={`text-xl font-extrabold ${color} mb-1`}>{stageName}</h3>
        <p className="text-sm text-slate-500 font-medium">{message}</p>
        
        {/* Progress Bar to next stage */}
        <div className="mt-6 w-full max-w-xs mx-auto">
          <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold">
            <span>Level {days < 3 ? 1 : days < 7 ? 2 : 3}</span>
            <span>{days} Days</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${bgGlow.replace('bg-', 'bg-').replace('100', '400')} transition-all duration-1000`} 
              style={{ width: `${Math.min((days / 7) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZenGarden;
