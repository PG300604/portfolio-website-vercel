import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { ArrowLeft, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VisibilityAdmin() {
  const { data: initialVisibility, loading, error: fetchError } = useGitHubData('visibility.json');
  const [visibility, setVisibility] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialVisibility) queueMicrotask(() => setVisibility(initialVisibility));
  }, [initialVisibility]);

  const handleChange = async (key, value) => {
    const updated = { ...visibility, [key]: value };
    setVisibility(updated);
    
    setSaving(true);
    setError(null);
    try {
      await writeGitHubData('visibility.json', updated);
    } catch (err) {
      setError(err.message);
      setVisibility(visibility); // revert on error
    } finally {
      setSaving(false);
    }
  };

  if (loading || !visibility) return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-8 font-mono-custom flex items-center justify-center">
      <div className="flex items-center gap-3 animate-pulse">
        <Eye className="w-5 h-5 text-[var(--accent-glow)]" />
        <span>Loading Section Visibility Settings...</span>
      </div>
    </div>
  );

  const sections = [
    { key: 'hero', label: 'Hero Section' },
    { key: 'about', label: 'About & Specifications Section' },
    { key: 'stack', label: 'Technical Stack & Practice Section' },
    { key: 'projects', label: 'Selected Projects & 3D Stage Section' },
    { key: 'certifications', label: 'Certifications & Badges Section' },
    { key: 'timeline', label: 'Experience & Academic History Section' },
    { key: 'media', label: 'Media Gallery & Socials Section' },
    { key: 'blogs', label: 'Blogs & Events Section' },
    { key: 'contact', label: 'Initiate Collaboration Contact Section' }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 sm:p-8 font-mono-custom">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[var(--border-subtle)] gap-4">
          <div>
            <Link 
              to="/admin/dashboard" 
              className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors mb-2 uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-sora font-extrabold">Section Visibility Controls</h1>
          </div>
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">[ AUTOMATIC INSTANT SYNC ]</span>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {fetchError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{fetchError.message}</span>
          </div>
        )}

        <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl shadow-xl space-y-6">
          <p className="text-xs text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-4 leading-relaxed">
            Toggle which public sections are visible or hidden on your main portfolio website. Changes save automatically and sync instantly to GitHub.
          </p>

          <div className="space-y-3">
            {sections.map(({ key, label }) => (
              <div 
                key={key} 
                className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[var(--border-strong)] transition-all"
              >
                <div className="flex items-center gap-3 font-sora font-bold text-sm text-[var(--text-main)]">
                  {visibility[key] ? (
                    <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                  )}
                  <span>{label}</span>
                </div>

                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={!!visibility[key]} 
                      onChange={(e) => handleChange(key, e.target.checked)} 
                    />
                    <div className={`block w-12 h-7 rounded-full transition-colors ${visibility[key] ? 'bg-[var(--text-main)]' : 'bg-[var(--card-bg)] border border-[var(--border-subtle)]'}`}></div>
                    <div className={`dot absolute left-1 top-1 w-5 h-5 rounded-full transition-transform ${visibility[key] ? 'transform translate-x-5 bg-[var(--bg-main)]' : 'bg-[var(--text-muted)]'}`}></div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
