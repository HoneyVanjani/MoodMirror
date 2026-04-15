import { ArrowLeft, ArrowRight, BookOpen, Check, Star, Zap } from "lucide-react";
import { toast } from "../../components/common/Toast.jsx";

const Step4Question = ({
  formData,
  errors,
  updateFormData,
  updateErrors,
  validateStep,
  handleSubmit,
  prevStep,
  loading,
  isLastStep = false
}) => {
  const options = [
    { value: "daily", label: "Daily", desc: "I write in my journal every day.", ic: "🌅" },
    { value: "weekly", label: "Weekly", desc: "I journal a few times per week.", ic: "📝" },
    { value: "rarely", label: "Occasionally", desc: "I journal when I feel like it.", ic: "💭" },
    { value: "never", label: "Never", desc: "I don't currently keep a journal.", ic: "🌱" }
  ];

  const handleSelect = (v) => {
    updateFormData({ journalFrequency: v });
    if (errors.journalFrequency) updateErrors({ journalFrequency: null });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
      <div className="space-y-8">
        <div className="text-center md:text-left">
           <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 block mb-2">Personal Habits</label>
           <h3 className="text-3xl font-black uppercase tracking-tighter">How often do you journal?</h3>
        </div>

        <div className="grid gap-4">
           {options.map((o) => (
             <button
               key={o.value}
               onClick={() => handleSelect(o.value)}
               className={`p-6 rounded-[32px] transition-all text-left border-2 flex items-center justify-between group ${
                 formData.journalFrequency === o.value
                   ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-500/20 scale-[1.02]'
                   : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
               }`}
             >
               <div className="flex items-center space-x-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                    formData.journalFrequency === o.value ? 'bg-white/20' : 'bg-white dark:bg-slate-900 shadow-inner'
                  }`}>
                    {o.ic}
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-tighter text-lg">{o.label}</h4>
                    <p className={`text-[10px] font-medium uppercase tracking-widest ${formData.journalFrequency === o.value ? 'text-indigo-100' : 'text-slate-500'}`}>{o.desc}</p>
                  </div>
               </div>
               {formData.journalFrequency === o.value && <Check className="w-6 h-6" />}
             </button>
           ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6">
         <button onClick={prevStep} className="p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
            <ArrowLeft className="w-6 h-6" />
         </button>
         <div className="flex items-center space-x-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Next: Theme Setup</span>
            <button
               onClick={() => formData.journalFrequency ? handleSubmit() : toast.error("Please select an option.")}
               className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 hover:scale-110 active:scale-95 transition-all"
            >
               <ArrowRight className="w-6 h-6" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default Step4Question;
