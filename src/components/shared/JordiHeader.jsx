import { useState, useEffect } from 'react';

export default function JordiHeader() {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between text-xs font-mono-custom uppercase tracking-wider pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
      
      {/* Top Left Identity */}
      <div className="pointer-events-auto bg-[var(--bg-main)]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-subtle)] shadow-xl">
        <a href="#hero" className="font-extrabold text-[var(--text-main)] hover:opacity-70 transition-opacity">
          Priyanshu Ghosh
        </a>
      </div>

      {/* Top Right Location & Time */}
      <div className="pointer-events-auto flex items-center gap-2 text-[var(--text-muted)] bg-[var(--bg-main)]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-subtle)] shadow-xl">
        <span>GIRIDIH, IN</span>
        <span>—</span>
        <span className="text-[var(--text-main)] font-bold">{timeStr || '10:10'} IST</span>
      </div>

    </header>
  );
}
