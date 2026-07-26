import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BottomDock({ activeSection, viewMode, setViewMode, theme, toggleTheme }) {
  const [copied, setCopied] = useState(false);
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Show top dock bar when scrolling past 120px (after Hero top header)
      if (window.scrollY > 120) {
        setShowNav(true);
      } else {
        setShowNav(true); // Always accessible or smooth reveal after Hero
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'projects', label: 'Work' },
    { id: 'about', label: 'About' },
    { id: 'stack', label: 'Stack' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('priyanshughosh97@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -20 }}
      transition={{ duration: 0.3 }}
      className="fixed top-6 left-0 right-0 z-[60] px-4 flex justify-center items-center pointer-events-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
    >
      <div className="pointer-events-auto bg-[var(--bg-main)]/95 backdrop-blur-2xl border border-[var(--border-subtle)] p-1.5 rounded-full shadow-2xl flex flex-wrap items-center gap-1 sm:gap-2 font-mono-custom text-xs uppercase tracking-wider text-[var(--text-muted)]">
        
        {/* Navigation Links */}
        <nav className="flex items-center gap-1 bg-[var(--card-bg)] px-2 py-1 rounded-full border border-[var(--border-subtle)]">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-cursor="[ NAVIGATE ]"
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-bold'
                    : 'hover:text-[var(--text-main)]'
                }`}
              >
                <span>[{isActive ? '·' : ' '}]</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* View Mode Toggle (Gallery vs List) */}
        <div className="hidden sm:flex items-center gap-1 bg-[var(--card-bg)] px-2 py-1 rounded-full border border-[var(--border-subtle)]">
          <button
            onClick={() => setViewMode('gallery')}
            data-cursor="[ GALLERY VIEW ]"
            className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
              viewMode === 'gallery'
                ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-bold'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <span>[{viewMode === 'gallery' ? '·' : ' '}]</span>
            <span>Gallery</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            data-cursor="[ LIST VIEW ]"
            className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
              viewMode === 'list'
                ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-bold'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <span>[{viewMode === 'list' ? '·' : ' '}]</span>
            <span>List</span>
          </button>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          data-cursor="[ SWITCH THEME ]"
          className="bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] text-[var(--text-main)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
        >
          <span>[{theme === 'dark' ? 'CREAM' : 'DARK'}]</span>
        </button>

        {/* Quick Email Pill */}
        <button
          onClick={handleCopyEmail}
          data-cursor="[ COPY EMAIL ]"
          className="hidden md:flex bg-[var(--text-main)] text-[var(--bg-main)] font-bold px-3.5 py-1.5 rounded-full hover:opacity-90 transition-opacity items-center gap-1"
        >
          <span>{copied ? '[ COPIED ]' : '[ EMAIL ]'}</span>
        </button>

      </div>
    </motion.div>
  );
}
