import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';

export default function SkillsAdmin() {
  const { data: initialSkills, loading, error: fetchError } = useGitHubData('skills.json');
  const [skills, setSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // New skill form
  const [newSkill, setNewSkill] = useState({ id: '', name: '', category: 'frontend' });

  useEffect(() => {
    if (initialSkills) queueMicrotask(() => setSkills(initialSkills));
  }, [initialSkills]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSkill.id || !newSkill.name || !newSkill.category) return;
    
    const updated = [...skills, newSkill];
    setSkills(updated);
    setNewSkill({ id: '', name: '', category: 'frontend' });
    await saveToGitHub(updated);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    const updated = skills.filter(s => s.id !== id);
    setSkills(updated);
    await saveToGitHub(updated);
  };

  const saveToGitHub = async (dataToSave) => {
    setSaving(true);
    setError(null);
    try {
      await writeGitHubData('skills.json', dataToSave);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-[#f0f6ff] bg-[#060a14] min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#060a14] p-8 text-[#f0f6ff]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-2 border-[#1e2d4a] pb-6">
          <div>
            <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
              <Link to="/admin/dashboard" className="text-[#8fa3c0] hover:text-[#388bfd]">Dashboard</Link> / SKILLS
            </div>
            <h1 className="text-3xl font-sora font-bold">Manage Tech Stack</h1>
          </div>
        </div>

        {error && <div className="bg-[#2a0f0f] border-2 border-[#e55353] p-4 mb-6 text-[#e55353] font-mono text-sm">{error}</div>}
        {fetchError && <div className="bg-[#2a0f0f] border-2 border-[#e55353] p-4 mb-6 text-[#e55353] font-mono text-sm">{fetchError.message}</div>}
        {saving && <div className="bg-[#0d2a22] border-2 border-[#4fcea6] p-4 mb-6 text-[#4fcea6] font-mono text-sm">Saving to GitHub...</div>}

        <div className="bg-[#0d1525] border-2 border-[#1A56DB] p-6 mb-8 border-t-[4px] border-t-[#1A56DB]">
          <h3 className="font-mono text-[13px] text-[#1A56DB] uppercase tracking-widest mb-4">Add New Skill</h3>
          <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">ID (slug)</label>
              <input value={newSkill.id} onChange={e => setNewSkill({...newSkill, id: e.target.value})} placeholder="e.g. react" className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" required />
            </div>
            <div className="flex-1 w-full">
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Name</label>
              <input value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} placeholder="e.g. React 19" className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" required />
            </div>
            <div className="flex-1 w-full">
              <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Category</label>
              <input value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})} placeholder="e.g. frontend" className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" required />
            </div>
            <button type="submit" className="bg-[#1A56DB] text-[#f0f6ff] border-[3px] border-[#1A56DB] px-6 py-2 h-[40px] font-mono font-bold text-[12px] uppercase hover:bg-[#388bfd] transition-colors w-full md:w-auto">Add</button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(skill => (
            <div key={skill.id} className="bg-[#0d1525] border-2 border-[#1e2d4a] p-4 flex justify-between items-center hover:border-[#1A56DB] transition-colors">
              <div>
                <div className="font-sora font-bold">{skill.name}</div>
                <div className="font-mono text-[10px] text-[#8fa3c0] uppercase">{skill.category}</div>
              </div>
              <button onClick={() => handleDelete(skill.id)} className="text-[#e55353] hover:text-[#f0f6ff] font-mono text-sm border-b border-transparent hover:border-[#e55353]">Del</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
