import { useState } from 'react';
import { useGitHubData } from '../../hooks/useGitHubData';
import ScrollFloat from '../ReactBits/ScrollFloat';
import { ExternalLink, Copy, Check, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Contact() {
  const { data: visibility } = useGitHubData('visibility.json');
  const { data: aboutData } = useGitHubData('about.json');
  const { data: mediaData } = useGitHubData('media.json');
  
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(false);

  if (visibility && !visibility.contact) return null;

  const emailAddress = aboutData?.email || "priyanshughosh97@gmail.com";
  const linkedinUrl = aboutData?.linkedin || "https://linkedin.com/in/priyanshu-ghosh-";
  const githubUrl = aboutData?.github || "https://github.com/PG300604";
  const instagramUrl = aboutData?.instagram || (mediaData?.profiles && mediaData.profiles[0]?.instagram) || "https://instagram.com/";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <section id="contact" className="py-16 sm:py-32 bg-[var(--bg-main)] relative z-10 border-t border-[var(--border-subtle)] pb-44">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10 sm:mb-16 pb-4 sm:pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <span className="font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
              [ 04 / CONTACT & SOCIALS ]
            </span>
            <ScrollFloat
              textClassName="text-2xl sm:text-3xl md:text-5xl font-sora font-extrabold text-[var(--text-main)]"
              animationDuration={1}
              stagger={0.03}
            >
              Let’s shape something precise.
            </ScrollFloat>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          
          {/* Left Column: Direct Inquiries & Social Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 sm:p-8 rounded-2xl sm:rounded-3xl space-y-6 shadow-xl">
              <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest block font-bold">
                // DIRECT INQUIRIES & SOCIALS
              </span>
              <p className="font-mono-custom text-xs text-[var(--text-muted)] leading-relaxed">
                Open for full-stack engineering roles, product software contracts, and technical collaborations worldwide. Connect across any of my official social channels below.
              </p>

              {/* Email Pill */}
              <div className="bg-[var(--bg-main)] border border-[var(--border-subtle)] p-4 rounded-xl space-y-2">
                <span className="font-mono-custom text-[10px] sm:text-xs text-[var(--text-muted)] block font-bold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[var(--accent-glow)]" />
                  <span>EMAIL ADDRESS</span>
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-custom text-xs text-[var(--text-main)] truncate font-bold">{emailAddress}</span>
                  <button
                    onClick={handleCopyEmail}
                    data-cursor="[ COPY ]"
                    className="font-mono-custom text-[10px] sm:text-xs bg-[var(--text-main)] text-[var(--bg-main)] font-bold px-3 py-1 rounded-md hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
                  >
                    {copied ? '[ COPIED ]' : '[ COPY ]'}
                  </button>
                </div>
              </div>

              {/* Social Links Cards */}
              <div className="space-y-2.5 font-mono-custom text-xs">
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="[ LINKEDIN ]"
                    className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[var(--border-strong)] transition-all text-[var(--text-main)] group shadow-md"
                  >
                    <div className="flex items-center gap-2.5">
                      <FaLinkedin className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold">LinkedIn Profile</span>
                    </div>
                    <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </a>
                )}

                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="[ GITHUB ]"
                    className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[var(--border-strong)] transition-all text-[var(--text-main)] group shadow-md"
                  >
                    <div className="flex items-center gap-2.5">
                      <FaGithub className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold">GitHub Repositories</span>
                    </div>
                    <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </a>
                )}

                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="[ INSTAGRAM ]"
                    className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[var(--border-strong)] transition-all text-[var(--text-main)] group shadow-md"
                  >
                    <div className="flex items-center gap-2.5">
                      <FaInstagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold">Instagram Media</span>
                    </div>
                    <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </a>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">
                    [ YOUR NAME ]
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name..."
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-xl p-3.5 sm:p-4 font-mono-custom text-xs focus:border-[var(--text-main)] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">
                    [ EMAIL ADDRESS ]
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="name@company.com"
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-xl p-3.5 sm:p-4 font-mono-custom text-xs focus:border-[var(--text-main)] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">
                    [ MESSAGE ]
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Write a message..."
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-xl p-3.5 sm:p-4 font-mono-custom text-xs focus:border-[var(--text-main)] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  data-cursor="[ SEND MESSAGE ]"
                  className="w-full font-mono-custom text-xs uppercase tracking-widest font-bold bg-[var(--text-main)] text-[var(--bg-main)] py-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
                >
                  {status === 'loading' ? '[ SENDING... ]' : '[ SEND MESSAGE ]'}
                </button>

                {status === 'success' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/40 p-4 text-emerald-400 font-mono-custom text-xs rounded-xl text-center">
                    ✓ Message received! Thank you.
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
