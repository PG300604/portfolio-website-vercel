import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGitHubData } from '../../hooks/useGitHubData';
import ProjectModal from './ProjectModal';
import ScrollFloat from '../ReactBits/ScrollFloat';
import FlyingPosters from '../ReactBits/FlyingPosters';
import InfiniteMenu from '../ReactBits/InfiniteMenu';
import { ChevronUp, ChevronDown, MoveVertical, Sparkles } from 'lucide-react';

function useResponsiveDimensions(mobileW, mobileH, desktopW, desktopH, breakpoint = 640) {
  const [dims, setDims] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    return w < breakpoint ? { w: mobileW, h: mobileH } : { w: desktopW, h: desktopH };
  });

  useEffect(() => {
    const handleResize = () => {
      setDims(window.innerWidth < breakpoint ? { w: mobileW, h: mobileH } : { w: desktopW, h: desktopH });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileW, mobileH, desktopW, desktopH, breakpoint]);

  return dims;
}

export default function Projects({ viewMode = 'list' }) {
  const { data: projectsData } = useGitHubData('projects.json');
  const { data: visibility } = useGitHubData('visibility.json');
  const [selectedProject, setSelectedProject] = useState(null);
  const postersRef = useRef(null);
  const posterDims = useResponsiveDimensions(320, 260, 620, 420);

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

  const infiniteMenuItems = visibleProjects.map(p => ({
    image: p.imageUrl || p.image || '/Homepage.png',
    link: p.liveUrl || '#',
    title: p.title,
    description: ''
  }));

  const handlePosterClick = (index) => {
    if (visibleProjects[index]) {
      setSelectedProject(visibleProjects[index]);
    }
  };

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
          /* LIST MODE (DEFAULT): 3D FLYING POSTERS STAGE */
          <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl group">
            
            {/* Top Floating Instruction Badge */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 font-mono-custom text-[10px] sm:text-xs text-[var(--text-main)] uppercase tracking-widest bg-[var(--bg-main)]/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[var(--border-subtle)] shadow-2xl flex items-center gap-2 pointer-events-none">
              <MoveVertical className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--accent-glow)] animate-pulse" />
              <span className="hidden sm:inline">[ DRAG CARDS UP / DOWN TO FLY • CLICK CARD FOR SPECS ]</span>
              <span className="sm:hidden">[ DRAG / TAP ]</span>
            </div>

            {/* Right Floating Navigation */}
            <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 sm:gap-3">
              <button
                onClick={() => postersRef.current?.prev()}
                className="p-2 sm:p-3 rounded-full bg-[var(--bg-main)]/90 backdrop-blur-md border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-main)] transition-colors shadow-2xl flex items-center justify-center"
                title="Fly to Previous Project Card"
              >
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => postersRef.current?.next()}
                className="p-2 sm:p-3 rounded-full bg-[var(--bg-main)]/90 backdrop-blur-md border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-main)] transition-colors shadow-2xl flex items-center justify-center"
                title="Fly to Next Project Card"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* 3D WebGL Canvas Stage */}
            <div 
              data-cursor="[ DRAG TO FLY / CLICK ]"
              className="h-[440px] sm:h-[600px] md:h-[760px] w-full relative cursor-grab active:cursor-grabbing"
            >
              <FlyingPosters
                ref={postersRef}
                items={posterItems}
                planeWidth={posterDims.w}
                planeHeight={posterDims.h}
                distortion={4}
                scrollEase={0.06}
                onItemClick={handlePosterClick}
              />
            </div>

            {/* Bottom Quick Select Pill Buttons */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 max-w-full px-3 sm:px-4">
              {visibleProjects.map((project, idx) => (
                <button
                  key={project.id || idx}
                  onClick={() => setSelectedProject(project)}
                  className="font-mono-custom text-[10px] sm:text-xs text-[var(--text-main)] bg-[var(--bg-main)]/90 backdrop-blur-md border border-[var(--border-subtle)] hover:border-[var(--border-strong)] px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-xl transition-all flex items-center gap-1.5 sm:gap-2 hover:scale-105"
                >
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--accent-glow)]" />
                  <span className="truncate max-w-[100px] sm:max-w-none">0{idx + 1} / {project.title}</span>
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
