import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CursorFollower() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Detect interactive hover elements with data-cursor attribute or buttons/links
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setCursorText(target.getAttribute('data-cursor') || '[ EXPLORE ]');
      } else {
        setCursorText('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const width = cursorText ? 110 : 28;
  const height = cursorText ? 42 : 28;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 hidden md:flex items-center justify-center rounded-full"
      animate={{
        x: pos.x - width / 2,
        y: pos.y - height / 2,
        width: width,
        height: height,
        borderRadius: cursorText ? '24px' : '9999px',
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 400,
        mass: 0.1,
      }}
      style={{
        background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.08) 65%, rgba(255, 255, 255, 0.2) 100%)',
        backdropFilter: 'blur(10px) contrast(1.25) brightness(1.2)',
        WebkitBackdropFilter: 'blur(10px) contrast(1.25) brightness(1.2)',
        border: '1.5px solid rgba(255, 255, 255, 0.85)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 12px rgba(255, 255, 255, 0.55)',
      }}
    >
      {cursorText && (
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="font-mono-custom text-[10px] font-extrabold tracking-widest uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] px-3 text-center whitespace-nowrap"
        >
          {cursorText}
        </motion.span>
      )}
    </motion.div>
  );
}
