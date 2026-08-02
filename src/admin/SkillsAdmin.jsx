import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { ArrowLeft, Plus, Trash2, Cpu, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SkillsAdmin() {
  const { data: initialSkills, loading, error: fetchError } = useGitHubData('skills.json');
  const [skills, setSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // New skill form
  const [newSkill, setNewSkill] = useState({ id: '', name: '', category: 'Backend Architecture' });

  useEffect(() => {
    if (initialSkills) queueMicrotask(() => setSkills(initialSkills));
  }, [initialSkills]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSkill.id || !newSkill.name || !newSkill.category) return;
    
    const updated = [...skills, newSkill];
    setSkills(updated);
    setNewSkill({ id: '', name: '', category: 'Backend Architecture' });
    await saveToGitHub(updated);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill entry?')) return;
    const updated = skills.filter(s => s.id !== id);
    setSkills(updated);
    await saveToGitHub(updated);
  };

  const saveToGitHub = async (dataToSave) => {
    setSaving(true);
    setError(null);
    try {
      await writeGitHubData('skills.json', dataToSave);
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
        <Cpu className="w-5 h-5 text-[var(--accent-glow)]" />
        <span>Loading Technical Stack...</span>
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
            <h1 className="text-2xl sm:text-3xl font-sora font-extrabold">Technical Stack Management</h1>
          </div>
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">[ {skills.length} SKILLS TOTAL ]</span>
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
            <span>Skills saved to GitHub successfully!</span>
          </div>
        )}

        {/* Add Skill Form Card */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">
            <Plus className="w-4 h-4 text-[var(--accent-glow)]" />
            <span>Add New Technical Skill</span>
          </div>

          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Skill Slug / ID</label>
              <input 
                value={newSkill.id} 
                onChange={e => setNewSkill({...newSkill, id: e.target.value})} 
                placeholder="e.g. react-19" 
                className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
                required 
              />
            </div>
            <div>
              <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Display Name</label>
              <input 
                value={newSkill.name} 
                onChange={e => setNewSkill({...newSkill, name: e.target.value})} 
                placeholder="e.g. React 19 & Next.js" 
                className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
                required 
              />
            </div>
            <div>
              <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Category Module</label>
              <input 
                value={newSkill.category} 
                onChange={e => setNewSkill({...newSkill, category: e.target.value})} 
                placeholder="e.g. Interface Systems" 
                className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
                required 
              />
            </div>
            
            <div className="md:col-span-3 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold text-xs uppercase px-6 py-3 rounded-full hover:opacity-90 transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{saving ? 'Adding...' : 'Add Skill'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(skill => (
            <div key={skill.id} className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-5 rounded-2xl flex justify-between items-center hover:border-[var(--border-strong)] transition-all shadow-lg">
              <div>
                <div className="font-sora font-extrabold text-sm text-[var(--text-main)] mb-1">{skill.name}</div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">[{skill.category}]</div>
              </div>
              <button 
                onClick={() => handleDelete(skill.id)} 
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Delete skill"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
