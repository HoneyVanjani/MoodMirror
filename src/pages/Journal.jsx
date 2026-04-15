import { useState, useEffect, useRef } from "react";
import { Plus, Calendar, Edit, Trash2, ArrowLeft, Mic, MicOff, BookOpen, Clock, Heart } from "lucide-react";
import { toast } from "../components/common/Toast.jsx";
import axiosClient from "../services/axiosClient";
import { Link } from "react-router-dom";
import AudioVisualizer from "../components/journal/AudioVisualizer.jsx";
import DashboardHeader from "../components/common/DashboardHeader.jsx";

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "neutral"
  });
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetchEntries();
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setFormData(prev => ({ 
            ...prev, 
            content: (prev.content + " " + finalTranscript).trim() 
          }));
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      toast.info("Microphone deactivated.");
    } else {
      if (!recognitionRef.current) {
        toast.error("Speech recognition is not supported in this browser.");
        return;
      }
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success("Listening active. Speak now.");
      } catch (e) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await axiosClient.get('/journals');
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure microphone is stopped on submit
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      }

      await axiosClient.post('/journals', formData);
      
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`journaled_${today}`, 'true');

      toast.success("Entry archived successfully.");
      setFormData({ title: "", content: "", mood: "neutral" });
      setShowForm(false);
      fetchEntries();
    } catch (error) {
      toast.error("Archive failure.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axiosClient.delete(`/journals/${id}`);
      toast.success("Entry removed.");
      fetchEntries();
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  const moodOptions = [
    { value: "happy", label: "Happy", emoji: "😊" },
    { value: "sad", label: "Sad", emoji: "😢" },
    { value: "angry", label: "Angry", emoji: "😠" },
    { value: "neutral", label: "Neutral", emoji: "😐" },
    { value: "anxious", label: "Anxious", emoji: "😰" }
  ];

  const highlightContent = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    const positiveWords = ["happy", "great", "good", "amazing", "love", "joy", "peaceful", "better"];
    const negativeWords = ["sad", "terrible", "bad", "awful", "angry", "hate", "pain", "worse"];

    return words.map((word, i) => {
      const cleanWord = word.toLowerCase().replace(/[.,!]/g, "");
      if (positiveWords.includes(cleanWord)) {
        return <span key={i} className="text-emerald-500 font-black">{word} </span>;
      }
      if (negativeWords.includes(cleanWord)) {
        return <span key={i} className="text-rose-500 font-black">{word} </span>;
      }
      return word + " ";
    });
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <DashboardHeader />

      <main className="container mx-auto px-6 pt-32 pb-40 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                    <BookOpen className="w-3 h-3 text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Narrative Archive</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-slate-900 dark:text-white">
                    Private <span className="text-indigo-600">Journal</span>.
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-xl">
                    A secure space for your private reflections and emotional data.
                </p>
            </div>

            <button
                onClick={() => setShowForm(!showForm)}
                className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all flex items-center group"
            >
                <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
                {showForm ? 'Close Editor' : 'Create Entry'}
            </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-slate-900 rounded-[48px] p-12 mb-12 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Edit className="w-48 h-48 text-indigo-600" />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Entry Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-bold text-lg"
                    placeholder="Title your moment..."
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Primary Sentiment</label>
                  <div className="flex flex-wrap gap-2">
                    {moodOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, mood: option.value })}
                        className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                          formData.mood === option.value
                            ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                            : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {option.emoji} {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Content Stream</label>
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      isListening 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                        : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{isListening ? 'Stop Mic' : 'Voice Connect'}</span>
                  </button>
                </div>
                
                <div className="relative group">
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-10 rounded-[40px] bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all resize-none min-h-[300px] text-xl font-medium leading-relaxed"
                    placeholder="Describe your inner state..."
                    required
                  />
                  {isListening && (
                    <div className="absolute top-6 right-10">
                        <div className="flex items-center space-x-2 bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Mic Active</span>
                        </div>
                    </div>
                  )}
                </div>

                <div className="p-8 rounded-[32px] bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4 ml-1">Live Emotion Analysis</p>
                    <div className="text-lg leading-relaxed">{highlightContent(formData.content) || <span className="opacity-30">Analysis will appear as you type...</span>}</div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 hover:scale-105 disabled:opacity-50 transition-all"
                >
                  {loading ? "Archiving..." : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-8">
          {entries.length === 0 ? (
            <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[64px] border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col items-center">
                <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-8">
                    <Edit className="w-10 h-10 text-indigo-300" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">No entries detected</h3>
                <p className="text-slate-500 font-medium max-w-sm mb-12 text-lg">Your emotional history is waiting to be written.</p>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20"
                >
                    Create First Entry
                </button>
            </div>
          ) : (
            entries.map((entry) => (
              <div 
                key={entry.id} 
                className="group relative bg-white dark:bg-slate-900 rounded-[48px] p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-50 dark:border-slate-800 hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-[32px] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                      {moodOptions.find(m => m.value === entry.mood)?.emoji || '🍃'}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase italic mb-2">
                        {entry.title}
                      </h3>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <Calendar className="w-3 h-3 mr-2" />
                            {formatDate(entry.created_at)}
                        </div>
                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-500">
                            <Heart className="w-3 h-3 mr-2" />
                            {entry.mood}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="relative pl-2">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xl font-medium whitespace-pre-wrap">
                    {highlightContent(entry.content)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Floating Decor */}
      <div className="fixed top-[20%] right-[-5%] w-96 h-96 bg-indigo-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[10%] left-[-5%] w-96 h-96 bg-purple-200/20 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default Journal;

