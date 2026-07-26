import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiveClock from './LiveClock';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: 'Signal', num: '01' },
    { href: '#projects', label: 'Work', num: '02' },
    { href: '#stack', label: 'System', num: '03' },
    { href: '#about', label: 'About', num: '04' },
    { href: '#contact', label: 'Contact', num: '05' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen 
            ? 'bg-[#030712]/85 backdrop-blur-xl border-b border-[#1e2d4a]/80 py-3 shadow-2xl shadow-black/50' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo & Brand Indicator */}
          <a href="#hero" className="flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
            <img src="/logo.png" alt="Priyanshu Logo" className="h-10 md:h-12 object-contain transition-transform group-hover:scale-105" />
            <div className="hidden sm:flex flex-col">
              <span className="font-sora font-extrabold text-[#f0f6ff] text-sm tracking-tight group-hover:text-[#38bdf8] transition-colors">
                Priyanshu
              </span>
              <span className="font-mono text-[10px] text-[#8fa3c0] uppercase tracking-widest">
                [ Full-Stack Practice ]
              </span>
            </div>
          </a>

          {/* Center: Specia1ne Live Clock Component */}
          <div className="hidden lg:block">
            <LiveClock location="India" />
          </div>

          {/* Right: Desktop Navigation Signals */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs text-[#8fa3c0] hover:text-[#38bdf8] transition-colors flex items-center gap-1.5 uppercase tracking-wider py-1 group"
              >
                <span className="text-[#38bdf8]/60 group-hover:text-[#38bdf8] transition-colors font-semibold">
                  {link.num}
                </span>
                <span className="text-[#8fa3c0]/40">/</span>
                <span>{link.label}</span>
              </a>
            ))}
            
            <a href="#contact">
              <Button variant="accent" size="sm" isBracketed>
                Let's Talk
              </Button>
            </a>
          </div>

          {/* Mobile Menu Trigger Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="font-mono text-xs text-[#f0f6ff] bg-[#0a0f1e] border border-[#1e2d4a] px-3 py-2 rounded-md flex items-center gap-2 hover:border-[#38bdf8] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <>
                  <X className="w-4 h-4 text-[#38bdf8]" />
                  <span>[ CLOSE ]</span>
                </>
              ) : (
                <>
                  <Menu className="w-4 h-4 text-[#38bdf8]" />
                  <span>[ MENU ]</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Specia1ne Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-[#030712]/98 backdrop-blur-2xl border-b border-[#1e2d4a] p-6 shadow-2xl"
          >
            <div className="flex flex-col gap-5">
              <div className="pb-3 border-b border-[#1e2d4a]/60">
                <LiveClock location="India" />
              </div>
              <nav className="flex flex-col gap-4 pt-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-mono text-sm text-[#8fa3c0] hover:text-[#38bdf8] transition-colors flex items-center justify-between py-2 border-b border-[#1e2d4a]/30 uppercase tracking-widest"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[#38bdf8] font-bold">{link.num}</span>
                      <span className="text-[#f0f6ff]">{link.label}</span>
                    </span>
                    <span className="text-[#38bdf8] font-bold">→</span>
                  </a>
                ))}
              </nav>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4"
              >
                <Button variant="accent" size="lg" className="w-full" isBracketed>
                  Let's Talk
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
