import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGitHubData } from '../../hooks/useGitHubData';
import ProjectModal from './ProjectModal';
import ScrollFloat from '../ReactBits/ScrollFloat';
import FlyingPosters from '../ReactBits/FlyingPosters';
import { ChevronUp, ChevronDown, MoveVertical, Sparkles } from 'lucide-react';

export default function Projects() {
  const { data: projectsData } = useGitHubData('projects.json');
  const { data: visibility } = useGitHubData('visibility.json');
  const [selectedProject, setSelectedProject] = useState(null);
  const postersRef = useRef(null);

  if (visibility && !visibility.projects) return null;

  const defaultProjects = [
    {
      id: "p1",
      title: "CryptOwl Intelligence",
      category: "SaaS & WebSockets",
      year: "2026",
      description: "Realtime market telemetry SaaS platform with live analytics, AI signals, and automated user alerts.",
      stack: ["Java", "Spring Boot", "React", "WebSockets"],
      featured: true,
      visible: true,
      image: "/Homepage.png",
      liveUrl: "https://cryptowl.io/",
      githubUrl: "https://github.com"
    },
    {
      id: "p2",
      title: "Distributed Job Engine",
      category: "Backend Architecture",
      year: "2025",
      description: "High-throughput asynchronous background job execution pipeline built with Java concurrency.",
      stack: ["Java", "Docker", "REST API", "PostgreSQL"],
      featured: false,
      visible: true,
      image: "/Homepage.png",
      liveUrl: "#",
      githubUrl: "https://github.com"
    },
    {
      id: "p3",
      title: "Specia1ne Portfolio System",
      category: "Interface System",
      year: "2026",
      description: "Editorial digital practice portfolio shaped with custom motion physics and responsive layouts.",
      stack: ["React", "Shadcn UI", "Anime.js", "TailwindCSS"],
      featured: true,
      visible: true,
      image: "/Homepage.png",
      liveUrl: "#",
      githubUrl: "https://github.com"
    }
  ];

  const projects = projectsData || defaultProjects;
  const visibleProjects = projects.filter(p => p.visible !== false);

  // Strictly map project artwork images (filter out profile photos)
  const posterItems = visibleProjects.map(p => {
    if (p.image && !p.image.includes('profile')) return p.image;
    return "/Homepage.png";
  });

  const handlePosterClick = (index) => {
    if (visibleProjects[index]) {
      setSelectedProject(visibleProjects[index]);
    }
  };

  return (
    <section id="projects" className="py-32 bg-[var(--bg-main)] relative z-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header with Full Width Metadata Bar */}
        <div className="mb-12 pb-6 border-b border-[var(--border-subtle)] space-y-3 pt-6">
          <div className="flex justify-between items-center font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest">
            <span>[ 01 / SELECTED WORK ]</span>
            <span>[ SHOWING {visibleProjects.length} WORKS ]</span>
          </div>
          
          <ScrollFloat
            textClassName="text-4xl sm:text-6xl md:text-7xl font-sora font-extrabold text-[var(--text-main)] tracking-tight"
            animationDuration={1}
            stagger={0.03}
          >
            Selected Projects
          </ScrollFloat>
        </div>

        {/* 3D FLYING POSTERS INTERACTIVE STAGE WITH USER-FRIENDLY CONTROLS */}
        <div className="relative w-full overflow-hidden rounded-3xl group">
          
          {/* Top Floating Instruction Badge */}
          <div className="absolute top-4 left-4 z-20 font-mono-custom text-xs text-[var(--text-main)] uppercase tracking-widest bg-[var(--bg-main)]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-subtle)] shadow-2xl flex items-center gap-2 pointer-events-none">
            <MoveVertical className="w-3.5 h-3.5 text-[var(--accent-glow)] animate-pulse" />
            <span>[ DRAG CARDS UP / DOWN TO FLY • CLICK CARD FOR SPECS ]</span>
          </div>

          {/* Right Floating Quick Navigation Buttons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
            <button
              onClick={() => postersRef.current?.prev()}
              data-cursor="[ PREV CARD ]"
              className="p-3 rounded-full bg-[var(--bg-main)]/90 backdrop-blur-md border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-main)] transition-colors shadow-2xl flex items-center justify-center"
              title="Fly to Previous Project Card"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => postersRef.current?.next()}
              data-cursor="[ NEXT CARD ]"
              className="p-3 rounded-full bg-[var(--bg-main)]/90 backdrop-blur-md border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-main)] transition-colors shadow-2xl flex items-center justify-center"
              title="Fly to Next Project Card"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* 3D WebGL Canvas Stage */}
          <div 
            data-cursor="[ DRAG TO FLY / CLICK ]"
            className="h-[760px] w-full relative cursor-grab active:cursor-grabbing"
          >
            <FlyingPosters
              ref={postersRef}
              items={posterItems}
              planeWidth={560}
              planeHeight={560}
              distortion={3}
              scrollEase={0.08}
              onItemClick={handlePosterClick}
            />
          </div>

          {/* Bottom Floating Quick Select Pill Buttons */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap justify-center items-center gap-2 max-w-full px-4">
            {visibleProjects.map((project, idx) => (
              <button
                key={project.id || idx}
                onClick={() => setSelectedProject(project)}
                data-cursor="[ VIEW SPECS ]"
                className="font-mono-custom text-xs text-[var(--text-main)] bg-[var(--bg-main)]/90 backdrop-blur-md border border-[var(--border-subtle)] hover:border-[var(--border-strong)] px-4 py-2 rounded-full shadow-xl transition-all flex items-center gap-2 hover:scale-105"
              >
                <Sparkles className="w-3 h-3 text-[var(--accent-glow)]" />
                <span>0{idx + 1} / {project.title}</span>
              </button>
            ))}
          </div>

        </div>

      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
