import { useState } from 'react';
import { useGitHubData } from '../../hooks/useGitHubData';
import { Download, Award, GraduationCap, BarChart3, Code2 } from 'lucide-react';
import ScrollFloat from '../ReactBits/ScrollFloat';

export default function About() {
  const { data: aboutData } = useGitHubData('about.json');
  const { data: visibility } = useGitHubData('visibility.json');
  const [activeTab, setActiveTab] = useState('bio');

  if (visibility && !visibility.about) return null;

  const about = aboutData || {
    bio: "Independent software developer shaping digital products, full-stack architectures, and intuitive web experiences from Giridih to the world. Focused on clean system design, Java backend performance, and refined motion execution.",
    degree: "B.Tech in Computer Science & Engineering",
    college: "Techno Main Salt Lake",
    year: "3rd Year Student",
    location: "Giridih, India",
    sgpa: "9.2",
    projectsCount: "12+",
    email: "priyanshughosh97@gmail.com",
    resumeUrl: "#",
  };

  return (
    <section id="about" className="py-32 bg-[var(--bg-main)] relative z-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Label with React Bits ScrollFloat */}
        <div className="flex justify-between items-end mb-16 pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
              [ 02 / ABOUT & SPECIFICATIONS ]
            </span>
            <ScrollFloat
              textClassName="text-3xl sm:text-5xl font-sora font-extrabold text-[var(--text-main)]"
              animationDuration={1}
              stagger={0.02}
            >
              Acquiring a comprehensive understanding of working systems.
            </ScrollFloat>
          </div>
        </div>

        {/* Full-Width Specifications Container */}
        <div className="max-w-5xl mx-auto space-y-10 mt-8">
          
          {/* Custom Tab Switcher */}
          <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4 font-mono-custom text-xs uppercase tracking-wider">
            {[
              { id: 'bio', label: 'Biography & Practice', icon: <Code2 className="w-4 h-4" /> },
              { id: 'academics', label: 'Academics & College', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'metrics', label: 'Telemetry & Metrics', icon: <BarChart3 className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-cursor="[ SWITCH TAB ]"
                className={`px-5 py-2.5 rounded-full border transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-bold border-[var(--text-main)] shadow-lg'
                    : 'bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                }`}
              >
                {tab.icon}
                <span>[{activeTab === tab.id ? '·' : ' '}] {tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB CONTENT: BIO */}
          {activeTab === 'bio' && (
            <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 font-mono-custom text-xs text-[var(--text-muted)] uppercase">
                <span>// BIOGRAPHY & PRACTICE</span>
                <span>STATUS: ACTIVE DEVELOPER</span>
              </div>
              <p className="text-[var(--text-main)] font-sora text-xl sm:text-2xl font-bold leading-relaxed">
                Full-Stack Java & Web Systems Engineer
              </p>
              <p className="text-[var(--text-muted)] font-mono-custom text-sm sm:text-base leading-relaxed">
                {about.bio}
              </p>
              <div className="pt-4 flex flex-wrap gap-3 font-mono-custom text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                  JAVA 21 / SPRING BOOT 3
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                  REACT 19 / NEXT.JS
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                  MICROSERVICES & REST
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                  POSTGRESQL & REDIS
                </span>
              </div>
            </div>
          )}

          {/* TAB CONTENT: ACADEMICS */}
          {activeTab === 'academics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-8 rounded-3xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between font-mono-custom text-xs text-[var(--text-muted)] uppercase border-b border-[var(--border-subtle)] pb-3">
                  <span>// DEGREE SPECIFICATION</span>
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-sora text-xl font-extrabold text-[var(--text-main)]">{about.degree}</div>
                <div className="font-mono-custom text-xs text-[var(--text-muted)]">{about.college}</div>
              </div>

              <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-8 rounded-3xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between font-mono-custom text-xs text-[var(--text-muted)] uppercase border-b border-[var(--border-subtle)] pb-3">
                  <span>// ACADEMIC STATUS</span>
                  <Award className="w-4 h-4 text-sky-400" />
                </div>
                <div className="font-sora text-xl font-extrabold text-[var(--text-main)]">{about.year}</div>
                <div className="font-mono-custom text-xs text-[var(--text-muted)]">{about.location}</div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: METRICS */}
          {activeTab === 'metrics' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-8 rounded-3xl text-center shadow-xl">
                <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase block mb-3">// ACADEMIC SGPA</span>
                <span className="font-sora text-5xl font-extrabold text-[var(--text-main)]">{about.sgpa}</span>
              </div>
              <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-8 rounded-3xl text-center shadow-xl">
                <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase block mb-3">// SHIPPED PROJECTS</span>
                <span className="font-sora text-5xl font-extrabold text-[var(--text-main)]">{about.projectsCount}</span>
              </div>
              <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-8 rounded-3xl text-center shadow-xl">
                <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase block mb-3">// AVAILABILITY</span>
                <span className="font-mono-custom text-sm font-bold text-emerald-400 block mt-4">[ 100% ONLINE ]</span>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-4 flex items-center justify-between font-mono-custom text-xs uppercase tracking-wider">
            {about.resumeUrl && (
              <a
                href={about.resumeUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="[ DOWNLOAD PDF ]"
                className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-xl"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume PDF</span>
              </a>
            )}
            <span className="text-[var(--text-muted)] hidden sm:inline">[ LOCATION: GIRIDIH, INDIA ]</span>
          </div>

        </div>

      </div>
    </section>
  );
}
