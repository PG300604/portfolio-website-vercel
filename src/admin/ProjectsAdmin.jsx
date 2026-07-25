import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import ImageUploader from '../components/shared/ImageUploader';

export default function ProjectsAdmin() {
  const { data: initialProjects, loading: dataLoading, error: fetchError } = useGitHubData('projects.json');
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialProjects) {
      queueMicrotask(() => setProjects(initialProjects));
    }
  }, [initialProjects]);

  const handleAdd = () => {
    const newProject = {
      id: `project-${Date.now()}`,
      title: 'New Project',
      description: 'Project description...',
      longDescription: '',
      stack: ['React', 'Tailwind'],
      liveUrl: '',
      githubUrl: '',
      imageUrl: '',
      featured: false,
      visible: true
    };
    setProjects([newProject, ...projects]);
    setEditingId(newProject.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    await saveToGitHub(updated);
  };

  const handleSave = async (updatedProject) => {
    const updated = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(updated);
    setEditingId(null);
    await saveToGitHub(updated);
  };

  const saveToGitHub = async (dataToSave) => {
    setSaving(true);
    setError(null);
    try {
      await writeGitHubData('projects.json', dataToSave);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (dataLoading) return <div className="p-8 text-[#f0f6ff] bg-[#060a14] min-h-screen">Loading projects...</div>;
  if (fetchError) return <div className="p-8 text-[#e55353] bg-[#060a14] min-h-screen">Error loading: {fetchError.message}</div>;

  return (
    <div className="min-h-screen bg-[#060a14] p-8 text-[#f0f6ff]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-2 border-[#1e2d4a] pb-6">
          <div>
            <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
              <Link to="/admin/dashboard" className="text-[#8fa3c0] hover:text-[#388bfd]">Dashboard</Link> / PROJECTS
            </div>
            <h1 className="text-3xl font-sora font-bold">Manage Projects</h1>
          </div>
          <button
            onClick={handleAdd}
            className="bg-[#1A56DB] text-[#f0f6ff] border-[3px] border-[#1A56DB] px-5 py-2 font-mono font-bold text-[12px] uppercase tracking-[0.1em] hover:bg-[#388bfd] hover:border-[#388bfd] transition-colors rounded-none"
          >
            + Add Project
          </button>
        </div>

        {error && <div className="bg-[#2a0f0f] border-2 border-[#e55353] p-4 mb-6 text-[#e55353] font-mono text-sm">{error}</div>}
        {saving && <div className="bg-[#0d2a22] border-2 border-[#4fcea6] p-4 mb-6 text-[#4fcea6] font-mono text-sm">Saving to GitHub...</div>}

        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            editingId === project.id ? (
              <ProjectEditor 
                key={project.id} 
                project={project} 
                onSave={handleSave} 
                onCancel={() => {
                  setEditingId(null);
                  if (project.title === 'New Project' && project.liveUrl === '') {
                    setProjects(projects.filter(p => p.id !== project.id));
                  }
                }} 
              />
            ) : (
              <div key={project.id} className={`bg-[#0d1525] border-2 ${project.featured ? 'border-[#388bfd] border-t-[4px] border-t-[#4fcea6]' : 'border-[#1A56DB] border-t-[4px] border-t-[#1A56DB]'} p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-sora font-bold">{project.title}</h3>
                    {project.featured && <span className="bg-[#0d2a22] text-[#4fcea6] border border-[#4fcea6] text-[10px] uppercase font-mono px-2 py-0.5">Featured</span>}
                    {!project.visible && <span className="bg-[#2a1f0a] text-[#e5a823] border border-[#e5a823] text-[10px] uppercase font-mono px-2 py-0.5">Hidden</span>}
                  </div>
                  <p className="text-[#8fa3c0] text-sm mb-3 line-clamp-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map(tech => (
                      <span key={tech} className="text-[#79b8ff] border border-[#1A56DB] font-mono text-[10px] px-2 py-0.5">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditingId(project.id)} className="bg-transparent border-2 border-[#1A56DB] text-[#f0f6ff] font-mono uppercase text-[11px] px-4 py-2 hover:bg-[#1A56DB]">Edit</button>
                  <button onClick={() => handleDelete(project.id)} className="bg-transparent border-2 border-[#e55353] text-[#e55353] font-mono uppercase text-[11px] px-4 py-2 hover:bg-[#e55353] hover:text-[#f0f6ff]">Delete</button>
                </div>
              </div>
            )
          ))}
          {projects.length === 0 && <div className="text-center text-[#8fa3c0] py-12 border-2 border-dashed border-[#1e2d4a]">No projects found. Add one above.</div>}
        </div>
      </div>
    </div>
  );
}

function ProjectEditor({ project, onSave, onCancel }) {
  const [formData, setFormData] = useState({ ...project, stack: project.stack.join(', ') });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      stack: formData.stack.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  return (
    <div className="bg-[#0d1525] border-2 border-[#388bfd] p-6 border-t-[4px] border-t-[#388bfd]">
      <h3 className="font-mono text-[13px] text-[#388bfd] uppercase tracking-widest mb-4">Edit Project</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
          </div>
          <div>
            <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">ID (Slug)</label>
            <input name="id" value={formData.id} onChange={handleChange} required className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Short Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={2} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
        </div>

        <div>
          <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Long Description (Markdown/Details)</label>
          <textarea name="longDescription" value={formData.longDescription || ''} onChange={handleChange} rows={5} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
        </div>

        <div>
          <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Tech Stack (comma separated)</label>
          <input name="stack" value={formData.stack} onChange={handleChange} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Live URL</label>
            <input name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
          </div>
          <div>
            <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">GitHub URL</label>
            <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Project Image</label>
          <div className="space-y-2">
            <ImageUploader 
              onUploadSuccess={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))} 
            />
            <input 
              name="imageUrl" 
              value={formData.imageUrl} 
              onChange={handleChange} 
              placeholder="Or paste an image URL here..."
              className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm focus:border-[#1A56DB] focus:outline-none" 
            />
          </div>
        </div>

        <div className="flex gap-6 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 accent-[#4fcea6]" />
            <span className="font-mono text-sm text-[#f0f6ff]">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="visible" checked={formData.visible} onChange={handleChange} className="w-4 h-4 accent-[#1A56DB]" />
            <span className="font-mono text-sm text-[#f0f6ff]">Visible</span>
          </label>
        </div>

        <div className="flex justify-end gap-4 mt-4 border-t-2 border-[#1e2d4a] pt-4">
          <button type="button" onClick={onCancel} className="bg-transparent text-[#8fa3c0] font-mono uppercase text-[12px] px-4 py-2 hover:text-[#f0f6ff]">Cancel</button>
          <button type="submit" className="bg-[#4fcea6] text-[#0d2a22] font-mono font-bold uppercase text-[12px] px-6 py-2 hover:bg-[#3db892]">Save Project</button>
        </div>
      </form>
    </div>
  );
}
