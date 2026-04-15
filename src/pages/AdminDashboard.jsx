import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Shield, Users, MessageCircle, BarChart3, Search, LogOut, Activity, ArrowUpRight, TrendingUp } from "lucide-react";
import axiosClient from "../services/axiosClient";
import { storage } from "../utils/storage.js";
import DashboardHeader from "../components/common/DashboardHeader.jsx";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalFeedback: 0, totalActivities: 0, recentActivities: [] });
  const [loading, setLoading] = useState(true);

  const auth = storage.getAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await storage.getUsers();
        const feedbackData = await storage.getFeedback();
        const analyticsData = await storage.getAnalytics();
        setUsers(usersData);
        setFeedback(feedbackData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter(user => 
    user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "feedback", label: "Feedback", icon: MessageCircle },
    { id: "metrics", label: "Metrics", icon: BarChart3 }
  ];

  if (loading) {
    return (
        <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 animate-pulse">Syncing Admin Node...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <DashboardHeader />

      <main className="container mx-auto px-6 pt-32 pb-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                    <Shield className="w-3 h-3 text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Admin Protocol</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-slate-900 dark:text-white">
                    Operations <span className="text-indigo-600">Center</span>.
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-xl">
                    Full spectrum surveillance and management of the MoodMirror ecosystem.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2 rounded-[28px] shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
                                    : "text-slate-400 hover:text-indigo-600"
                            }`}
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Analytics Overview Section */}
        {activeTab === "metrics" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                    { label: 'Network Population', value: analytics.totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Synaptic Feedback', value: analytics.totalFeedback, icon: MessageCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'System Pulse', value: analytics.totalActivities, icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-xl border border-slate-100 dark:border-slate-800 group hover:scale-105 transition-all">
                        <div className={`w-16 h-16 ${stat.bg} dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-all`}>
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</p>
                        <div className="flex items-end space-x-3">
                            <span className="text-6xl font-black tracking-tighter italic">{stat.value}</span>
                            <TrendingUp className="w-6 h-6 text-emerald-500 mb-4" />
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Users Content */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-slate-900 rounded-[56px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">Entity Registry</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Synchronized Users: {users.length}</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search Identity..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800 p-5 pl-14 pr-10 rounded-[28px] outline-none text-sm font-bold w-full md:w-80 border-2 border-transparent focus:border-indigo-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Biological Identifier</th>
                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Digital ID</th>
                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Activation Date</th>
                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr key={user.id || user._id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                      <td className="py-8 px-10">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {user.firstname?.[0]}{user.lastname?.[0]}
                            </div>
                            <span className="text-lg font-black tracking-tight">{user.firstname} {user.lastname}</span>
                        </div>
                      </td>
                      <td className="py-8 px-10 text-slate-500 font-medium">{user.username}</td>
                      <td className="py-8 px-10 text-slate-500 font-medium">{formatDate(user.created_at)}</td>
                      <td className="py-8 px-10">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Active Link</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-400 font-black uppercase tracking-widest">Zero Entities Intercepted</p>
              </div>
            )}
          </div>
        )}

        {/* Feedback Content */}
        {activeTab === "feedback" && (
          <div className="space-y-6">
             <div className="mb-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Synaptic Feedback</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">User Intelligence Stream</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {feedback.length === 0 ? (
                <div className="col-span-full py-20 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-slate-400 font-black uppercase tracking-widest">No Intelligence Data Available</p>
                </div>
              ) : (
                feedback.map((item) => (
                  <div key={item.id || item._id} className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-xl border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-all group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-indigo-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{formatDate(item.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            {[...Array(item.rating || 5)].map((_, i) => (
                                <Heart key={i} className="w-3 h-3 text-rose-500 fill-rose-500" />
                            ))}
                        </div>
                    </div>
                    <p className="text-xl font-medium leading-relaxed mb-8">{item.description}</p>
                    <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Source: {item.userFirstname}</span>
                        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                ))
              )}
             </div>
          </div>
        )}
      </main>

      {/* Floating Decor */}
      <div className="fixed top-[20%] right-[-5%] w-96 h-96 bg-indigo-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[10%] left-[-5%] w-96 h-96 bg-purple-200/20 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default AdminDashboard;
