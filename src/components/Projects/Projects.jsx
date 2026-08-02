import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGitHubData } from '../../hooks/useGitHubData';
import ProjectModal from './ProjectModal';
import ScrollFloat from '../ReactBits/ScrollFloat';
import InfiniteMenu from '../ReactBits/InfiniteMenu';
import Carousel from '../ReactBits/Carousel';
import { Sparkles, MoveHorizontal } from 'lucide-react';

export default function Projects({ viewMode = 'carousel' }) {
  const { data: projectsData } = useGitHubData('projects.json');
  const { data: visibility } = useGitHubData('visibility.json');
  const [selectedProject, setSelectedProject] = useState(null);

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

  const carouselItems = visibleProjects.map((p, idx) => ({
    id: p.id || idx,
    title: p.title,
    category: p.category || 'FEATURED WORK',
    description: p.description,
    image: p.image || p.imageUrl || '/Homepage.png',
    originalProject: p
  }));

  const infiniteMenuItems = visibleProjects.map(p => ({
    image: p.imageUrl || p.image || '/Homepage.png',
    link: p.liveUrl || '#',
    title: p.title,
    description: ''
  }));

  const handleInfiniteSelect = (item) => {
    const proj = visibleProjects.find(p => p.title === item.title);
    if (proj) {
      setSelectedProject(proj);
    }
  };

  return (
    <section id="projects" className="py-16 sm:py-32 bg-[var(--bg-main)] relative z-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 pb-4 sm:pb-6 border-b border-[var(--border-subtle)] space-y-3 pt-4 sm:pt-6">
          <div className="flex justify-between items-center font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-widest">
            <span>[ 01 / SELECTED WORK ]</span>
            <span>[ {viewMode.toUpperCase()} VIEW • {visibleProjects.length} WORKS ]</span>
          </div>
          
          <ScrollFloat
            textClassName="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-sora font-extrabold text-[var(--text-main)] tracking-tight"
            animationDuration={1}
            stagger={0.03}
          >
            Selected Projects
          </ScrollFloat>
        </div>

        {/* GALLERY MODE: React Bits 3D InfiniteMenu Sphere Grid */}
        {viewMode === 'gallery' ? (
          <div className="h-[520px] sm:h-[650px] w-full relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--card-bg)]/80 backdrop-blur-xl shadow-2xl">
            <InfiniteMenu items={infiniteMenuItems} scale={1.1} onSelect={handleInfiniteSelect} />
          </div>
        ) : (
          /* CAROUSEL MODE (DEFAULT): React Bits 3D 360° Carousel Stage */
          <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[var(--card-bg)]/40 border border-[var(--border-subtle)] p-4 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
            
            {/* Top Instruction Badge */}
            <div className="flex items-center justify-between font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <MoveHorizontal className="w-3.5 h-3.5 text-[var(--accent-glow)] animate-pulse" />
                <span>[ DRAG / SWIPE TO ROTATE 360° • TAP CARD FOR FULL SPECS ]</span>
              </div>
              <span className="hidden sm:inline">[ AUTOPLAY ACTIVE ]</span>
            </div>

            {/* React Bits 3D Carousel Component */}
            <Carousel
              items={carouselItems}
              baseWidth={340}
              autoplay={true}
              autoplayDelay={3500}
              pauseOnHover={true}
              loop={true}
              round={false}
              onItemClick={(item) => setSelectedProject(item.originalProject || item)}
            />

            {/* Quick Select Pill Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 max-w-full px-3 sm:px-4 pt-4 border-t border-[var(--border-subtle)]">
              {visibleProjects.map((project, idx) => (
                <button
                  key={project.id || idx}
                  onClick={() => setSelectedProject(project)}
                  className="font-mono-custom text-[10px] sm:text-xs text-[var(--text-main)] bg-[var(--bg-main)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] px-3 sm:px-4 py-1.5 rounded-full shadow-md transition-all flex items-center gap-1.5 sm:gap-2 hover:scale-105 cursor-pointer"
                >
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--accent-glow)]" />
                  <span className="truncate max-w-[120px] sm:max-w-none">0{idx + 1} / {project.title}</span>
                </button>
              ))}
            </div>

          </div>
        )}

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
