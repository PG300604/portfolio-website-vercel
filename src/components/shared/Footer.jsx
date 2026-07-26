import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-main)] border-t border-[var(--border-subtle)] py-16 relative z-10 font-mono-custom text-xs uppercase tracking-wider text-[var(--text-muted)]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left Identity & Copyright */}
        <div className="flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="Priyanshu Logo" 
            className="h-8 object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="text-[var(--text-main)] font-extrabold">
            Priyanshu Ghosh © {new Date().getFullYear()}
          </span>
        </div>
        
        {/* Center Craft Tagline */}
        <div className="flex items-center gap-2 bg-[var(--card-bg)] px-4 py-2 rounded-full border border-[var(--border-subtle)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[var(--text-muted)]">DIGITAL PRACTICE • INTERACTION & WEB SYSTEMS</span>
        </div>
        
        {/* Right Links */}
        <div className="flex items-center gap-6 font-mono-custom">
          <a 
            href="https://github.com/PG300604" 
            target="_blank" 
            rel="noopener noreferrer" 
            data-cursor="[ GITHUB ]"
            className="hover:text-[var(--text-main)] transition-colors"
          >
            [ GITHUB ↗ ]
          </a>
          <a 
            href="https://linkedin.com/in/priyanshu-ghosh-" 
            target="_blank" 
            rel="noopener noreferrer" 
            data-cursor="[ LINKEDIN ]"
            className="hover:text-[var(--text-main)] transition-colors"
          >
            [ LINKEDIN ↗ ]
          </a>
          <Link 
            to="/admin" 
            data-cursor="[ ADMIN PORTAL ]"
            className="hover:text-[var(--text-main)] transition-colors"
          >
            [ ADMIN ↗ ]
          </Link>
        </div>

      </div>
    </footer>
  );
}
