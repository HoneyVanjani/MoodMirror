import { useState } from "react";
import { ArrowRight, ArrowLeft, User, Eye, EyeOff, Check, X, Shield, Lock } from "lucide-react";
import { storage } from "../../utils/storage.js";

const Step3Account = ({ formData, errors, updateFormData, updateErrors, validateStep, nextStep, prevStep }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    if (name === 'username') {
      const newErrors = { ...errors };
      if (value.length >= 3) {
        if (storage.isUsernameTaken(value)) {
          newErrors.username = "This username is already taken.";
        } else {
          delete newErrors.username;
        }
      }
      updateErrors(newErrors);
    }
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Username</label>
          <div className="relative group">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none rounded-2xl font-bold transition-all"
              placeholder="Choose a username"
            />
          </div>
          {errors.username && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest ml-2">{errors.username}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Password</label>
          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-16 pr-14 py-5 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none rounded-2xl font-bold transition-all"
              placeholder="Min. 8 characters"
            />
            <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
            >
               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {formData.password && (
            <div className="px-2 space-y-3 pt-2">
               <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        i <= strength 
                          ? strength < 3 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    />
                  ))}
               </div>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Password Strength: {strength < 3 ? 'Weak' : 'Strong'}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none rounded-2xl font-bold transition-all"
            placeholder="Repeat your password"
          />
          {errors.confirmPassword && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest ml-2">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6">
         <button onClick={prevStep} className="p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
            <ArrowLeft className="w-6 h-6" />
         </button>
         <div className="flex items-center space-x-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Next: Preferences</span>
            <button
               onClick={() => validateStep(3) && nextStep()}
               className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 hover:scale-110 active:scale-95 transition-all"
            >
               <ArrowRight className="w-6 h-6" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default Step3Account;