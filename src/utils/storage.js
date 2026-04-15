import axiosClient from "../services/axiosClient";
import { toast } from "../components/common/Toast.jsx";
//import { useNavigate } from "react-router-dom";
//const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const storage = {
  /** --------------------- Local Helpers --------------------- **/
  getUsers: async () => {
    try {
      const res = await axiosClient.get('/admin/users');
      return res.data;
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  },
  setUsers: (users) => localStorage.setItem("users", JSON.stringify(users)),
  addUserLocal: (user) => {
    // This was crashing because getUsers is async.
    // We already use the backend DB, so we don't need a local array clone here. 
    // Simply do nothing or store a cached version if needed.
  },
  getUserId: () => {
      const auth = storage.getAuth();
      return auth?.id;
  },
  getAuth: () => JSON.parse(localStorage.getItem("auth") || "null"),
  setAuth: (auth) => localStorage.setItem("auth", JSON.stringify(auth)),
  clearAuth: () => {
    delete axiosClient.defaults.headers.common['Authorization'];
    localStorage.removeItem("auth"); 
    localStorage.removeItem("moodStreak");
    localStorage.removeItem("moodAlert");
  },

  isUsernameTaken(username) {
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    return users.some((user) => user.username === username);
  },
  saveNewUser(userData) {
    localStorage.setItem("newUser", JSON.stringify(userData));
  },
  
  setStreakCache(streak) {
    localStorage.setItem("moodStreak", JSON.stringify(streak || null));
  },
  getStreakCache() {
    return JSON.parse(localStorage.getItem("moodStreak") || "null");
  },

  // --- Mood Alert Cache ---
  setAlertCache(alert) {
    localStorage.setItem("moodAlert", JSON.stringify(alert || null));
  },
  getAlertCache() {
    return JSON.parse(localStorage.getItem("moodAlert") || "null");
  },


  /** --------------------- Auth API --------------------- **/

  // ✅ Register new user
  addUser: async (userPayload) => {
    try {
      const res = await axiosClient.post("/register", userPayload);
      const data = res.data;

      if (data.success && data.user) {
        // Optional: store locally for quick access
        storage.addUserLocal(data.user);
        toast.success("Registration successful!");
      }

      return data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Registration failed. Please check your details.";
      toast.error(msg);
      console.error("Register Error:", err.response?.data || err.message);
      throw err;
    }
  },




  // ✅ Login user
  authenticate: async (identifier, password) => {
    try {
      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await axiosClient.post("/login", payload);
      const data = res.data;

      if (data.status !== "success") throw new Error("Login failed");

      const authData = {
        token: data.token,
        id: data.user?._id || data.user?.id,
        username: data.user?.username || data.user?.email,
        role: data.user?.role || "user",
      };

      storage.setAuth(authData);
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    }
  },

  /** --------------------- Moods & Activity --------------------- **/
  getMoods: async (userId) => {
    const res = await axiosClient.get(`/moods/${userId}`);
    return res.data;
  },

  addMood: async (payload) => {
    const res = await axiosClient.post("/moods", payload);
    return res.data;
  },

  

  // addActivity: async (payload) => {
  //   const res = await axiosClient.post("/activity", payload);
  //   return res.data;
  //},

    /** --------------------- Analytics & Motivation --------------------- **/
  getWeeklySummary: async (userId) => {
    try {
      const res = await axiosClient.get(`/moods/summary/${userId}`);
      return res.data;
    } catch (err) {
      console.error("Weekly summary fetch error:", err.response?.data || err.message);
      return null;
    }
  },

  getMoodAlert: async (userId) => {
    try {
      const res = await axiosClient.get(`/moods/alerts/${userId}`);
      return res.data;
    } catch (err) {
      console.error("Mood alert fetch error:", err.response?.data || err.message);
      return null;
    }
  },

  getMoodStreak: async (userId) => {
    try {
      const res = await axiosClient.get(`/moods/streak/${userId}`);
      return res.data;
    } catch (err) {
      console.error("Streak fetch error:", err.response?.data || err.message);
      return null;
    }
  },

  getMotivation: async (mood) => {
    try {
      const res = await axiosClient.get(`/motivation/${mood}`);
      return res.data?.quote;  // Assuming 'quote' is the key you want
    } catch (err) {
      console.error("Motivation fetch error:", err.response?.data || err.message);
      return "Keep going, better days are coming!";  // Return a string directly
    }
  },

 getActivity: async (userId) => {
    try {
        const res = await axiosClient.get(`/activities/${userId}`);
        console.log("API Response:", res.data);

        // FIX: Auto-detect format
        if (Array.isArray(res.data)) {
            return { activities: res.data };
        }

        return res.data;
    } catch (err) {
        console.error("Error fetching activities:", err);
        return { activities: [] };
    }
},

  /** --------------------- Feedback --------------------- **/
  getFeedback: async () => {
    try {
      const res = await axiosClient.get('/feedback');
      return res.data;
    } catch (err) {
      console.error("Error fetching feedback:", err);
      return [];
    }
  },
  //setFeedback: (fb) => localStorage.setItem("feedback", JSON.stringify(fb || [])),
  
  getAnalytics: async () => {
    try {
      const res = await axiosClient.get('/admin/analytics');
      return res.data;
    } catch (err) {
      console.error("Error fetching analytics:", err);
      return { totalUsers: 0, totalFeedback: 0, totalActivities: 0, recentActivities: [] };
    }
  },

};
