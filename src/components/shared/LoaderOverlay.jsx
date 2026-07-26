import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoaderOverlay() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[var(--bg-main)] text-[var(--text-main)] px-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 font-mono-custom text-xs uppercase tracking-widest text-[var(--text-muted)]">
            <span>Loading experience</span>
            <div className="flex items-center gap-1.5 text-[var(--text-main)] font-bold text-sm">
              <span>[</span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ·
              </motion.span>
              <span>]</span>
            </div>
            <span>it won't be long</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
