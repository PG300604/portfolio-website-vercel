import { useState, useEffect } from 'react';
import { useGitHubData } from '../../hooks/useGitHubData';
import ScrollFloat from '../ReactBits/ScrollFloat';
import LogoLoop from '../ReactBits/LogoLoop';
import CardSwap, { Card } from '../ReactBits/CardSwap';
import { 
  SiReact, 
  SiSpringboot, 
  SiPostgresql, 
  SiDocker, 
  SiTailwindcss, 
  SiTypescript, 
  SiNextdotjs, 
  SiRedis, 
  SiGit, 
  SiVite 
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { Cpu, Layout, Server, Terminal } from 'lucide-react';

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

export default function TechStack() {
  const { data: visibility } = useGitHubData('visibility.json');
  const cardDims = useResponsiveDimensions(300, 240, 540, 340);

  if (visibility && !visibility.stack) return null;

  const skills = [
    { id: '1', name: 'Java 21', category: 'Backend Architecture' },
    { id: '2', name: 'Spring Boot 3', category: 'Backend Architecture' },
    { id: '3', name: 'REST APIs & Microservices', category: 'Backend Architecture' },
    { id: '4', name: 'PostgreSQL & MySQL', category: 'Backend Architecture' },
    { id: '5', name: 'Redis Caching', category: 'Backend Architecture' },
    { id: '6', name: 'WebSockets & Messaging', category: 'Backend Architecture' },

    { id: '7', name: 'React 19 & JSX', category: 'Interface Systems' },
    { id: '8', name: 'Next.js 15 & SSR', category: 'Interface Systems' },
    { id: '9', name: 'TypeScript', category: 'Interface Systems' },
    { id: '10', name: 'Shadcn UI & TailwindCSS', category: 'Interface Systems' },
    { id: '11', name: 'GSAP & Motion', category: 'Interface Systems' },
    { id: '12', name: 'Three.js & WebGL', category: 'Interface Systems' },

    { id: '13', name: 'Docker & Containers', category: 'DevOps & Tooling' },
    { id: '14', name: 'Git & GitHub Actions', category: 'DevOps & Tooling' },
    { id: '15', name: 'Vite & Build Tools', category: 'DevOps & Tooling' },
    { id: '16', name: 'CI/CD Pipelines', category: 'DevOps & Tooling' },
    { id: '17', name: 'Linux Server Admin', category: 'DevOps & Tooling' },
  ];

  const techLogos = [
    { node: <FaJava />, title: "Java 21", href: "https://www.java.com" },
    { node: <SiSpringboot />, title: "Spring Boot", href: "https://spring.io/projects/spring-boot" },
    { node: <SiReact />, title: "React 19", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <SiPostgresql />, title: "PostgreSQL", href: "https://www.postgresql.org" },
    { node: <SiRedis />, title: "Redis", href: "https://redis.io" },
    { node: <SiDocker />, title: "Docker", href: "https://www.docker.com" },
    { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
    { node: <SiVite />, title: "Vite", href: "https://vite.dev" },
    { node: <SiGit />, title: "Git", href: "https://git-scm.com" },
  ];

  const categories = [...new Set(skills.map(s => s.category))];

  const categoryIcons = {
    'Backend Architecture': <Server className="w-5 h-5 text-emerald-400" />,
    'Interface Systems': <Layout className="w-5 h-5 text-sky-400" />,
    'DevOps & Tooling': <Terminal className="w-5 h-5 text-amber-400" />
  };

  return (
    <section id="stack" className="py-16 sm:py-32 bg-[var(--bg-main)] relative z-10 border-t border-[var(--border-subtle)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16 pb-4 sm:pb-6 border-b border-[var(--border-subtle)] gap-4">
          <div>
            <span className="font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
              [ 03 / SYSTEM ARCHITECTURE ]
            </span>
            <ScrollFloat
              textClassName="text-2xl sm:text-3xl md:text-5xl font-sora font-extrabold text-[var(--text-main)]"
              animationDuration={1}
              stagger={0.03}
            >
              Technical Stack & Practice
            </ScrollFloat>
          </div>
          <span className="font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] uppercase hidden sm:block">
            [ CLICK CARD OR BUTTON TO SWAP ]
          </span>
        </div>

        {/* CardSwap 3D Interactive Card Stack */}
        <div className="h-[360px] sm:h-[480px] w-full relative flex flex-col items-center justify-center mb-8 sm:mb-12 overflow-visible">
          <CardSwap
            width={cardDims.w}
            height={cardDims.h}
            cardDistance={cardDims.w < 400 ? 20 : 32}
            verticalDistance={cardDims.w < 400 ? 24 : 36}
            delay={4000}
            pauseOnHover={true}
            skewAmount={cardDims.w < 400 ? 1 : 2}
          >
            {categories.map((category, idx) => {
              const catSkills = skills.filter(s => s.category === category);
              return (
                <Card 
                  key={category}
                  customClass="p-4 sm:p-8 flex flex-col justify-between border border-[var(--border-subtle)] bg-[var(--card-bg)]/95 shadow-2xl backdrop-blur-2xl transition-all hover:border-[var(--border-strong)] cursor-pointer"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[var(--border-subtle)] mb-3 sm:mb-5 font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] uppercase">
                      <div className="flex items-center gap-2">
                        {categoryIcons[category] || <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-glow)]" />}
                        <span className="font-bold text-[var(--text-main)]">[ MODULE 0{idx + 1} ]</span>
                      </div>
                      <span>{catSkills.length} SKILLS</span>
                    </div>

                    {/* Category Title */}
                    <h3 className="font-sora text-lg sm:text-2xl font-extrabold text-[var(--text-main)] mb-3 sm:mb-5 uppercase tracking-wide">
                      {category}
                    </h3>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {catSkills.map((skill) => (
                        <span
                          key={skill.id || skill.name}
                          className="font-mono-custom text-[10px] sm:text-xs text-[var(--text-main)] bg-[var(--bg-main)] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--text-main)] transition-colors lowercase cursor-pointer"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 sm:pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)]">
                    <span className="hidden sm:inline">CLICK CARD TO SWAP</span>
                    <span className="sm:hidden">TAP TO SWAP</span>
                    <span className="text-[var(--text-main)] font-bold">TAP ↗</span>
                  </div>
                </Card>
              );
            })}
          </CardSwap>
        </div>

        {/* LogoLoop Banner */}
        <div className="pt-8 sm:pt-12 border-t border-[var(--border-subtle)] overflow-hidden">
          <LogoLoop
            logos={techLogos}
            speed={80}
            direction="left"
            logoHeight={28}
            gap={36}
            scaleOnHover
            fadeOut
            ariaLabel="Core Technology Stack Logos"
          />
        </div>

      </div>
    </section>
  );
}
