import { useTilt } from '../../hooks/useTilt';
import { ExternalLink, Code, ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ project, onClick, index = 0 }) {
  const tilt = useTilt({ max: 6, scale: 1.01 });
  const projectNumber = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      onClick={onClick}
      data-cursor="[ VIEW PROJECT ]"
      className="group cursor-pointer flex flex-col justify-between bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] p-6 sm:p-8 rounded-2xl transition-all duration-300 shadow-xl"
    >
      <div>
        {/* Cover Image / Canvas Box */}
        <div className="aspect-16/9 rounded-xl overflow-hidden mb-6 bg-[var(--bg-main)] border border-[var(--border-subtle)] relative">
          <img
            src={project.image || "/Homepage.png"}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/logo.png";
            }}
          />
          <div className="absolute top-4 left-4 font-mono-custom text-[11px] bg-[var(--bg-main)]/90 text-[var(--text-main)] px-3 py-1 rounded-full border border-[var(--border-subtle)] backdrop-blur-md">
            [{projectNumber}]
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-2xl font-sora font-bold text-[var(--text-main)] group-hover:opacity-80 transition-opacity">
            {project.title}
          </h3>
          <ArrowUpRight className="w-6 h-6 text-[var(--text-main)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>

        <p className="font-mono-custom text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3 mb-6">
          {project.description}
        </p>
      </div>

      {/* Tech Tags & Links */}
      <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between font-mono-custom text-xs text-[var(--text-muted)]">
        <div className="flex flex-wrap gap-2">
          {project.stack.slice(0, 3).map((tech) => (
            <span key={tech} className="lowercase bg-[var(--bg-main)] px-2.5 py-1 rounded border border-[var(--border-subtle)] text-[11px]">
              {tech}
            </span>
          ))}
        </div>
        <span className="text-[var(--text-main)] font-bold">[ DETAILS ]</span>
      </div>

    </div>
  );
}
