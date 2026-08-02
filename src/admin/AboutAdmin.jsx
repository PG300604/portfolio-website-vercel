import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { ArrowLeft, Save, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AboutAdmin() {
  const { data: initialAbout, loading, error: fetchError } = useGitHubData('about.json');
  const [about, setAbout] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialAbout) queueMicrotask(() => setAbout(initialAbout));
  }, [initialAbout]);

  const handleChange = (e) => {
    setAbout({ ...about, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await writeGitHubData('about.json', about);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !about) return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-8 font-mono-custom flex items-center justify-center">
      <div className="flex items-center gap-3 animate-pulse">
        <User className="w-5 h-5 text-[var(--accent-glow)]" />
        <span>Loading Biography & Specifications...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 sm:p-8 font-mono-custom">
      <div className="max-w-5xl mx-auto space-y-8">
        
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
            <h1 className="text-2xl sm:text-3xl font-sora font-extrabold">Biography & Specifications</h1>
          </div>
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">[ PUBLIC PROFILE METRICS ]</span>
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
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>About data saved to GitHub successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl shadow-xl space-y-6">
          <div>
            <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Biography Statement</label>
            <textarea 
              name="bio" 
              value={about.bio || ''} 
              onChange={handleChange} 
              rows={5} 
              className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl p-4 text-xs outline-none transition-colors leading-relaxed" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">SGPA / Academic Grade</label>
              <input 
                name="sgpa" 
                value={about.sgpa || ''} 
                onChange={handleChange} 
                className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">College / Institution</label>
              <input 
                name="college" 
                value={about.college || ''} 
                onChange={handleChange} 
                className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Degree Specialty</label>
              <input 
                name="degree" 
                value={about.degree || ''} 
                onChange={handleChange} 
                className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Academic Status / Year</label>
              <input 
                name="year" 
                value={about.year || ''} 
                onChange={handleChange} 
                className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Primary Location</label>
              <input 
                name="location" 
                value={about.location || ''} 
                onChange={handleChange} 
                className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Projects Metric Badge</label>
              <input 
                name="projectsCount" 
                value={about.projectsCount || ''} 
                onChange={handleChange} 
                placeholder="e.g. 12+" 
                className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Email Address</label>
              <input 
                name="email" 
                value={about.email || ''} 
                onChange={handleChange} 
                className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Hero Section Typing Roles (Comma-Separated)</label>
            <input 
              name="heroRoles" 
              value={about.heroRoles || ''} 
              onChange={handleChange} 
              placeholder="e.g. Full Stack Engineer, Java Spring Boot Specialist, UI Architect" 
              className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">LinkedIn URL</label>
              <input name="linkedin" value={about.linkedin || ''} onChange={handleChange} className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl p-3 font-mono text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">GitHub URL</label>
              <input name="github" value={about.github || ''} onChange={handleChange} className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl p-3 font-mono text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">Instagram URL</label>
              <input name="instagram" value={about.instagram || ''} onChange={handleChange} placeholder="e.g. https://instagram.com/priyanshughosh__" className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl p-3 font-mono text-sm focus:outline-none" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[var(--border-subtle)]">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold text-xs uppercase px-8 py-3 rounded-full hover:opacity-90 transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save About Data'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
