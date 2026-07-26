import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import ImageUploader from '../components/shared/ImageUploader';
import { Plus, Trash2, Edit3, ArrowLeft, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

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
      stack: ['React', 'TailwindCSS'],
      liveUrl: '',
      githubUrl: '',
      imageUrl: '/Homepage.png',
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

  if (dataLoading) return <div className="p-8 text-[var(--text-main)] bg-[var(--bg-main)] min-h-screen font-mono-custom text-xs">Loading projects data...</div>;
  if (fetchError) return <div className="p-8 text-red-400 bg-[var(--bg-main)] min-h-screen font-mono-custom text-xs">Error loading data: {fetchError.message}</div>;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-8 text-[var(--text-main)] font-sora">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[var(--border-subtle)] gap-4">
          <div>
            <div className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-2">
              <Link to="/admin/dashboard" className="text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
              </Link> 
              <span>/</span> 
              <span className="text-[var(--text-main)] font-bold">PROJECTS</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Manage Floating Projects</h1>
          </div>

          <button
            onClick={handleAdd}
            className="bg-[var(--text-main)] text-[var(--bg-main)] font-mono-custom text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full hover:opacity-90 transition-all flex items-center gap-2 shadow-xl"
          >
            <Plus className="w-4 h-4" /> Add New Project
          </button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 font-mono-custom text-xs">{error}</div>}
        {saving && <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-400 font-mono-custom text-xs">[ SAVING TO GITHUB BACKEND... ]</div>}

        {/* Project List */}
        <div className="space-y-6">
          {projects.map((project) => (
            editingId === project.id ? (
              <ProjectEditor 
                key={project.id} 
                project={project} 
                onSave={handleSave} 
                onCancel={() => {
                  setEditingId(null);
                  if (project.title === 'New Project' && !project.liveUrl) {
                    setProjects(projects.filter(p => p.id !== project.id));
                  }
                }} 
              />
            ) : (
              <div key={project.id} className="bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl transition-all">
                <div className="flex items-center gap-5">
                  {/* Floating Card Image Thumbnail Preview */}
                  <div className="w-24 h-20 rounded-xl overflow-hidden bg-[var(--bg-main)] border border-[var(--border-subtle)] shrink-0 flex items-center justify-center relative group">
                    <img 
                      src={project.imageUrl || project.image || '/Homepage.png'} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = '/Homepage.png'}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      {project.featured && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-mono-custom px-2.5 py-0.5 rounded-full">[ FEATURED ]</span>}
                      {!project.visible && <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] uppercase font-mono-custom px-2.5 py-0.5 rounded-full">[ HIDDEN ]</span>}
                    </div>
                    <p className="text-[var(--text-muted)] font-mono-custom text-xs mb-3 line-clamp-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 font-mono-custom text-[11px]">
                      {(project.stack || []).map(tech => (
                        <span key={tech} className="bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] px-2.5 py-0.5 rounded-md">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono-custom text-xs">
                  <button onClick={() => setEditingId(project.id)} className="bg-[var(--bg-main)] border border-[var(--border-subtle)] hover:border-[var(--text-main)] text-[var(--text-main)] px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-full font-bold transition-all hover:bg-red-500/20 flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            )
          ))}

          {projects.length === 0 && (
            <div className="text-center text-[var(--text-muted)] py-16 border border-dashed border-[var(--border-subtle)] rounded-2xl font-mono-custom text-xs">
              No projects found. Click "+ Add New Project" to create one.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function ProjectEditor({ project, onSave, onCancel }) {
  const [formData, setFormData] = useState({ 
    ...project, 
    imageUrl: project.imageUrl || project.image || '/Homepage.png',
    stack: Array.isArray(project.stack) ? project.stack.join(', ') : (project.stack || '') 
  });

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
      image: formData.imageUrl, // sync image & imageUrl for 3D FloatingPosters compatibility
      stack: formData.stack.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-strong)] p-8 rounded-3xl space-y-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <h3 className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--text-main)]" /> Edit Floating 3D Project Card
        </h3>
        <span className="font-mono-custom text-xs text-[var(--text-muted)]">[ ID: {project.id} ]</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 font-mono-custom text-xs">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[var(--text-muted)] uppercase mb-1">Project Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3 rounded-xl outline-none" />
          </div>
          <div>
            <label className="block text-[var(--text-muted)] uppercase mb-1">Slug / Identifier</label>
            <input name="id" value={formData.id} onChange={handleChange} required className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3 rounded-xl outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-[var(--text-muted)] uppercase mb-1">Short Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={2} className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3 rounded-xl outline-none" />
        </div>

        <div>
          <label className="block text-[var(--text-muted)] uppercase mb-1">Detailed Description (Modal View)</label>
          <textarea name="longDescription" value={formData.longDescription || ''} onChange={handleChange} rows={4} className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3 rounded-xl outline-none" />
        </div>

        <div>
          <label className="block text-[var(--text-muted)] uppercase mb-1">Tech Stack (Comma Separated)</label>
          <input name="stack" value={formData.stack} onChange={handleChange} className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3 rounded-xl outline-none" />
        </div>

        {/* Floating Card Project Image Upload & URL Section */}
        <div className="p-5 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[var(--text-main)] font-bold uppercase flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" /> 3D Floating Poster Image Artwork
            </label>
            <span className="text-[10px] text-[var(--text-muted)]">[ APPEARS ON 3D STAGE & MODAL ]</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="w-32 h-24 rounded-xl overflow-hidden border border-[var(--border-subtle)] shrink-0 bg-black">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src = '/Homepage.png'} />
              </div>
            )}

            <div className="flex-1 space-y-3 w-full">
              <ImageUploader 
                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, imageUrl: url, image: url }))} 
              />
              <input 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={(e) => {
                  handleChange(e);
                  setFormData(prev => ({ ...prev, image: e.target.value }));
                }} 
                placeholder="Or paste image URL (/Homepage.png or https://...)"
                className="w-full bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3 rounded-xl outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[var(--text-muted)] uppercase mb-1">Live Demo URL</label>
            <input name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3 rounded-xl outline-none" />
          </div>
          <div>
            <label className="block text-[var(--text-muted)] uppercase mb-1">GitHub Repo URL</label>
            <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3 rounded-xl outline-none" />
          </div>
        </div>

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 accent-emerald-400" />
            <span className="text-[var(--text-main)]">Featured Project</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="visible" checked={formData.visible} onChange={handleChange} className="w-4 h-4 accent-sky-400" />
            <span className="text-[var(--text-main)]">Visible on Website</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
          <button type="button" onClick={onCancel} className="bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold px-5 py-2.5 rounded-full transition-all">Cancel</button>
          <button type="submit" className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-all flex items-center gap-2 shadow-xl">
            <Check className="w-4 h-4" /> Save Project Changes
          </button>
        </div>
      </form>
    </div>
  );
}
