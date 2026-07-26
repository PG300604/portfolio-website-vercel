import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Code, Sparkles } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  const [imageError, setImageError] = useState(false);

  if (!project) return null;

  const displayImage = project.image || project.imageUrl || "/Homepage.png";

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
        className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-3xl overflow-y-auto z-10 flex flex-col shadow-2xl"
      >
        <div className="p-8 md:p-12 space-y-8">
          
          {/* Header Bar */}
          <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-6">
            <div>
              <div className="flex items-center gap-3 font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                <span>[{project.category || 'SOFTWARE'}]</span>
                <span>•</span>
                <span>[{project.year || '2026'}]</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-sora font-extrabold text-[var(--text-main)]">
                {project.title}
              </h2>
            </div>
            
            <button 
              onClick={onClose}
              data-cursor="[ CLOSE ]"
              className="p-3 rounded-full bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-main)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stack Tags */}
          <div className="flex flex-wrap gap-2">
            {project.stack && project.stack.map(tech => (
              <span 
                key={tech} 
                className="font-mono-custom text-xs text-[var(--text-main)] bg-[var(--card-bg)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg lowercase"
              >
                [{tech}]
              </span>
            ))}
          </div>

          {/* Project Screenshot / Artwork */}
          {displayImage && !imageError && (
            <div className="w-full aspect-video rounded-2xl border border-[var(--border-subtle)] overflow-hidden bg-[var(--card-bg)] relative group shadow-xl">
              <img 
                src={displayImage} 
                alt={project.title} 
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-4 font-sora">
            <p className="text-lg md:text-xl text-[var(--text-main)] leading-relaxed font-medium">
              {project.description}
            </p>
            {project.longDescription && (
              <div className="font-mono-custom text-xs text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap border-t border-[var(--border-subtle)] pt-6">
                {project.longDescription}
              </div>
            )}
          </div>

          {/* Action Links Bar */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-[var(--border-subtle)] font-mono-custom text-xs uppercase tracking-wider">
            {project.liveUrl && project.liveUrl !== '#' && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                data-cursor="[ LIVE DEMO ]"
                className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Explore Live Demo ↗</span>
              </a>
            )}
            {project.githubUrl && project.githubUrl !== '#' && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                data-cursor="[ GITHUB ]"
                className="bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] px-7 py-3.5 rounded-full transition-colors inline-flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                <span>View Source Code ↗</span>
              </a>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
