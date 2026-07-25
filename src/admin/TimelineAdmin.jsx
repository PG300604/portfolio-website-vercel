import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';

export default function TimelineAdmin() {
  const { data: initialTimeline, loading, error: fetchError } = useGitHubData('timeline.json');
  const [timeline, setTimeline] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Initialize with some default if file doesn't exist
  useEffect(() => {
    if (initialTimeline) {
      queueMicrotask(() => setTimeline(initialTimeline));
    } else if (!loading && fetchError && fetchError.message.includes('404')) {
      // Create an empty array if file is missing
      queueMicrotask(() => setTimeline([]));
    }
  }, [initialTimeline, loading, fetchError]);

  const handleAdd = () => {
    const newItem = {
      id: `timeline-${Date.now()}`,
      year: '2024 - Present',
      title: 'New Role / Education',
      org: 'Company / University',
      desc: 'Description of what you did...',
      active: true
    };
    setTimeline([newItem, ...timeline]);
    setEditingId(newItem.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this timeline entry?')) return;
    const updated = timeline.filter(t => t.id !== id);
    setTimeline(updated);
    await saveToGitHub(updated);
  };

  const handleSave = async (updatedItem) => {
    const updated = timeline.map(t => t.id === updatedItem.id ? updatedItem : t);
    setTimeline(updated);
    setEditingId(null);
    await saveToGitHub(updated);
  };

  const saveToGitHub = async (dataToSave) => {
    setSaving(true);
    setError(null);
    try {
      await writeGitHubData('timeline.json', dataToSave);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-[#f0f6ff] bg-[#060a14] min-h-screen">Loading timeline...</div>;

  return (
    <div className="min-h-screen bg-[#060a14] p-8 text-[#f0f6ff]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-2 border-[#1e2d4a] pb-6">
          <div>
            <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
              <Link to="/admin/dashboard" className="text-[#8fa3c0] hover:text-[#388bfd]">Dashboard</Link> / TIMELINE
            </div>
            <h1 className="text-3xl font-sora font-bold">Manage Experience</h1>
          </div>
          <button
            onClick={handleAdd}
            className="bg-[#1A56DB] text-[#f0f6ff] border-[3px] border-[#1A56DB] px-5 py-2 font-mono font-bold text-[12px] uppercase tracking-[0.1em] hover:bg-[#388bfd] hover:border-[#388bfd] transition-colors rounded-none"
          >
            + Add Entry
          </button>
        </div>

        {error && <div className="bg-[#2a0f0f] border-2 border-[#e55353] p-4 mb-6 text-[#e55353] font-mono text-sm">{error}</div>}
        {fetchError && !fetchError.message.includes('Not Found') && !fetchError.message.includes('404') && <div className="bg-[#2a0f0f] border-2 border-[#e55353] p-4 mb-6 text-[#e55353] font-mono text-sm">{fetchError.message}</div>}
        {saving && <div className="bg-[#0d2a22] border-2 border-[#4fcea6] p-4 mb-6 text-[#4fcea6] font-mono text-sm">Saving to GitHub...</div>}

        <div className="flex flex-col gap-6">
          {timeline.map(item => (
            editingId === item.id ? (
              <TimelineEditor 
                key={item.id}
                item={item}
                onSave={handleSave}
                onCancel={() => {
                  setEditingId(null);
                  if (item.title === 'New Role / Education') {
                    setTimeline(timeline.filter(t => t.id !== item.id));
                  }
                }}
              />
            ) : (
              <div key={item.id} className="bg-[#0d1525] border-2 border-[#1e2d4a] p-6 flex justify-between items-start hover:border-[#1A56DB] transition-colors">
                <div>
                  <div className="font-mono text-[13px] text-[#8fa3c0] mb-2">
                    {item.year}
                    {item.active && <span className="ml-3 bg-[#0d2a22] text-[#4fcea6] border border-[#4fcea6] text-[10px] uppercase font-mono px-2 py-0.5">Active</span>}
                  </div>
                  <h3 className="text-xl font-sora font-bold mb-1">{item.title}</h3>
                  <div className="text-[#1A56DB] font-mono text-sm mb-3">{item.org}</div>
                  <p className="text-[#8fa3c0] text-sm">{item.desc}</p>
                </div>
                <div className="flex flex-col gap-3 ml-4 shrink-0">
                  <button onClick={() => setEditingId(item.id)} className="bg-transparent border-2 border-[#1A56DB] text-[#f0f6ff] font-mono uppercase text-[11px] px-4 py-2 hover:bg-[#1A56DB]">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="bg-transparent border-2 border-[#e55353] text-[#e55353] font-mono uppercase text-[11px] px-4 py-2 hover:bg-[#e55353] hover:text-[#f0f6ff]">Delete</button>
                </div>
              </div>
            )
          ))}
          {timeline.length === 0 && <div className="text-center text-[#8fa3c0] py-12 border-2 border-dashed border-[#1e2d4a]">No timeline entries found.</div>}
        </div>
      </div>
    </div>
  );
}

function TimelineEditor({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState(item);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-[#0d1525] border-2 border-[#388bfd] p-6 border-t-[4px] border-t-[#388bfd]">
      <h3 className="font-mono text-[13px] text-[#388bfd] uppercase tracking-widest mb-4">Edit Entry</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Year / Range</label>
            <input name="year" value={formData.year} onChange={handleChange} required className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
          </div>
          <div>
            <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Organization / School</label>
          <input name="org" value={formData.org} onChange={handleChange} required className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
        </div>

        <div>
          <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Description</label>
          <textarea name="desc" value={formData.desc} onChange={handleChange} required rows={3} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
        </div>

        <div className="mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-4 h-4 accent-[#4fcea6]" />
            <span className="font-mono text-sm text-[#f0f6ff]">Active Status (e.g. Current Job)</span>
          </label>
        </div>

        <div className="flex justify-end gap-4 mt-4 border-t border-[#1e2d4a] pt-4">
          <button type="button" onClick={onCancel} className="bg-transparent text-[#8fa3c0] font-mono uppercase text-[12px] px-4 py-2 hover:text-[#f0f6ff]">Cancel</button>
          <button type="submit" className="bg-[#4fcea6] text-[#0d2a22] font-mono font-bold uppercase text-[12px] px-6 py-2 hover:bg-[#3db892]">Save Entry</button>
        </div>
      </form>
    </div>
  );
}
