import { motion } from 'framer-motion';
import { useGitHubData } from '../../hooks/useGitHubData';

export default function Timeline() {
  const { data: timelineData } = useGitHubData('timeline.json');
  const { data: visibility } = useGitHubData('visibility.json');

  if (visibility && !visibility.timeline) return null;

  const defaultTimeline = [
    {
      id: 't1',
      year: '2023 — 2027',
      title: 'B.Tech in Computer Science & Business Systems',
      org: 'Asansol Engineering College',
      desc: 'Focused on Full Stack Development, Java Spring Boot Microservices, DSA, and System Design.',
      active: true
    },
    {
      id: 't2',
      year: '2018 — 2023',
      title: 'Secondary (10th) & Sr. Secondary (12th)',
      org: 'Carmel Convent School — Giridih',
      desc: 'Completed secondary and higher secondary education with distinction in Science & Mathematics.',
      active: false
    },
    {
      id: 't3',
      year: '2008 — 2018',
      title: 'Primary & Middle School',
      org: 'Carmel Convent School — Giridih',
      desc: 'Completed elementary education under ICSE background, building foundational communication and analytical skills.',
      active: false
    }
  ];

  const rawTimeline = timelineData || defaultTimeline;

  // Sort timeline chronologically in reverse (most recent first)
  const timeline = [...rawTimeline].sort((a, b) => {
    const getStartYear = (str) => {
      const match = (str || '').match(/\d{4}/);
      return match ? parseInt(match[0], 10) : 0;
    };
    return getStartYear(b.year) - getStartYear(a.year);
  });

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
              Experience & Academic History
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
                {item.active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              </div>

              <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] p-8 rounded-2xl transition-all shadow-xl">
                <div className="flex items-center justify-between font-mono-custom text-xs text-[var(--text-muted)] mb-2">
                  <span>[{item.year}]</span>
                  {item.active && <span className="text-emerald-400 font-bold">[ PRESENT ]</span>}
                </div>
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
