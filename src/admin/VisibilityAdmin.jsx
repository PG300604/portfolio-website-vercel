import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';

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

  if (loading || !visibility) return <div className="p-8 text-[#f0f6ff] bg-[#060a14] min-h-screen">Loading...</div>;

  const sections = [
    { key: 'hero', label: 'Hero Section' },
    { key: 'about', label: 'About Section' },
    { key: 'stack', label: 'Tech Stack Section' },
    { key: 'projects', label: 'Projects Section' },
    { key: 'certifications', label: 'Certifications Section' },
    { key: 'timeline', label: 'Experience Timeline Section' },
    { key: 'media', label: 'Media & Socials Section' },
    { key: 'blogs', label: 'Blogs & Events Section' },
    { key: 'contact', label: 'Contact Section' }
  ];

  return (
    <div className="min-h-screen bg-[#060a14] p-8 text-[#f0f6ff]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-2 border-[#1e2d4a] pb-6">
          <div>
            <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
              <Link to="/admin/dashboard" className="text-[#8fa3c0] hover:text-[#388bfd]">Dashboard</Link> / VISIBILITY
            </div>
            <h1 className="text-3xl font-sora font-bold">Manage Section Visibility</h1>
          </div>
        </div>

        {error && <div className="bg-[#2a0f0f] border-2 border-[#e55353] p-4 mb-6 text-[#e55353] font-mono text-sm">{error}</div>}
        {fetchError && <div className="bg-[#2a0f0f] border-2 border-[#e55353] p-4 mb-6 text-[#e55353] font-mono text-sm">{fetchError.message}</div>}
        {saving && <div className="bg-[#0d2a22] border-2 border-[#4fcea6] p-4 mb-6 text-[#4fcea6] font-mono text-sm">Saving to GitHub...</div>}

        <div className="bg-[#0d1525] border-2 border-[#1A56DB] p-6 border-t-[4px] border-t-[#1A56DB]">
          <p className="text-[#8fa3c0] font-mono text-sm mb-6 border-b border-[#1e2d4a] pb-4">
            Toggle which sections are visible on the public portfolio. Changes save automatically.
          </p>

          <div className="flex flex-col gap-4">
            {sections.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-4 border-2 border-[#1e2d4a] bg-[#060a14]">
                <span className="font-sora font-bold text-[#f0f6ff]">{label}</span>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={visibility[key]} 
                      onChange={(e) => handleChange(key, e.target.checked)} 
                    />
                    <div className={`block w-14 h-8 transition-colors ${visibility[key] ? 'bg-[#1A56DB]' : 'bg-[#1e2d4a]'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-[#f0f6ff] w-6 h-6 transition-transform ${visibility[key] ? 'transform translate-x-6' : ''}`}></div>
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
