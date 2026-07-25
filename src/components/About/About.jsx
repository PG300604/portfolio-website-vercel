import { useGitHubData } from '../../hooks/useGitHubData';
import SectionLabel from '../shared/SectionLabel';

export default function About() {
  const { data: about, loading } = useGitHubData('about.json');
  const { data: visibility } = useGitHubData('visibility.json');

  if (visibility && !visibility.about) return null;

  return (
    <section id="about" className="py-24 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel label="ABOUT_ME" title="About" />

        {loading ? (
          <div className="text-[#8fa3c0] font-mono text-sm">Loading about data...</div>
        ) : about ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <p className="text-[#8fa3c0] font-sora text-lg leading-relaxed mb-8">
                {about.bio}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#0a0f1e] border-2 border-[#1e2d4a] p-6 border-l-[3px] border-l-[#4fcea6]">
                  <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-1">Degree</div>
                  <div className="font-sora text-[#f0f6ff]">{about.degree}</div>
                  <div className="text-[#8fa3c0] text-sm mt-1">{about.college}</div>
                </div>
                <div className="bg-[#0a0f1e] border-2 border-[#1e2d4a] p-6 border-l-[3px] border-l-[#1A56DB]">
                  <div className="font-mono text-[11px] text-[#1A56DB] uppercase tracking-widest mb-1">Status</div>
                  <div className="font-sora text-[#f0f6ff]">{about.year}</div>
                  <div className="text-[#8fa3c0] text-sm mt-1">{about.location}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#0a0f1e] border-2 border-[#1A56DB] p-8 border-t-[4px] border-t-[#1A56DB]">
                <div className="font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-6">
                  // FAST_FACTS
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-[#1e2d4a] pb-4">
                    <span className="font-mono text-sm text-[#8fa3c0]">SGPA</span>
                    <span className="font-sora text-2xl font-bold text-[#4fcea6]">{about.sgpa}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1e2d4a] pb-4">
                    <span className="font-mono text-sm text-[#8fa3c0]">Projects</span>
                    <span className="font-sora text-2xl font-bold text-[#f0f6ff]">{about.projectsCount || '10+'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-[#8fa3c0]">Email</span>
                    <a href={`mailto:${about.email}`} className="font-mono text-sm text-[#1A56DB] underline hover:text-[#388bfd]">{about.email}</a>
                  </div>
                </div>
                {about.resumeUrl && (
                  <a 
                    href={about.resumeUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-8 bg-transparent text-[#f0f6ff] border-2 border-[#1A56DB] px-6 py-3 font-mono font-bold text-[12px] uppercase tracking-[0.1em] hover:bg-[#1A56DB] transition-colors text-center"
                  >
                    Download Resume PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
