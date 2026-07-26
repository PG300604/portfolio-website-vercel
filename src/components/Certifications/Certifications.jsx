import { useGitHubData } from '../../hooks/useGitHubData';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';

export default function Certifications() {
  const { data: certsData } = useGitHubData('certifications.json');
  const { data: visibility } = useGitHubData('visibility.json');

  if (visibility && !visibility.certifications) return null;

  const defaultCerts = [
    {
      id: 'c1',
      name: 'Java SE 17 Developer Certification',
      org: 'Oracle',
      issuedBy: 'Oracle University',
      date: '2025',
      featured: true,
      credentialId: 'ORC-8930211'
    },
    {
      id: 'c2',
      name: 'Spring Certified Professional',
      org: 'VMware Tanzu',
      issuedBy: 'VMware',
      date: '2025',
      featured: false,
      credentialId: 'VMW-554201'
    }
  ];

  const certs = certsData || defaultCerts;

  return (
    <section id="certifications" className="py-16 sm:py-32 bg-[var(--bg-main)] relative z-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10 sm:mb-16 pb-4 sm:pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <span className="font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
              [ CREDENTIALS & ACCOMPLISHMENTS ]
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-sora font-extrabold text-[var(--text-main)]">
              Certifications & Badges
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              data-cursor="[ CERTIFICATE ]"
              className="bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] p-5 sm:p-8 rounded-xl sm:rounded-2xl transition-all"
            >
              <div className="flex justify-between items-start gap-3 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <span className="font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] block mb-1">
                    [ 0{idx + 1} ]
                  </span>
                  <h3 className="text-base sm:text-xl font-sora font-bold text-[var(--text-main)]">
                    {cert.name}
                  </h3>
                </div>
                {cert.featured && (
                  <span className="font-mono-custom text-[9px] sm:text-[10px] uppercase font-bold bg-[var(--text-main)] text-[var(--bg-main)] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap shrink-0">
                    FEATURED
                  </span>
                )}
              </div>

              <div className="font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] space-y-1 sm:space-y-1.5 mb-4 sm:mb-6">
                <div>ORGANIZATION: <span className="text-[var(--text-main)] font-bold">{cert.org}</span></div>
                <div>ISSUER: <span className="text-[var(--text-main)]">{cert.issuedBy}</span></div>
                <div>DATE: <span>{cert.date}</span></div>
              </div>

              {cert.credentialId && (
                <div className="font-mono-custom text-[10px] sm:text-[11px] text-[var(--text-muted)] pt-3 sm:pt-4 border-t border-[var(--border-subtle)]">
                  CREDENTIAL ID: {cert.credentialId}
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
