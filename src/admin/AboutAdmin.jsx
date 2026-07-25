import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';

export default function AboutAdmin() {
  const { data: initialAbout, loading, error: fetchError } = useGitHubData('about.json');
  const [about, setAbout] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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
      alert('Saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !about) return <div className="p-8 text-[#f0f6ff] bg-[#060a14] min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#060a14] p-8 text-[#f0f6ff]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-2 border-[#1e2d4a] pb-6">
          <div>
            <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
              <Link to="/admin/dashboard" className="text-[#8fa3c0] hover:text-[#388bfd]">Dashboard</Link> / ABOUT
            </div>
            <h1 className="text-3xl font-sora font-bold">Manage About Data</h1>
          </div>
        </div>

        {error && <div className="bg-[#2a0f0f] border-2 border-[#e55353] p-4 mb-6 text-[#e55353] font-mono text-sm">{error}</div>}
        {fetchError && <div className="bg-[#2a0f0f] border-2 border-[#e55353] p-4 mb-6 text-[#e55353] font-mono text-sm">{fetchError.message}</div>}
        
        <form onSubmit={handleSave} className="bg-[#0d1525] border-2 border-[#1A56DB] p-6 border-t-[4px] border-t-[#1A56DB] flex flex-col gap-6">
          <div>
            <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">Bio</label>
            <textarea name="bio" value={about.bio || ''} onChange={handleChange} rows={5} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-3 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">SGPA</label>
              <input name="sgpa" value={about.sgpa || ''} onChange={handleChange} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-3 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">College</label>
              <input name="college" value={about.college || ''} onChange={handleChange} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-3 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">Degree</label>
              <input name="degree" value={about.degree || ''} onChange={handleChange} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-3 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">Year / Status</label>
              <input name="year" value={about.year || ''} onChange={handleChange} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-3 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">Location</label>
              <input name="location" value={about.location || ''} onChange={handleChange} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-3 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">Projects Count (Fast Facts)</label>
              <input name="projectsCount" value={about.projectsCount || ''} onChange={handleChange} placeholder="e.g. 10+" className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-3 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">Email</label>
              <input name="email" value={about.email || ''} onChange={handleChange} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-3 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">Hero Typing Roles (comma separated)</label>
            <input name="heroRoles" value={about.heroRoles || ''} onChange={handleChange} placeholder="e.g. Full Stack Developer, Spring Boot Expert" className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-3 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">LinkedIn URL</label>
              <input name="linkedin" value={about.linkedin || ''} onChange={handleChange} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-3 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">GitHub URL</label>
              <input name="github" value={about.github || ''} onChange={handleChange} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-3 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="mt-4 bg-[#1A56DB] text-[#f0f6ff] border-[3px] border-[#1A56DB] px-8 py-3 font-mono font-bold text-[13px] uppercase tracking-[0.1em] hover:bg-[#388bfd] hover:border-[#388bfd] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
