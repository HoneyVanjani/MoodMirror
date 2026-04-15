import { useState, useEffect } from 'react';

let showToastGlobal = null;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now().toString();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    showToastGlobal = showToast;
    return () => {
      showToastGlobal = null;
    };
  }, []);

  return { toasts, showToast };
};

// Global toast function
export const toast = {
  success: (message) => showToastGlobal?.(message, 'success'),
  error: (message) => showToastGlobal?.(message, 'error'),
  info: (message) => showToastGlobal?.(message, 'info')
};

export const Toast = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-6 right-6 z-[9999] space-y-4 max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-6 py-4 rounded-3xl shadow-2xl backdrop-blur-2xl border text-sm font-black uppercase tracking-widest animate-in slide-in-from-right-10 duration-500 flex items-center gap-3 ${
            toast.type === 'success' 
              ? 'bg-emerald-500/90 text-white border-emerald-400/50' 
              : toast.type === 'error' 
                ? 'bg-rose-500/90 text-white border-rose-400/50' 
                : 'bg-indigo-600/90 text-white border-indigo-400/50'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          {toast.message}
        </div>
      ))}
    </div>
  );
};