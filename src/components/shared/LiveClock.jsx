import { useState, useEffect } from 'react';

export default function LiveClock({ location = 'India' }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 font-mono text-xs text-[#8fa3c0] bg-[#0a0f1e]/80 border border-[#1e2d4a] px-3.5 py-1.5 rounded-full backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4fcea6] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4fcea6]"></span>
      </span>
      <span>{timeStr || '10:10'}</span>
      <span className="text-[#1e2d4a]">|</span>
      <span className="text-[#f0f6ff]">Based in {location}</span>
    </div>
  );
}
