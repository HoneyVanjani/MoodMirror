import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { storage } from "../utils/storage.js";
import { toast } from "../components/common/Toast.jsx";
import axiosClient from "../services/axiosClient";
import DashboardHeader from "../components/common/DashboardHeader.jsx";
import { Bot as LucideBot, User as LucideUser, Send as LucideSend, Sparkles as LucideSparkles } from "lucide-react";

const Feedback = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", text: "Hey there! I'm Mirrorly, your feedback companion. How are you feeling about MoodMirror so far?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(1);
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    description: "",
    user_id: storage.getAuth()?.id
  });

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addMessage = (text, type = "user") => {
    setMessages(prev => [...prev, { id: Date.now(), type, text }]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    addMessage(userText, "user");
    setInputText("");
    setIsTyping(true);

    setTimeout(async () => {
      setIsTyping(false);
      if (step === 1) {
        setFeedbackData(prev => ({ ...prev, description: userText }));
        addMessage("That's great insight! On a scale of 1 to 5, how would you rate your overall experience? (Type a number 1-5)", "bot");
        setStep(2);
      } else if (step === 2) {
        const rating = parseInt(userText);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          addMessage("Could you please give me a number between 1 and 5?", "bot");
        } else {
          setFeedbackData(prev => ({ ...prev, rating }));
          addMessage(`A ${rating}! Noted. Anything else you'd like to share, or should I archive this session?`, "bot");
          setStep(3);
        }
      } else if (step === 3) {
        if (userText.toLowerCase().includes("no") || userText.toLowerCase().includes("archive") || userText.toLowerCase().includes("done")) {
          submitFeedback();
        } else {
          setFeedbackData(prev => ({ ...prev, description: prev.description + " | Additional: " + userText }));
          submitFeedback();
        }
      }
    }, 1500);
  };

  const submitFeedback = async () => {
    setIsTyping(true);
    try {
      await axiosClient.post("/feedback", feedbackData);
      setIsTyping(false);
      addMessage("Perfect! I've securely archived your thoughts. Thank you for helping us grow! ✨", "bot");
      toast.success("Feedback received!");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    } catch (err) {
      setIsTyping(false);
      addMessage("Oh no, I had a little hiccup saving that. Don't worry, I'll try again later!", "bot");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans overflow-hidden">
      <DashboardHeader />
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <main className="flex-1 flex flex-col pt-24 overflow-hidden relative">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-10 no-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`p-6 rounded-[32px] max-w-[85%] text-lg font-medium shadow-sm transition-all ${
                  m.type === 'bot' 
                  ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-800' 
                  : 'bg-indigo-600 text-white rounded-br-none shadow-xl'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-[24px] rounded-bl-none flex space-x-1.5 shadow-sm">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                </div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-10">
          <div className="max-w-4xl mx-auto flex space-x-4">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your feedback..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 p-6 rounded-[28px] outline-none text-lg font-medium dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition-all border-none"
            />
            <button 
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              className="px-10 bg-indigo-600 text-white rounded-[28px] font-black uppercase tracking-widest text-xs transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 shadow-xl shadow-indigo-500/20"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;