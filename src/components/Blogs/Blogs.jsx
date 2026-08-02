import { useState } from 'react';
import { useGitHubData } from '../../hooks/useGitHubData';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import BlogModal from './BlogModal';
import ScrollFloat from '../ReactBits/ScrollFloat';

export default function Blogs() {
  const { data: blogsData } = useGitHubData('blogs.json');
  const { data: visibility } = useGitHubData('visibility.json');
  const [selectedBlog, setSelectedBlog] = useState(null);

  if (visibility && !visibility.blogs) return null;
  if (!Array.isArray(blogsData) || blogsData.length === 0) return null;

  return (
    <section id="blogs" className="py-16 sm:py-32 bg-[var(--bg-main)] relative z-10 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10 sm:mb-16 pb-4 sm:pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <span className="font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
              [ WRITING & ARTICLES ]
            </span>
            <ScrollFloat
              textClassName="text-2xl sm:text-3xl md:text-5xl font-sora font-extrabold text-[var(--text-main)]"
              animationDuration={1}
              stagger={0.03}
            >
              Blog & Publications
            </ScrollFloat>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {blogsData.map((blog, idx) => {
            const displayImage = blog.image || blog.coverImage;
            const contentText = blog.content || blog.excerpt || blog.description || "";

            return (
              <motion.div
                key={blog.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => setSelectedBlog(blog)}
                data-cursor="[ READ ARTICLE ]"
                className="group bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] p-5 sm:p-7 rounded-2xl transition-all shadow-xl flex flex-col justify-between cursor-pointer space-y-4"
              >
                <div className="space-y-4">
                  {/* Cover Image Preview */}
                  {displayImage && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-[var(--bg-main)] border border-[var(--border-subtle)] relative">
                      <img 
                        src={displayImage} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}

                  {/* Date Badge */}
                  <div className="flex items-center gap-2 font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider">
                    <Calendar className="w-3 h-3 text-[var(--accent-glow)] shrink-0" />
                    <span>[{blog.date || '2026'}]</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-sora font-extrabold text-[var(--text-main)] leading-snug group-hover:text-[var(--text-main)] transition-colors">
                    {blog.title}
                  </h3>

                  {/* Content Preview Snippet */}
                  {contentText && (
                    <p className="font-mono-custom text-[11px] sm:text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                      {contentText}
                    </p>
                  )}
                </div>

                {/* Card Footer Button */}
                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between font-mono-custom text-[10px] sm:text-xs uppercase font-bold text-[var(--text-main)]">
                  <span>Read Article</span>
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Full Story</span>
                    <span>→</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Full Article Lightbox Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <BlogModal 
            blog={selectedBlog} 
            onClose={() => setSelectedBlog(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
