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
  SiJavascript, 
  SiTypescript, 
  SiNextdotjs, 
  SiRedis, 
  SiGit, 
  SiVite 
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { Cpu, Layout, Server, Terminal } from 'lucide-react';

export default function TechStack() {
  const { data: skillsData } = useGitHubData('skills.json');
  const { data: visibility } = useGitHubData('visibility.json');

  if (visibility && !visibility.stack) return null;

  const defaultSkills = [
    { id: '1', name: 'Java 17/21', category: 'Backend Architecture' },
    { id: '2', name: 'Spring Boot 3', category: 'Backend Architecture' },
    { id: '3', name: 'REST APIs & WebSockets', category: 'Backend Architecture' },
    { id: '4', name: 'PostgreSQL & SQL', category: 'Backend Architecture' },
    { id: '5', name: 'Redis Caching', category: 'Backend Architecture' },

    { id: '6', name: 'React 19 & JSX', category: 'Interface Systems' },
    { id: '7', name: 'Next.js & SSR', category: 'Interface Systems' },
    { id: '8', name: 'TypeScript', category: 'Interface Systems' },
    { id: '9', name: 'Shadcn & TailwindCSS', category: 'Interface Systems' },
    { id: '10', name: 'GSAP & Three.js', category: 'Interface Systems' },

    { id: '11', name: 'Docker & Containers', category: 'DevOps & Tooling' },
    { id: '12', name: 'Git & GitHub Actions', category: 'DevOps & Tooling' },
    { id: '13', name: 'Vite & Rolldown', category: 'DevOps & Tooling' },
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

  const skills = skillsData || defaultSkills;
  const categories = [...new Set(skills.map(s => s.category))];

  const categoryIcons = {
    'Backend Architecture': <Server className="w-5 h-5 text-emerald-400" />,
    'Backend Systems': <Server className="w-5 h-5 text-emerald-400" />,
    'Interface Systems': <Layout className="w-5 h-5 text-sky-400" />,
    'Interface & Motion': <Layout className="w-5 h-5 text-sky-400" />,
    'DevOps & Tooling': <Terminal className="w-5 h-5 text-amber-400" />
  };

  return (
    <section id="stack" className="py-32 bg-[var(--bg-main)] relative z-10 border-t border-[var(--border-subtle)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header with React Bits ScrollFloat */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-6 border-b border-[var(--border-subtle)] gap-4">
          <div>
            <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
              [ 03 / SYSTEM ARCHITECTURE ]
            </span>
            <ScrollFloat
              textClassName="text-3xl sm:text-5xl font-sora font-extrabold text-[var(--text-main)]"
              animationDuration={1}
              stagger={0.03}
            >
              Technical Stack & Practice
            </ScrollFloat>
          </div>
          <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase">
            [ 3D CARDS SWAP • HOVER OR CLICK TO EXPLORE ]
          </span>
        </div>

        {/* React Bits CardSwap 3D Interactive Card Stack Stage */}
        <div className="h-[540px] w-full relative flex items-center justify-center mb-16 overflow-visible">
          <CardSwap
            width={540}
            height={340}
            cardDistance={32}
            verticalDistance={36}
            delay={4000}
            pauseOnHover={true}
            skewAmount={2}
            easing="elastic"
          >
            {categories.map((category, idx) => {
              const catSkills = skills.filter(s => s.category === category);
              return (
                <Card 
                  key={category}
                  customClass="p-8 flex flex-col justify-between border border-[var(--border-subtle)] bg-[var(--card-bg)]/95 shadow-2xl backdrop-blur-2xl transition-all hover:border-[var(--border-strong)]"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-5 font-mono-custom text-xs text-[var(--text-muted)] uppercase">
                      <div className="flex items-center gap-2">
                        {categoryIcons[category] || <Cpu className="w-5 h-5 text-[var(--accent-glow)]" />}
                        <span className="font-bold text-[var(--text-main)]">[ MODULE 0{idx + 1} ]</span>
                      </div>
                      <span>{catSkills.length} SKILLS</span>
                    </div>

                    {/* Category Title */}
                    <h3 className="font-sora text-2xl font-extrabold text-[var(--text-main)] mb-5">
                      {category}
                    </h3>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((skill) => (
                        <span
                          key={skill.id || skill.name}
                          data-cursor="[ SKILL ]"
                          className="font-mono-custom text-xs text-[var(--text-main)] bg-[var(--bg-main)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--text-main)] transition-colors lowercase cursor-pointer"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between font-mono-custom text-xs text-[var(--text-muted)]">
                    <span>STATUS: OPERATIONAL</span>
                    <span className="text-[var(--text-main)] font-bold">↗</span>
                  </div>
                </Card>
              );
            })}
          </CardSwap>
        </div>

        {/* React Bits LogoLoop Infinite Technology Loop Banner */}
        <div className="pt-12 border-t border-[var(--border-subtle)] overflow-hidden">
          <LogoLoop
            logos={techLogos}
            speed={80}
            direction="left"
            logoHeight={38}
            gap={52}
            scaleOnHover
            fadeOut
            ariaLabel="Core Technology Stack Logos"
          />
        </div>

      </div>
    </section>
  );
}
