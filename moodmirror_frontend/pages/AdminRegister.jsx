import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Check, ArrowLeft, Send, Sparkles, Activity, Lock, Mail, User, Phone } from "lucide-react";
import { toast } from "../components/common/Toast.jsx";
import axiosClient from "../services/axiosClient";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    adminId: "",
    password: "",
    confirmPassword: "",
  });

  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "firstname":
      case "lastname":
        if (!value.trim()) newErrors[name] = "Required";
        else if (value.length < 2) newErrors[name] = "Min 2 chars";
        else delete newErrors[name];
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) newErrors[name] = "Required";
        else if (!emailRegex.test(value)) newErrors[name] = "Invalid format";
        else delete newErrors[name];
        break;
      case "mobile":
        const mobileRegex = /^\d{10}$/;
        if (!value) newErrors[name] = "Required";
        else if (!mobileRegex.test(value)) newErrors[name] = "10 digits required";
        else delete newErrors[name];
        break;
      case "adminId":
        if (!value) newErrors[name] = "Required";
        else if (value.length < 5) newErrors[name] = "Min 5 chars";
        else delete newErrors[name];
        break;
      case "password":
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!value) newErrors[name] = "Required";
        else if (!passwordRegex.test(value)) newErrors[name] = "8+ chars, 1 num, 1 spec";
        else delete newErrors[name];
        break;
      case "confirmPassword":
        if (!value) newErrors[name] = "Required";
        else if (value !== formData.password) newErrors[name] = "Mismatch";
        else delete newErrors[name];
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
    if (name === "email" && value !== formData.email) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email || errors.email) {
      toast.error("Valid email required for dispatch.");
      return;
    }
    setLoading(true);
    try {
      await axiosClient.post('/send-otp', { email: formData.email });
      setOtpSent(true);
      toast.success("Security token dispatched.");
    } catch (error) {
      toast.error("Dispatch failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Token required.");
      return;
    }
    setLoading(true);
    try {
      await axiosClient.post('/verify-otp', { email: formData.email, otp });
      setOtpVerified(true);
      toast.success("Identity verified.");
    } catch (error) {
      toast.error("Invalid token.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Synchronous validation check
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
        const value = formData[key];
        switch (key) {
            case "firstname":
            case "lastname":
              if (!value.trim()) newErrors[key] = "Required";
              break;
            case "email":
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!value || !emailRegex.test(value)) newErrors[key] = "Invalid format";
              break;
            case "mobile":
              const mobileRegex = /^\d{10}$/;
              if (!value || !mobileRegex.test(value)) newErrors[key] = "10 digits";
              break;
            case "adminId":
              if (!value || value.length < 5) newErrors[key] = "Min 5 chars";
              break;
            case "password":
              if (!value || value.length < 8) newErrors[key] = "Min 8 chars";
              break;
            case "confirmPassword":
              if (value !== formData.password) newErrors[key] = "Mismatch";
              break;
        }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the highlighted errors.");
      return;
    }

    if (!otpVerified) {
      toast.error("Verify identity via token first.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.adminId,
        email: formData.email,
        password: formData.password,
        gender: 'other',
        birthdate: '1990-01-01',
        ageRange: '25-34',
        mobile: formData.mobile,
        journalFrequency: 'daily',
        role: 'admin',
        otp: true, // This will match 'accepted' in Laravel
        colorTheme: 'lavender', 
        emojiTheme: 'soft'  
      };

      const response = await axiosClient.post('/register', payload);
      if (response.data.success) {
        toast.success("Admin Protocol Activated.");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Activation failure.");
      }
    } catch (error) {
      toast.error("System breach during activation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10">
        <Link
          to="/register-choice"
          className="group inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Abort Protocol
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-[64px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row">
          {/* Left Side: Info */}
          <div className="md:w-1/3 bg-slate-900 p-12 text-white relative overflow-hidden flex flex-col justify-between">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Shield className="w-48 h-48" />
             </div>
             <div className="relative z-10">
                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mb-10 shadow-xl shadow-indigo-500/20">
                   <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-6">Admin <br />Protocol</h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                   Establishing high-level administrative access to the MoodMirror neural network.
                </p>
             </div>
             <div className="mt-12 space-y-4">
                <div className="flex items-center space-x-4">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Security: Level 5</span>
                </div>
                <div className="flex items-center space-x-4">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Status: Encrypted</span>
                </div>
             </div>
          </div>

          {/* Right Side: Form */}
          <div className="md:w-2/3 p-12 md:p-16 relative">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <Sparkles className="w-32 h-32 text-indigo-600" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Biological First Name</label>
                <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none rounded-[24px] font-bold transition-all text-sm"
                        placeholder="John"
                    />
                </div>
                {errors.firstname && <p className="text-rose-500 text-[8px] font-black uppercase tracking-widest ml-6">{errors.firstname}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Biological Last Name</label>
                <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none rounded-[24px] font-bold transition-all text-sm"
                        placeholder="Doe"
                    />
                </div>
                {errors.lastname && <p className="text-rose-500 text-[8px] font-black uppercase tracking-widest ml-6">{errors.lastname}</p>}
              </div>
            </div>

            <div className="space-y-8 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Biological Contact (Mobile)</label>
                <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none rounded-[24px] font-bold transition-all text-sm"
                        placeholder="10-digit mobile"
                        maxLength="10"
                    />
                </div>
                {errors.mobile && <p className="text-rose-500 text-[8px] font-black uppercase tracking-widest ml-6">{errors.mobile}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Neural Address (Email)</label>
                <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <div className="flex space-x-4">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="flex-1 pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none rounded-[24px] font-bold transition-all text-sm"
                            placeholder="admin@moodmirror.core"
                        />
                        <button 
                            type="button" 
                            onClick={handleSendOtp}
                            disabled={otpSent && !otpVerified}
                            className={`px-6 rounded-[24px] font-black uppercase tracking-widest text-[8px] flex items-center justify-center transition-all ${
                                otpSent ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-600 text-white shadow-lg'
                            }`}
                        >
                            {loading ? <Activity className="w-4 h-4 animate-spin" /> : (
                                otpSent ? <Check className="w-4 h-4" /> : "Dispatch OTP"
                            )}
                        </button>
                    </div>
                </div>
                {errors.email && <p className="text-rose-500 text-[8px] font-black uppercase tracking-widest ml-6">{errors.email}</p>}
              </div>

              {otpSent && !otpVerified && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Security Token</label>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="flex-1 px-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 outline-none rounded-[24px] font-black tracking-[1em] text-center"
                            placeholder="000000"
                            maxLength="6"
                        />
                        <button 
                            type="button" 
                            onClick={handleVerifyOtp}
                            className="px-8 bg-emerald-600 text-white rounded-[24px] font-black uppercase tracking-widest text-[8px] shadow-lg"
                        >
                            Verify
                        </button>
                    </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Terminal Access ID</label>
                <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                        type="text"
                        name="adminId"
                        value={formData.adminId}
                        onChange={handleChange}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none rounded-[24px] font-bold transition-all text-sm"
                        placeholder="ADMIN_NODE_01"
                    />
                </div>
                {errors.adminId && <p className="text-rose-500 text-[8px] font-black uppercase tracking-widest ml-6">{errors.adminId}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Archive Key</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none rounded-[24px] font-bold transition-all text-sm"
                    placeholder="Password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-[3.25rem] text-slate-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {errors.password && <p className="text-rose-500 text-[8px] font-black uppercase tracking-widest ml-6 mt-1">{errors.password}</p>}
                </div>

                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Confirm Key</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none rounded-[24px] font-bold transition-all text-sm"
                    placeholder="Repeat Key"
                  />
                   <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-6 top-[3.25rem] text-slate-300">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {errors.confirmPassword && <p className="text-rose-500 text-[8px] font-black uppercase tracking-widest ml-6 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !otpVerified}
              className="w-full py-6 bg-indigo-600 text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center group"
            >
              {loading ? <Activity className="w-6 h-6 animate-spin" /> : (
                <>
                  <Check className="w-4 h-4 mr-3" />
                  Initiate Activation
                </>
              )}
            </button>

            <div className="text-center mt-12">
                <p className="text-slate-400 font-medium">
                  Already established?{" "}
                  <Link to="/login" className="text-indigo-600 font-black uppercase tracking-widest text-[10px] ml-2 hover:underline">
                    Portal Log
                  </Link>
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;

