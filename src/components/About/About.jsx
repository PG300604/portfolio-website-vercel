import { useState } from 'react';
import { useGitHubData } from '../../hooks/useGitHubData';
import { useTilt } from '../../hooks/useTilt';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '../ui/dialog';
import { User, Download, Award, GraduationCap, BarChart3, Code2 } from 'lucide-react';
import ScrollFloat from '../ReactBits/ScrollFloat';

export default function About() {
  const { data: aboutData } = useGitHubData('about.json');
  const { data: visibility } = useGitHubData('visibility.json');
  const [photoOpen, setPhotoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('bio');

  const tilt = useTilt({ max: 8, scale: 1.02 });

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
          
          {/* LEFT: 3D Interactive Photo Frame with User's Photo */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <Dialog open={photoOpen} onOpenChange={setPhotoOpen}>
              <DialogTrigger asChild>
                <div
                  ref={tilt.ref}
                  onMouseMove={tilt.onMouseMove}
                  onMouseLeave={tilt.onMouseLeave}
                  data-cursor="[ EXPAND PHOTO ]"
                  className="relative group cursor-pointer w-full max-w-sm rounded-2xl p-3 bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all shadow-2xl"
                >
                  <div className="aspect-4/5 rounded-xl overflow-hidden relative bg-[var(--bg-main)] flex items-center justify-center border border-[var(--border-subtle)]">
                    <img
                      src={photoSrc}
                      alt="Priyanshu Profile"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    
                    {/* Fallback Avatar Placeholder */}
                    <div className="hidden absolute inset-0 flex-col items-center justify-center bg-[var(--bg-main)] p-6 text-center">
                      <div className="w-20 h-20 rounded-full border border-dashed border-[var(--text-main)] flex items-center justify-center mb-4">
                        <User className="w-10 h-10 text-[var(--text-main)]" />
                      </div>
                      <p className="font-mono-custom text-xs text-[var(--text-main)] uppercase tracking-wider mb-1">PROFILE PHOTO</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 font-mono-custom text-xs text-[var(--text-muted)]">
                    <span>PORTRAIT</span>
                    <span className="text-[var(--text-main)] font-bold">[ 3D TILT • CLICK TO EXPAND ]</span>
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent className="max-w-xl bg-[var(--bg-main)] border-[var(--border-subtle)] text-[var(--text-main)] p-6 rounded-3xl shadow-2xl">
                <DialogTitle className="font-mono-custom text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  [ PRIYANSHU GHOSH • PORTRAIT PREVIEW ]
                </DialogTitle>
                <DialogDescription className="hidden">Profile Photo</DialogDescription>
                <div className="mt-4 rounded-2xl overflow-hidden border border-[var(--border-subtle)] max-h-[75vh] flex items-center justify-center bg-[var(--card-bg)]">
                  <img
                    src={photoSrc}
                    alt="Priyanshu High Res"
                    className="w-full h-full object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* RIGHT: Tabbed Specifications */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Custom Tab Switcher */}
            <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4 font-mono-custom text-xs uppercase tracking-wider flex-wrap">
              {[
                { id: 'bio', label: 'Biography', icon: <Code2 className="w-4 h-4" /> },
                { id: 'academics', label: 'Academics', icon: <GraduationCap className="w-4 h-4" /> },
                { id: 'metrics', label: 'Metrics', icon: <BarChart3 className="w-4 h-4" /> }
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
              <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-3xl p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 font-mono-custom text-xs text-[var(--text-muted)] uppercase">
                  <span>// BIOGRAPHY & PRACTICE</span>
                  <span>STATUS: ACTIVE DEVELOPER</span>
                </div>
                <p className="text-[var(--text-main)] font-sora text-xl font-bold leading-relaxed">
                  Full-Stack Java & Web Systems Engineer
                </p>
                <p className="text-[var(--text-muted)] font-mono-custom text-xs sm:text-sm leading-relaxed">
                  {about.bio}
                </p>
                <div className="pt-4 flex flex-wrap gap-2.5 font-mono-custom text-xs">
                  <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                    JAVA 21 / SPRING BOOT 3
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                    REACT 19 / NEXT.JS
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                    POSTGRESQL & REDIS
                  </span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ACADEMICS */}
            {activeTab === 'academics' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl space-y-3 shadow-xl">
                  <div className="flex items-center justify-between font-mono-custom text-xs text-[var(--text-muted)] uppercase border-b border-[var(--border-subtle)] pb-3">
                    <span>// DEGREE</span>
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-sora text-lg font-extrabold text-[var(--text-main)]">{about.degree}</div>
                  <div className="font-mono-custom text-xs text-[var(--text-muted)]">{about.college}</div>
                </div>

                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl space-y-3 shadow-xl">
                  <div className="flex items-center justify-between font-mono-custom text-xs text-[var(--text-muted)] uppercase border-b border-[var(--border-subtle)] pb-3">
                    <span>// STATUS</span>
                    <Award className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="font-sora text-lg font-extrabold text-[var(--text-main)]">{about.year}</div>
                  <div className="font-mono-custom text-xs text-[var(--text-muted)]">{about.location}</div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: METRICS */}
            {activeTab === 'metrics' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl text-center shadow-xl">
                  <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase block mb-2">// SGPA</span>
                  <span className="font-sora text-4xl font-extrabold text-[var(--text-main)]">{about.sgpa}</span>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl text-center shadow-xl">
                  <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase block mb-2">// PROJECTS</span>
                  <span className="font-sora text-4xl font-extrabold text-[var(--text-main)]">{about.projectsCount}</span>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl text-center col-span-2 sm:col-span-1 shadow-xl">
                  <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase block mb-2">// STATUS</span>
                  <span className="font-mono-custom text-xs font-bold text-emerald-400 block mt-3">[ 100% ONLINE ]</span>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 flex flex-wrap gap-4 font-mono-custom text-xs uppercase tracking-wider">
              {about.resumeUrl && (
                <a
                  href={about.resumeUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="[ DOWNLOAD PDF ]"
                  className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-xl"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume PDF</span>
                </a>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
