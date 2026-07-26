import { motion } from 'framer-motion';
import { useGitHubData } from '../../hooks/useGitHubData';

export default function Timeline() {
  const { data: timelineData } = useGitHubData('timeline.json');
  const { data: visibility } = useGitHubData('visibility.json');

  if (visibility && !visibility.timeline) return null;

  const defaultTimeline = [
    {
      id: 't1',
      year: '2024 — PRESENT',
      title: 'Full-Stack Developer & CS Undergrad',
      org: 'Techno Main Salt Lake',
      desc: 'Architecting distributed Java microservices, Spring Boot backends, and responsive React web applications.',
      active: true
    },
    {
      id: 't2',
      year: '2023 — 2024',
      title: 'Systems & Data Structures Practice',
      org: 'Independent Engineering',
      desc: 'Mastering algorithm design, concurrency models, and object-oriented architecture principles.',
      active: false
    }
  ];

  const timeline = timelineData || defaultTimeline;

  return (
    <section id="experience" className="py-32 bg-[var(--bg-main)] relative z-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-16 pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
              [ JOURNEY & TIMELINE ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-sora font-extrabold text-[var(--text-main)]">
              Experience & History
            </h2>
          </div>
        </div>

        <div className="relative pl-6 sm:pl-10 space-y-12 border-l border-[var(--border-subtle)]">
          {timeline.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              data-cursor="[ EXPERIENCE ]"
              className="relative group pl-6"
            >
              {/* Node Indicator */}
              <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[var(--bg-main)] border-2 border-[var(--text-main)] flex items-center justify-center">
                {item.active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </div>

              <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] p-8 rounded-2xl transition-all">
                <span className="font-mono-custom text-xs text-[var(--text-muted)] block mb-2">
                  [{item.year}]
                </span>
                <h3 className="text-xl font-sora font-bold text-[var(--text-main)] mb-1">
                  {item.title}
                </h3>
                <div className="font-mono-custom text-xs text-[var(--text-main)] font-bold mb-4">
                  {item.org}
                </div>
                <p className="font-mono-custom text-xs text-[var(--text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
