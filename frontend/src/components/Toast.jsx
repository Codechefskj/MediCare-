import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const styles =
    type === 'error'
      ? 'bg-rose-600'
      : type === 'info'
      ? 'bg-slate-800'
      : 'bg-emerald-600';

  return (
    <div className="fixed top-5 right-5 z-[100] animate-[fadeIn_.2s_ease-out]">
      <div className={`${styles} text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 max-w-sm`}>
        <span>{type === 'error' ? '⚠️' : type === 'info' ? 'ℹ️' : '✅'}</span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
      </div>
    </div>
  );
}
