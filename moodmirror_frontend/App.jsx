import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { Toast } from "./components/common/Toast.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";


// Pages
import About from "./pages/About.jsx";
import Activity from "./pages/Activity.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminRegister from "./pages/AdminRegister.jsx";
import Calendar from "./pages/Calendar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Feedback from "./pages/Feedback.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import OnboardingPalette from "./pages/OnboardingPalette.jsx";
import RegisterChoice from "./pages/RegisterChoice.jsx";
import RegisterWrapper from "./pages/UserRegister/RegisterWrapper.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Journal from "./pages/Journal.jsx";

const AppContent = () => {
  const [themeClass, setThemeClass] = useState('');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) {
      try {
        const themeId = JSON.parse(savedTheme).id;
        setThemeClass(`theme-${themeId}`);
      } catch (e) {
        console.error("Theme parse error", e);
      }
    }
  }, []);

  return (
    <div className={`min-h-screen ${themeClass}`}>
      <Toast />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/register-choice" element={<RegisterChoice />} />
        <Route path="/register/admin" element={<AdminRegister />} />
        <Route path="/register/user/*" element={<RegisterWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding" element={
          <ProtectedRoute requiredRole="user">
            <OnboardingPalette />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="user">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/activity" element={
          <ProtectedRoute requiredRole="user">
            <Activity />
          </ProtectedRoute>
        } />
        <Route path="/feedback" element={
          <ProtectedRoute requiredRole="user">
            <Feedback />
          </ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute requiredRole="user">
            <Calendar />
          </ProtectedRoute>
        } />
        <Route path="/journal" element={
          <ProtectedRoute requiredRole="user">
            <Journal />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;

