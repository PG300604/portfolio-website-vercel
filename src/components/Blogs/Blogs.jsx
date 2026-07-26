import { useGitHubData } from '../../hooks/useGitHubData';
import { motion } from 'framer-motion';

export default function Blogs() {
  const { data: blogsData } = useGitHubData('blogs.json');
  const { data: visibility } = useGitHubData('visibility.json');

  if (visibility && !visibility.blogs) return null;
  if (!Array.isArray(blogsData) || blogsData.length === 0) return null;

  return (
    <section id="blogs" className="py-32 bg-[var(--bg-main)] relative z-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex justify-between items-end mb-16 pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
              [ WRITING & ARTICLES ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-sora font-extrabold text-[var(--text-main)]">
              Blog & Publications
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogsData.map((blog, idx) => (
            <motion.div
              key={blog.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              data-cursor="[ READ ARTICLE ]"
              className="bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] p-8 rounded-2xl transition-all"
            >
              <span className="font-mono-custom text-xs text-[var(--text-muted)] block mb-2">
                [{blog.date || '2026'}]
              </span>
              <h3 className="text-xl font-sora font-bold text-[var(--text-main)] mb-3">
                {blog.title}
              </h3>
              <p className="font-mono-custom text-xs text-[var(--text-muted)] leading-relaxed mb-6">
                {blog.excerpt || blog.description}
              </p>
              {blog.url && (
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-custom text-xs uppercase font-bold text-[var(--text-main)] hover:underline inline-flex items-center gap-1"
                >
                  <span>Read Full Post</span>
                  <span>↗</span>
                </a>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
