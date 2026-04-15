import { useState } from "react";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import { Heart, ArrowLeft, ArrowRight, Check, Compass, Star, Zap } from "lucide-react";
import { storage } from "../../utils/storage.js";
import axios from "axios";
import { toast } from "../../components/common/Toast.jsx";

const API_BASE_URL = "http://127.0.0.1:8000/api";

import Step1Personal from "./Step1Personal.jsx";
import Step2Contact from "./Step2Contact.jsx";
import Step3Account from "./Step3Account.jsx";
import Step4Question from "./Step4Question.jsx";
import OnboardingPalette from "../OnboardingPalette";

const RegisterWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    birthdate: "",
    ageRange: "",
    mobile: "",
    email: "",
    otpSent: false,
    otpVerified: false,
    username: "",
    password: "",
    confirmPassword: "",
    journalFrequency: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const steps = [
    { number: 1, title: "Profile", path: "/register/user" },
    { number: 2, title: "Contact", path: "/register/user/step2" },
    { number: 3, title: "Security", path: "/register/user/step3" },
    { number: 4, title: "Preferences", path: "/register/user/step4" },
    { number: 5, title: "Theme", path: "/register/user/theme" }
  ];

  const getCurrentStepFromPath = () => {
    const path = location.pathname;
    if (path === "/register/user/step2") return 2;
    if (path === "/register/user/step3") return 3;
    if (path === "/register/user/step4") return 4;
    if (path === "/register/user/theme") return 5;
    return 1;
  };

  const currentStep = getCurrentStepFromPath();

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const updateErrors = (newErrors) => {
    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  const goToStep = (step) => {
    const stepPath = steps.find(s => s.number === step)?.path;
    if (stepPath) {
      navigate(stepPath);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      if (!validateStep(currentStep)) {
        return;  
      }
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
      if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.birthdate) newErrors.birthdate = "Date of birth is required";
    }
    if (step === 2) {
      if (!formData.mobile) newErrors.mobile = "Mobile number required";
      if (!formData.email) newErrors.email = "Email address required";
      if (!formData.otpVerified) newErrors.otp = "Please verify your email";
    }
    if (step === 3) {
      if (!formData.username.trim()) newErrors.username = "Username required";
      if (!formData.password) newErrors.password = "Password required";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }
    if (step === 4) {
      if (!formData.journalFrequency) newErrors.journalFrequency = "Please select a frequency";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = async (theme, emoji) => { 
    setLoading(true);
    const finalUser = {
      ...formData,
      colorTheme: theme,
      emojiTheme: emoji,
      otp: true
    };
    try {
      await storage.addUser(finalUser);
      await storage.authenticate(finalUser.username, finalUser.password);
      toast.success("Account created successfully. Welcome!");
      navigate("/dashboard");
    } catch (e) {
      toast.error(e.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 relative flex flex-col items-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/20 blur-[100px] rounded-full" />

      <div className="max-w-4xl w-full relative z-10 flex flex-col md:flex-row gap-12 mt-12 mb-20">
         {/* Left Side: Progress & Info */}
         <div className="md:w-1/3 space-y-12">
            <Link 
              to="/register-choice" 
              className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel Registration
            </Link>

            <div>
               <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-6">
                  <Star className="w-3 h-3 text-indigo-500 fill-indigo-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Step {currentStep} of 5</span>
               </div>
               <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-none">
                  {steps[currentStep-1].title}
               </h1>
               <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Provide your details to set up your MoodMirror account.
               </p>
            </div>

            <div className="space-y-4">
               {steps.map(s => {
                  const active = s.number === currentStep;
                  const done = s.number < currentStep;
                  return (
                    <div key={s.number} className="flex items-center space-x-4 group">
                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                          active ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/20' : 
                          done ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                       }`}>
                          {done ? <Check className="w-4 h-4" /> : <span className="text-[10px] font-black">{s.number}</span>}
                       </div>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{s.title}</span>
                    </div>
                  )
               })}
            </div>
         </div>

         {/* Right Side: Form Card */}
         <div className="md:w-2/3">
            <div className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 min-h-[500px] flex flex-col relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                  <Compass className="w-64 h-64" />
               </div>

               <div className="relative z-10 flex-1">
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <Step1Personal
                          formData={formData}
                          errors={errors}
                          updateFormData={updateFormData}
                          updateErrors={updateErrors}
                          validateStep={validateStep}
                          nextStep={nextStep}
                        />
                      } 
                    />
                    <Route 
                      path="/step2" 
                      element={
                        <Step2Contact
                          formData={formData}
                          errors={errors}
                          updateFormData={updateFormData}
                          updateErrors={updateErrors}
                          validateStep={validateStep}
                          nextStep={nextStep}
                          prevStep={prevStep}
                        />
                      } 
                    />
                    <Route 
                      path="/step3" 
                      element={
                        <Step3Account
                          formData={formData}
                          errors={errors}
                          updateFormData={updateFormData}
                          updateErrors={updateErrors}
                          validateStep={validateStep}
                          nextStep={nextStep}
                          prevStep={prevStep}
                        />
                      } 
                    />
                    <Route 
                      path="/step4" 
                      element={
                        <Step4Question
                          formData={formData}
                          errors={errors}
                          updateFormData={updateFormData}
                          updateErrors={updateErrors}
                          validateStep={validateStep}
                          handleSubmit={nextStep}
                          prevStep={prevStep}
                          loading={loading}
                          isLastStep={false}
                        />
                      }
                    />
                    <Route
                      path="theme"
                      element={
                      <OnboardingPalette
                        onComplete={handleFinalSubmit}
                        isInsideRegister={true}
                        prevStep={prevStep}
                      />
                      }
                    />
                  </Routes>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RegisterWrapper;