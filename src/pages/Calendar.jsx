import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, ChevronLeft, ChevronRight, Plus, Calendar as CalIcon } from "lucide-react";
import { toast } from "../components/common/Toast.jsx";
import { storage } from "../utils/storage.js";
import DashboardHeader from "../components/common/DashboardHeader.jsx";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newMood, setNewMood] = useState("");
  const [moods, setMoods] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);

  const auth = storage.getAuth();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  useEffect(() => {
    if (!auth?.id) return;
    storage.getMoods(auth.id)
      .then(setMoods)
      .catch(err => {
        console.error("Fetch moods error:", err);
      });
  }, [auth?.id]);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const navigateMonth = (dir) => setCurrentDate(prev => {
    const newDate = new Date(prev);
    newDate.setMonth(prev.getMonth() + dir);
    return newDate;
  });

  const handleDateClick = (day) => {
    const today = new Date();
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (clickedDate > today) {
      toast.error("You cannot log moods for future dates!");
      return;
    }

    setSelectedDate(day);
    setShowModal(true);
  };

  const getMoodConfig = (mood) => {
    const configs = {
      excellent: { color: 'bg-indigo-500', glow: 'shadow-indigo-500/50', emoji: '🌟' },
      good: { color: 'bg-emerald-400', glow: 'shadow-emerald-400/50', emoji: '😄' },
      okay: { color: 'bg-yellow-400', glow: 'shadow-yellow-400/50', emoji: '🙂' },
      bad: { color: 'bg-orange-500', glow: 'shadow-orange-500/50', emoji: '😟' },
      terrible: { color: 'bg-rose-500', glow: 'shadow-rose-500/50', emoji: '😞' },
    };
    return configs[mood] || { color: 'bg-slate-200', glow: '', emoji: '' };
  };

  const handleAddMood = async () => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(selectedDate).padStart(2,'0')}`;
    const dayEntries = moods.filter(m => m.date?.startsWith(dateStr));

    if (dayEntries.length >= 5) {
      toast.error("Limit reached: 5 logs per day.");
      return;
    }

    try {
      const res = await storage.addMood({
        mood: newMood,
        date: dateStr,
        user_id: auth.id
      });
      setMoods(prev => [...prev, res.data || res]); 
      setShowModal(false);
      toast.success("Mood logged successfully!");
    } catch (err) {
      toast.error("Failed to sync mood.");
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-24 opacity-0"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const dayEntries = moods.filter(m => m.date?.startsWith(dateStr));
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          onMouseEnter={() => setHoveredDay(day)}
          onMouseLeave={() => setHoveredDay(null)}
          className={`relative h-24 rounded-3xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center group ${
            isToday ? 'border-2 border-indigo-500 bg-indigo-50/30' : 'border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
          } hover:scale-105 hover:z-10 shadow-sm hover:shadow-xl`}
        >
          <span className={`absolute top-2 left-3 text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
            {day}
          </span>
          
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-2 mt-2">
            {dayEntries.length > 0 ? dayEntries.slice(0, 4).map((m, idx) => {
               const config = getMoodConfig(m.mood);
               return (
                <div 
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full ${config.color} ${config.glow} shadow-lg`} 
                    title={m.mood}
                />
               )
            }) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800" />
            )}
            {dayEntries.length > 4 && <span className="text-[8px] font-black text-slate-400">+{dayEntries.length - 4}</span>}
          </div>

          {hoveredDay === day && dayEntries.length > 0 && (
             <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap z-[60] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                {dayEntries.length} Records Detected
             </div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <DashboardHeader />

      <main className="container mx-auto px-6 pt-32 pb-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                    <CalIcon className="w-3 h-3 text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Time-Series History</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-slate-900 dark:text-white">
                    Mood <span className="text-indigo-600">Calendar</span>.
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-xl">
                    Visualizing your emotional trajectory through time.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between min-w-[320px]">
                <button onClick={() => navigateMonth(-1)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-black tracking-tighter uppercase italic text-indigo-600 leading-none">
                        {monthNames[currentDate.getMonth()]}
                    </h2>
                    <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">{currentDate.getFullYear()}</span>
                </div>
                <button onClick={() => navigateMonth(1)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 shadow-2xl p-10 rounded-[48px] mb-10 border border-slate-100 dark:border-slate-800 relative overflow-hidden backdrop-blur-xl">
          <div className="grid grid-cols-7 gap-4 mb-6">
            {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(day => (
              <div key={day} className="h-10 flex items-center justify-center text-[10px] font-black tracking-widest text-slate-300 dark:text-slate-600 uppercase">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-4">{renderCalendarDays()}</div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['terrible', 'bad', 'okay', 'good', 'excellent'].map(mood => {
                const config = getMoodConfig(mood);
                return (
                    <div key={mood} className="bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-slate-100 dark:border-slate-800 flex items-center space-x-4 shadow-sm hover:shadow-md transition-all">
                        <div className={`w-8 h-8 rounded-full ${config.color} ${config.glow} shadow-lg`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{mood}</span>
                    </div>
                )
            })}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[150] animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] p-12 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-3xl font-black mb-10 text-center uppercase tracking-tighter italic text-slate-900 dark:text-white">
                Log for {monthNames[currentDate.getMonth()]} {selectedDate}
            </h3>
            <div className="grid grid-cols-1 gap-3 mb-10">
              {['terrible','bad','okay','good','excellent'].map(mood => {
                 const config = getMoodConfig(mood);
                 return (
                  <button
                      key={mood}
                      onClick={() => setNewMood(mood)}
                      className={`group relative w-full flex items-center justify-between p-6 rounded-3xl transition-all border-2 ${
                      newMood === mood 
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-500/20 scale-[1.02]' 
                        : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 text-slate-900 dark:text-white'
                      }`}
                  >
                      <div className="flex items-center space-x-5 font-black uppercase tracking-widest text-[10px]">
                          <span className="text-3xl">{config.emoji}</span>
                          <span>{mood}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${config.color} ${newMood === mood ? 'ring-4 ring-white/20' : ''}`} />
                  </button>
                 )
              })}
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 px-8 py-5 text-[10px] text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[20px] transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMood} 
                disabled={!newMood} 
                className="flex-1 px-8 py-5 bg-indigo-600 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 disabled:opacity-50 transition-all"
              >
                Log Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Decor */}
      <div className="fixed top-[20%] right-[-5%] w-96 h-96 bg-indigo-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[10%] left-[-5%] w-96 h-96 bg-purple-200/20 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default Calendar;

