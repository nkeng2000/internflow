import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Toast { id: number; message: string; }

// Listens for 'supabase-error' window events and shows them on screen,
// so connection / schema problems are visible (not just in the console).
const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, message: detail }]);
      // auto-dismiss after 8s
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 8000);
    };
    window.addEventListener('supabase-error', handler);
    return () => window.removeEventListener('supabase-error', handler);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] sm:w-96">
      {toasts.map(t => (
        <div key={t.id} className="flex items-start gap-3 bg-red-600 text-white rounded-xl shadow-lg p-4 animate-[fadeIn_.2s_ease]">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-semibold">Supabase error</p>
            <p className="text-red-100 break-words">{t.message}</p>
          </div>
          <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="text-red-200 hover:text-white">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
