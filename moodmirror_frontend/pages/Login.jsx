import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, UserCircle, Shield, Eye, EyeOff, ArrowLeft, Compass, Zap, Activity, Mail, Lock, Sparkles } from "lucide-react";
import { storage } from "../utils/storage.js";
import { toast } from "../components/common/Toast.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("");
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      toast.error("Credentials required.");
      return;
    }
    setLoading(true);
    try {
      const data = await storage.authenticate(formData.identifier, formData.password);
      if (!data || data.status !== "success") {
        toast.error("Incorrect username or password.");
        return;
      }
      const user = data.user;
      if (loginType === "admin" && user.role !== "admin") {
        toast.error("You do not have admin access.");
        return;
      }
      const authData = {
        id: user.id || user._id,
        role: user.role || "user",
        firstname: user.firstname || user.username,
        username: user.username || user.email,
        token: data.token,
      };
      storage.setAuth(authData);
      toast.success(`Access granted, ${authData.firstname}.`);
      if (authData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl w-full relative z-10">
        {!loginType ? (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-16">
               <div className="w-16 h-16 bg-indigo-600 rounded-[28px] mx-auto mb-8 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                  <Compass className="w-8 h-8 text-white" />
               </div>
               <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-none">Access <span className="text-indigo-600">Portal.</span></h1>
               <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-[0.2em] text-[10px]">Portal Connection Required</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
               <button 
                  onClick={() => setLoginType("user")}
                  className="bg-white dark:bg-slate-900 p-12 rounded-[56px] border border-slate-100 dark:border-slate-800 shadow-2xl hover:scale-[1.05] transition-all duration-500 text-left group relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                    <Sparkles className="w-32 h-32 text-indigo-600" />
                  </div>
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-10 flex items-center justify-center group-hover:rotate-6 transition-all">
                     <UserCircle className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Neural User</h3>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12">Log your daily moods and synchronize with your wellness rituals.</p>
                  <div className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover:translate-x-2 transition-transform">Establish Link <ArrowLeft className="w-3 h-3 ml-2 rotate-180" /></div>
               </button>

               <button 
                  onClick={() => setLoginType("admin")}
                  className="bg-white dark:bg-slate-900 p-12 rounded-[56px] border border-slate-100 dark:border-slate-800 shadow-2xl hover:scale-[1.05] transition-all duration-500 text-left group relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                    <Sparkles className="w-32 h-32 text-emerald-600" />
                  </div>
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl mb-10 flex items-center justify-center group-hover:rotate-6 transition-all">
                     <Shield className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Admin Protocol</h3>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12">Professional nexus for ecosystem surveillance and data management.</p>
                  <div className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:translate-x-2 transition-transform">Authorize Link <ArrowLeft className="w-3 h-3 ml-2 rotate-180" /></div>
               </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto animate-in slide-in-from-bottom-10 fade-in duration-500">
             <button 
                onClick={() => setLoginType("")}
                className="group flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 mb-10 transition-colors"
             >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Return to options
             </button>

             <div className="bg-white dark:bg-slate-900 p-12 md:p-16 rounded-[64px] shadow-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-center mb-12">
                   <div className={`w-16 h-16 rounded-3xl mx-auto mb-8 flex items-center justify-center ${loginType === 'admin' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-indigo-600 shadow-indigo-500/20'} shadow-xl`}>
                      {loginType === 'admin' ? <Shield className="w-8 h-8 text-white" /> : <UserCircle className="w-8 h-8 text-white" />}
                   </div>
                   <h2 className="text-4xl font-black uppercase tracking-tighter italic">{loginType === 'admin' ? 'Admin Creds' : 'User Entry'}</h2>
                   <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Authentication Sequence Required</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-6">Log Identity</label>
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                          type="text"
                          name="identifier"
                          value={formData.identifier}
                          onChange={handleChange}
                          className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none rounded-[24px] font-bold transition-all shadow-inner"
                          placeholder={loginType === "admin" ? "Admin ID" : "username or email"}
                          required
                        />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex items-center justify-between px-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pass-Key</label>
                        <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600">Lost Key?</Link>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-16 pr-16 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none rounded-[24px] font-bold transition-all shadow-inner"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                   </div>

                   <button 
                     type="submit" 
                     disabled={loading}
                     className={`w-full py-6 ${loginType === 'admin' ? 'bg-emerald-600 hover:shadow-emerald-500/40' : 'bg-indigo-600 hover:shadow-indigo-500/40'} text-white rounded-[28px] font-black uppercase tracking-[0.2em] text-xs transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center shadow-2xl relative overflow-hidden group`}
                   >
                     {loading ? (
                        <Activity className="w-6 h-6 animate-spin" />
                     ) : (
                        <>
                            Establish Link
                            <ArrowLeft className="w-4 h-4 ml-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </>
                     )}
                   </button>
                </form>

                {loginType === "user" && (
                  <div className="mt-12 text-center">
                    <p className="text-slate-400 font-medium">
                        New Identity? <Link to="/register-choice" className="text-indigo-600 font-black uppercase tracking-widest text-[10px] ml-2 hover:underline underline-offset-4 decoration-2">Initialize</Link>
                    </p>
                  </div>
                )}
             </div>
          </div>
        )}

        <div className="mt-20 text-center">
           <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Neural Break (Home)</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;