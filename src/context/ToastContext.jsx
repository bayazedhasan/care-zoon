'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((toast) => {
          let bgClass = 'bg-slate-900 text-white border-slate-700';
          let Icon = Info;
          let iconColor = 'text-sky-400';

          if (toast.type === 'success') {
            bgClass = 'bg-emerald-950/90 text-emerald-100 border-emerald-700/60 shadow-emerald-950/30';
            Icon = CheckCircle2;
            iconColor = 'text-emerald-400';
          } else if (toast.type === 'error') {
            bgClass = 'bg-rose-950/90 text-rose-100 border-rose-700/60 shadow-rose-950/30';
            Icon = AlertCircle;
            iconColor = 'text-rose-400';
          } else if (toast.type === 'info') {
            bgClass = 'bg-sky-950/90 text-sky-100 border-sky-700/60 shadow-sky-950/30';
            Icon = Info;
            iconColor = 'text-sky-400';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-slide-down ${bgClass}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
                <p className="text-sm font-medium leading-snug">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
