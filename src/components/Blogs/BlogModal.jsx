import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, BookOpen, Calendar } from 'lucide-react';

export default function BlogModal({ blog, onClose }) {
  const [imageError, setImageError] = useState(false);

  if (!blog) return null;

  const displayImage = blog.image || blog.coverImage;
  const externalUrl = blog.link || blog.url;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Content - Jordi Garreta Theme */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-3xl overflow-y-auto z-10 flex flex-col shadow-2xl"
      >
        <div className="p-6 md:p-10 space-y-6">
          
          {/* Header Bar */}
          <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-6 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent-glow)]" />
                <span>[{blog.date || '2026'}]</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-sora font-extrabold text-[var(--text-main)] leading-tight">
                {blog.title}
              </h2>
            </div>
            
            <button 
              onClick={onClose}
              data-cursor="[ CLOSE ]"
              className="p-3 rounded-full bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-main)] transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cover Image */}
          {displayImage && !imageError && (
            <div className="w-full aspect-video rounded-2xl border border-[var(--border-subtle)] overflow-hidden bg-[var(--card-bg)] relative shadow-xl">
              <img 
                src={displayImage} 
                alt={blog.title} 
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          )}

          {/* Full Content Body */}
          <div className="font-mono-custom text-xs sm:text-sm text-[var(--text-main)] leading-relaxed whitespace-pre-wrap space-y-4 pt-2">
            {blog.content || blog.excerpt || blog.description}
          </div>

          {/* External Article Link Button */}
          {externalUrl && (
            <div className="pt-6 border-t border-[var(--border-subtle)] font-mono-custom text-xs uppercase tracking-wider">
              <a 
                href={externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                data-cursor="[ READ EXTERNAL ]"
                className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Read Full External Post ↗</span>
              </a>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
