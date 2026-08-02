import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { ArrowLeft, Plus, Trash2, Edit3, Clock, AlertCircle, CheckCircle2, Save, X } from 'lucide-react';

export default function TimelineAdmin() {
  const { data: initialTimeline, loading, error: fetchError } = useGitHubData('timeline.json');
  const [timeline, setTimeline] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (initialTimeline) {
      queueMicrotask(() => setTimeline(initialTimeline));
    } else if (!loading && fetchError && fetchError.message.includes('404')) {
      queueMicrotask(() => setTimeline([]));
    }
  }, [initialTimeline, loading, fetchError]);

  const handleAdd = () => {
    const newItem = {
      id: `timeline-${Date.now()}`,
      year: '2024 — Present',
      title: 'New Role / Education',
      org: 'Company / University',
      desc: 'Description of key responsibilities and achievements...',
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
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-8 font-mono-custom flex items-center justify-center">
      <div className="flex items-center gap-3 animate-pulse">
        <Clock className="w-5 h-5 text-[var(--accent-glow)]" />
        <span>Loading Experience Timeline...</span>
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
            <h1 className="text-2xl sm:text-3xl font-sora font-extrabold">Experience & Academic Timeline</h1>
          </div>
          
          <button
            onClick={handleAdd}
            className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold text-xs uppercase px-5 py-3 rounded-full hover:opacity-90 transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Timeline Entry</span>
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {fetchError && !fetchError.message.includes('404') && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{fetchError.message}</span>
          </div>
        )}
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Timeline saved to GitHub successfully!</span>
          </div>
        )}

        {/* Timeline Entries List */}
        <div className="space-y-6">
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
              <div 
                key={item.id} 
                className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl flex justify-between items-start hover:border-[var(--border-strong)] transition-all shadow-xl gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span>[{item.year}]</span>
                    {item.active && (
                      <span className="font-mono-custom text-[9px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-sora font-extrabold text-[var(--text-main)]">{item.title}</h3>
                  <div className="text-xs text-[var(--text-main)] font-bold">{item.org}</div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-1">{item.desc}</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setEditingId(item.id)} 
                    className="p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer"
                    title="Edit entry"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="p-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          ))}

          {timeline.length === 0 && (
            <div className="text-center text-[var(--text-muted)] py-16 border border-dashed border-[var(--border-subtle)] rounded-2xl space-y-3">
              <Clock className="w-8 h-8 mx-auto opacity-50 text-[var(--text-muted)]" />
              <div className="text-xs">No timeline entries found. Click "+ Add Timeline Entry" to create one.</div>
            </div>
          )}
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
    <div className="bg-[var(--card-bg)] border border-[var(--text-main)] p-6 rounded-2xl shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] text-xs text-[var(--text-main)] uppercase font-bold">
        <span>Edit Timeline Entry</span>
        <button onClick={onCancel} className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Year / Date Range</label>
            <input 
              name="year" 
              value={formData.year} 
              onChange={handleChange} 
              required 
              className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
            />
          </div>
          <div>
            <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Role / Degree Title</label>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Organization / School</label>
          <input 
            name="org" 
            value={formData.org} 
            onChange={handleChange} 
            required 
            className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
          />
        </div>

        <div>
          <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Description</label>
          <textarea 
            name="desc" 
            value={formData.desc} 
            onChange={handleChange} 
            required 
            rows={3} 
            className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl p-4 text-xs outline-none transition-colors resize-y" 
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text-main)]">
            <input 
              type="checkbox" 
              name="active" 
              checked={formData.active} 
              onChange={handleChange} 
              className="w-4 h-4 rounded accent-[var(--text-main)] cursor-pointer" 
            />
            <span>Active Status (e.g. Present / Ongoing)</span>
          </label>

          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-5 py-2 rounded-full border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold text-xs uppercase px-6 py-2.5 rounded-full hover:opacity-90 transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Entry</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
