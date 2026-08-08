import { useState } from 'react';
import { useGitHubData } from '../../hooks/useGitHubData';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '../ui/dialog';
import { User, Download, Award, GraduationCap, BarChart3, Code2, MoveHorizontal } from 'lucide-react';
import ScrollFloat from '../ReactBits/ScrollFloat';
import Lanyard from '../ReactBits/Lanyard';

export default function About() {
  const { data: aboutData } = useGitHubData('about.json');
  const { data: visibility } = useGitHubData('visibility.json');
  const [photoOpen, setPhotoOpen] = useState(false);
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

  const photoSrc = "/profile.png";

  return (
    <section id="about" className="py-16 sm:py-32 bg-[var(--bg-main)] relative z-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Label */}
        <div className="flex justify-between items-end mb-10 sm:mb-16 pb-4 sm:pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <span className="font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
              [ 02 / ABOUT & SPECIFICATIONS ]
            </span>
            <ScrollFloat
              textClassName="text-xl sm:text-3xl md:text-5xl font-sora font-extrabold text-[var(--text-main)]"
              animationDuration={1}
              stagger={0.02}
            >
              Acquiring a comprehensive understanding of working systems.
            </ScrollFloat>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start mt-4 sm:mt-8">
          
          {/* LEFT: 3D Physics Lanyard Card Stage */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <div className="relative w-full max-w-md sm:max-w-xl h-[520px] sm:h-[640px] rounded-3xl bg-[var(--card-bg)]/80 border border-[var(--border-subtle)] overflow-hidden shadow-2xl flex flex-col items-center justify-between p-4 group">
              
              {/* Badge Overlay */}
              <div className="absolute top-4 left-4 z-10 font-mono-custom text-[10px] sm:text-xs text-[var(--text-main)] uppercase tracking-wider bg-[var(--bg-main)]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] shadow-lg flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>[ 3D LANYARD BADGE • DRAG CARD ]</span>
              </div>

              {/* React Bits 3D Lanyard Component */}
              <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <Lanyard
                  position={[0, 0, 14]}
                  gravity={[0, -40, 0]}
                  frontImage={photoSrc}
                  backImage={photoSrc}
                  imageFit="cover"
                  lanyardWidth={1.4}
                  cardScale={3.5}
                />
              </div>

              {/* Bottom Expand Trigger Button */}
              <Dialog open={photoOpen} onOpenChange={setPhotoOpen}>
                <DialogTrigger asChild>
                  <button 
                    data-cursor="[ EXPAND PORTRAIT ]"
                    className="z-10 font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] uppercase bg-[var(--bg-main)]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all cursor-pointer shadow-md mb-1"
                  >
                    [ CLICK TO VIEW HIGH-RES PORTRAIT ↗ ]
                  </button>
                </DialogTrigger>

                <DialogContent className="max-w-[90vw] sm:max-w-xl bg-[var(--bg-main)] border-[var(--border-subtle)] text-[var(--text-main)] p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl">
                  <DialogTitle className="font-mono-custom text-[10px] sm:text-xs uppercase tracking-wider text-[var(--text-muted)]">
                    [ PRIYANSHU GHOSH • PORTRAIT PREVIEW ]
                  </DialogTitle>
                  <DialogDescription className="hidden">Profile Photo</DialogDescription>
                  <div className="mt-3 sm:mt-4 rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--border-subtle)] max-h-[70vh] flex items-center justify-center bg-[var(--card-bg)]">
                    <img
                      src={photoSrc}
                      alt="Priyanshu High Res"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        if (e.target.src.endsWith('/profile.png')) {
                          e.target.src = '/profile.jpg';
                        }
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>

            </div>
          </div>

          {/* RIGHT: Tabbed Specifications */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Tab Switcher */}
            <div className="flex items-center gap-2 sm:gap-3 border-b border-[var(--border-subtle)] pb-3 sm:pb-4 font-mono-custom text-[10px] sm:text-xs uppercase tracking-wider overflow-x-auto">
              {[
                { id: 'bio', label: 'Bio', icon: <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { id: 'academics', label: 'Academics', icon: <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { id: 'metrics', label: 'Metrics', icon: <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-bold border-[var(--text-main)] shadow-lg'
                      : 'bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            {activeTab === 'bio' && (
              <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                <p className="font-sora text-base sm:text-lg text-[var(--text-main)] leading-relaxed font-medium">
                  {about.bio}
                </p>
                <div className="font-mono-custom text-xs text-[var(--text-muted)] space-y-2 border-l-2 border-[var(--accent-glow)] pl-4 py-1">
                  <div>// CURRENT FOCUS: Java Spring Boot Microservices & React Architecture</div>
                  <div>// LOCATION: {about.location}</div>
                  <div>// ROLES: {about.heroRoles || "Full Stack Developer"}</div>
                </div>
              </div>
            )}

            {activeTab === 'academics' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-mono-custom text-xs animate-fadeIn">
                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-2 shadow-xl">
                  <span className="text-[var(--text-muted)] uppercase block font-bold">// DEGREE</span>
                  <h4 className="font-sora text-sm sm:text-base font-bold text-[var(--text-main)]">{about.degree}</h4>
                  <p className="text-[var(--text-muted)]">{about.college}</p>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-2 shadow-xl">
                  <span className="text-[var(--text-muted)] uppercase block font-bold">// PERFORMANCE</span>
                  <h4 className="font-sora text-sm sm:text-base font-bold text-[var(--text-main)]">SGPA: {about.sgpa} / 10.0</h4>
                  <p className="text-[var(--text-muted)]">{about.year}</p>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 font-mono-custom animate-fadeIn">
                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center shadow-xl">
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase block mb-2">// PROJECTS</span>
                  <span className="font-sora text-3xl sm:text-4xl font-extrabold text-[var(--text-main)]">{about.projectsCount}</span>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center shadow-xl">
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase block mb-2">// STATUS</span>
                  <span className="font-mono-custom text-xs font-bold text-emerald-400 block mt-3">[ 100% ONLINE ]</span>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 sm:pt-4 flex flex-wrap gap-3 sm:gap-4 font-mono-custom text-[10px] sm:text-xs uppercase tracking-wider">
              {about.resumeUrl && (
                <a
                  href={about.resumeUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold px-5 sm:px-6 py-3 sm:py-3.5 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-xl"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Download Resume</span>
                </a>
              )}

              {about.linkedin && (
                <a
                  href={about.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] font-bold px-5 sm:px-6 py-3 sm:py-3.5 rounded-full transition-colors inline-flex items-center gap-1.5 shadow-lg"
                >
                  <span>LinkedIn</span>
                  <span>↗</span>
                </a>
              )}

              {about.github && (
                <a
                  href={about.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] font-bold px-5 sm:px-6 py-3 sm:py-3.5 rounded-full transition-colors inline-flex items-center gap-1.5 shadow-lg"
                >
                  <span>GitHub</span>
                  <span>↗</span>
                </a>
              )}

              {about.instagram && (
                <a
                  href={about.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] font-bold px-5 sm:px-6 py-3 sm:py-3.5 rounded-full transition-colors inline-flex items-center gap-1.5 shadow-lg"
                >
                  <span>Instagram</span>
                  <span>↗</span>
                </a>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
