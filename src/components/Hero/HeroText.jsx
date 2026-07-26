import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGitHubData } from '../../hooks/useGitHubData';

export default function HeroText() {
  const { data: about } = useGitHubData('about.json');
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(currentTheme);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isCream = theme === 'cream';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="z-20 relative min-h-screen flex flex-col justify-center max-w-6xl mx-auto px-6 pt-32 pb-20 pointer-events-auto">
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        
        {/* Editorial Sub-Label Badge */}
        <motion.div 
          variants={itemVariants} 
          className={`inline-flex items-center gap-3 font-mono-custom text-xs uppercase tracking-widest px-4 py-2 rounded-full border shadow-xl transition-all duration-400 ${
            isCream 
              ? 'bg-[#e8e6dc]/80 text-[#6e6d68] border-[#d5d3c5] backdrop-blur-md'
              : 'bg-[var(--bg-main)]/80 text-[var(--text-muted)] border-[var(--border-subtle)] backdrop-blur-md'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className={`font-bold ${isCream ? 'text-[#141413]' : 'text-[var(--text-main)]'}`}>
            [ CREATIVE TECHNOLOGIST & FULL-STACK DEVELOPER ]
          </span>
        </motion.div>

        {/* Main Large Editorial Title */}
        {isCream ? (
          <motion.div 
            variants={itemVariants}
            className="bg-[#e8e6dc]/55 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-[#d5d3c5] shadow-2xl transition-all duration-400"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-sora font-extrabold text-[#141413] leading-[1.08] tracking-tight">
              Building high-craft web systems, digital interfaces & resilient software.
            </h1>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-sora font-extrabold text-[var(--text-main)] leading-[1.05] tracking-tight drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)] [text-shadow:0_4px_24px_rgba(0,0,0,0.95)]">
              Building high-craft web systems, digital interfaces & resilient software.
            </h1>
          </motion.div>
        )}

        {/* Statement & Action Bar */}
        {isCream ? (
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end p-6 sm:p-8 rounded-3xl border border-[#d5d3c5] bg-[#e8e6dc]/60 backdrop-blur-md shadow-2xl transition-all duration-400"
          >
            <p className="md:col-span-8 font-mono-custom text-xs sm:text-sm text-[#141413] leading-relaxed max-w-2xl font-medium">
              Based in Giridih, working worldwide. I shape product logic, Java & Spring architectures, and responsive React interfaces from initial idea to working form.
            </p>

            <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-4 font-mono-custom text-xs uppercase tracking-wider">
              <a
                href="#projects"
                data-cursor="[ EXPLORE WORK ]"
                className="bg-[#141413] text-[#f5f4ef] font-bold px-7 py-3.5 rounded-full hover:bg-black transition-all shadow-xl inline-flex items-center gap-2 group hover:scale-105"
              >
                <span>Explore Work</span>
                <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-t border-[var(--border-subtle)]/80 pt-8 bg-[var(--bg-main)]/70 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] shadow-2xl"
          >
            <p className="md:col-span-8 font-mono-custom text-xs sm:text-sm text-[var(--text-main)] leading-relaxed max-w-2xl font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Based in Giridih, working worldwide. I shape product logic, Java & Spring architectures, and responsive React interfaces from initial idea to working form.
            </p>

            <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-4 font-mono-custom text-xs uppercase tracking-wider">
              <a
                href="#projects"
                data-cursor="[ EXPLORE WORK ]"
                className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold px-7 py-3.5 rounded-full hover:opacity-90 transition-all shadow-xl inline-flex items-center gap-2 group hover:scale-105"
              >
                <span>Explore Work</span>
                <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </a>
            </div>
          </motion.div>
        )}

      </motion.div>

    </div>
  );
}
