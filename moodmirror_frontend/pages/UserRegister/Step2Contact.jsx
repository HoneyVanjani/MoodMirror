import { useState } from "react";
import { ArrowRight, ArrowLeft, Phone, Mail, Send, Check, ShieldCheck, Zap } from "lucide-react";
import { toast } from "../../components/common/Toast.jsx";
import axiosClient from "../../services/axiosClient";

const Step2Contact = ({ formData, errors, updateFormData, updateErrors, validateStep, nextStep, prevStep }) => {
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    if (errors[name]) updateErrors({ [name]: null });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Email address is required.");
      return;
    }
    try {
      await axiosClient.post('/send-otp', { email: formData.email });
      updateFormData({ otpSent: true });
      toast.success("Verification code sent.");
    } catch (error) {
      toast.error("Failed to send code.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      await axiosClient.post('/verify-otp', { email: formData.email, otp });
      updateFormData({ otpVerified: true });
      toast.success("Email verified.");
    } catch (error) {
      toast.error("Invalid code.");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none rounded-2xl font-bold transition-all"
              placeholder="example@mail.com"
              disabled={formData.otpVerified}
            />
          </div>
          {errors.email && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest ml-2">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Mobile Number</label>
          <div className="relative group">
            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none rounded-2xl font-bold transition-all"
              placeholder="10-digit mobile number"
              maxLength="10"
            />
          </div>
          {errors.mobile && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest ml-2">{errors.mobile}</p>}
        </div>

        {(formData.email && !formData.otpVerified) && (
          <div className="p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-[32px] border-2 border-dashed border-indigo-200 dark:border-indigo-800/50">
             {!formData.otpSent ? (
               <div className="text-center space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Verification Required</p>
                  <button 
                    onClick={handleSendOtp}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
                  >
                    Send OTP
                  </button>
               </div>
             ) : (
               <div className="space-y-6">
                  <label className="block text-center text-[10px] font-black uppercase tracking-widest text-indigo-400">Enter Verification Code</label>
                  <div className="flex gap-3">
                     <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 outline-none rounded-2xl font-black text-center tracking-[0.5em] text-xl"
                        placeholder="000000"
                        maxLength="6"
                     />
                     <button
                        onClick={handleVerifyOtp}
                        className="px-6 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all"
                     >
                        <ShieldCheck className="w-6 h-6" />
                     </button>
                  </div>
               </div>
             )}
          </div>
        )}

        {formData.otpVerified && (
           <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-[32px] border-2 border-emerald-500/30 flex items-center justify-center space-x-3 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-[10px]">
              <Check className="w-4 h-4" />
              <span>Verification Completed</span>
           </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-6">
         <button onClick={prevStep} className="p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
            <ArrowLeft className="w-6 h-6" />
         </button>
         <div className="flex items-center space-x-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Next: Security</span>
            <button
               onClick={() => validateStep(2) && formData.otpVerified && nextStep()}
               disabled={!formData.otpVerified}
               className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 hover:scale-110 active:scale-95 disabled:opacity-50 transition-all"
            >
               <ArrowRight className="w-6 h-6" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default Step2Contact;