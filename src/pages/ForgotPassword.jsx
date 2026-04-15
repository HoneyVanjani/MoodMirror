import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Mail, Lock, Check, ShieldAlert, Sparkles, Activity, Compass } from "lucide-react";
import { toast } from "../components/common/Toast.jsx";
import axiosClient from "../services/axiosClient";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Reset password
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Contact link required.");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/send-reset-otp', { email: formData.email });
      toast.success("Security token dispatched to your neural address.");
      setStep(2);
    } catch (error) {
      toast.error("Entity not found in current registry.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error("Authorization token required.");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/verify-reset-otp', { email: formData.email, otp: formData.otp });
      toast.success("Token verified. Breach neutralized.");
      setStep(3);
    } catch (error) {
      toast.error("Invalid authorization token.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("All narrative fields required.");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Standard minimum: 8 alpha-numeric characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Narrative mismatch detected.");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/reset-password', {
        email: formData.email,
        otp: formData.otp,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword
      });
      toast.success("Identity narrative re-established.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error("Establishment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        <Link 
          to="/login" 
          className="group inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Abort Reset Sequence
        </Link>

        <div className="bg-white dark:bg-slate-900 p-12 md:p-16 rounded-[64px] shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          {/* Sparkle Decor */}
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
             <Sparkles className="w-32 h-32 text-indigo-600" />
          </div>

          <div className="text-center mb-12 relative z-10">
            <div className="flex justify-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                {step === 1 ? (
                  <Mail className="w-8 h-8 text-white" />
                ) : step === 2 ? (
                  <ShieldAlert className="w-8 h-8 text-white animate-pulse" />
                ) : (
                  <Lock className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Reset Protocol</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-[10px] font-black uppercase tracking-widest">
              {step === 1 && "Phase 1: Identity Localization"}
              {step === 2 && "Phase 2: Authorization Verification"}
              {step === 3 && "Phase 3: Narrative Re-encryption"}
            </p>
          </div>

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-6">Neural Address (Email)</label>
                <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none rounded-[24px] font-bold transition-all"
                        placeholder="Enter registered email"
                        required
                    />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 bg-indigo-600 text-white rounded-[28px] font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center group"
              >
                {loading ? <Activity className="w-6 h-6 animate-spin" /> : (
                    <>
                        Dispatch OTP
                        <ArrowLeft className="w-4 h-4 ml-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-6">Security Token (6-Digits)</label>
                <div className="relative group">
                    <Check className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 outline-none rounded-[24px] font-bold transition-all text-center tracking-[1em]"
                        maxLength="6"
                        placeholder="000000"
                        required
                    />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 bg-emerald-600 text-white rounded-[28px] font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center group"
              >
                {loading ? <Activity className="w-6 h-6 animate-spin" /> : (
                    <>
                        Validate Token
                        <ArrowLeft className="w-4 h-4 ml-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handlePasswordReset} className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
              <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-6">New Narrative (Password)</label>
                    <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none rounded-[24px] font-bold transition-all"
                            placeholder="Min 8 characters"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-6">Confirm Narrative</label>
                    <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none rounded-[24px] font-bold transition-all"
                            placeholder="Repeat password"
                            required
                        />
                    </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 bg-indigo-600 text-white rounded-[28px] font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center group"
              >
                {loading ? <Activity className="w-6 h-6 animate-spin" /> : (
                    <>
                        Establish Security
                        <ArrowLeft className="w-4 h-4 ml-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 font-medium">
            Remember your credentials?{" "}
            <Link to="/login" className="text-indigo-600 font-black uppercase tracking-widest text-[10px] ml-2 hover:underline underline-offset-4">
              Portal Log
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;