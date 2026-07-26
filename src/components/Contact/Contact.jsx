import { useState } from 'react';
import { useGitHubData } from '../../hooks/useGitHubData';
import ScrollFloat from '../ReactBits/ScrollFloat';

export default function Contact() {
  const { data: visibility } = useGitHubData('visibility.json');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(false);

  if (visibility && !visibility.contact) return null;

  const emailAddress = "priyanshughosh97@gmail.com";

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
    <section id="contact" className="py-32 bg-[var(--bg-main)] relative z-10 border-t border-[var(--border-subtle)] pb-44">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header with React Bits ScrollFloat */}
        <div className="flex justify-between items-end mb-16 pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest block mb-2">
              [ 04 / CONTACT ]
            </span>
            <ScrollFloat
              textClassName="text-3xl sm:text-5xl font-sora font-extrabold text-[var(--text-main)]"
              animationDuration={1}
              stagger={0.03}
            >
              Let’s shape something precise.
            </ScrollFloat>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-8 rounded-2xl space-y-6">
              <span className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest block">
                // DIRECT INQUIRIES
              </span>
              <p className="font-mono-custom text-xs text-[var(--text-muted)] leading-relaxed">
                Open for full-stack engineering roles, product software contracts, and technical collaborations worldwide.
              </p>

              {/* Email Pill */}
              <div className="bg-[var(--bg-main)] border border-[var(--border-subtle)] p-4 rounded-xl space-y-2">
                <span className="font-mono-custom text-xs text-[var(--text-muted)] block">EMAIL:</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-custom text-xs text-[var(--text-main)] truncate">{emailAddress}</span>
                  <button
                    onClick={handleCopyEmail}
                    data-cursor="[ COPY ]"
                    className="font-mono-custom text-xs bg-[var(--text-main)] text-[var(--bg-main)] font-bold px-3 py-1 rounded-md hover:opacity-90 transition-opacity"
                  >
                    {copied ? '[ COPIED ]' : '[ COPY ]'}
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-3 font-mono-custom text-xs">
                <a
                  href="https://linkedin.com/in/priyanshu-ghosh-"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="[ LINKEDIN ]"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[var(--border-strong)] transition-colors text-[var(--text-main)]"
                >
                  <span>LinkedIn Profile</span>
                  <span>↗</span>
                </a>

                <a
                  href="https://github.com/PG300604"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="[ GITHUB ]"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[var(--border-strong)] transition-colors text-[var(--text-main)]"
                >
                  <span>GitHub Repositories</span>
                  <span>↗</span>
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-8 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    [ YOUR NAME ]
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name..."
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-xl p-4 font-mono-custom text-xs focus:border-[var(--text-main)] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    [ EMAIL ADDRESS ]
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="name@company.com"
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-xl p-4 font-mono-custom text-xs focus:border-[var(--text-main)] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    [ MESSAGE ]
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Write a message..."
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-xl p-4 font-mono-custom text-xs focus:border-[var(--text-main)] focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  data-cursor="[ SEND MESSAGE ]"
                  className="w-full font-mono-custom text-xs uppercase tracking-widest font-bold bg-[var(--text-main)] text-[var(--bg-main)] py-4 rounded-xl hover:opacity-90 transition-opacity"
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
