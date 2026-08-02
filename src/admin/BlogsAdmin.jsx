import { useState, useEffect } from 'react';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { Link } from 'react-router-dom';
import ImageUploader from '../components/shared/ImageUploader';
import { ArrowLeft, Plus, Trash2, BookOpen, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function BlogsAdmin() {
  const { data, loading, error: fetchError, refetch } = useGitHubData('blogs.json');
  const [blogs, setBlogs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      queueMicrotask(() => setBlogs(data));
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await writeGitHubData('blogs.json', blogs);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      refetch();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addBlog = () => {
    const newBlog = {
      id: Date.now().toString(),
      title: 'New Update / Article',
      date: new Date().toISOString().split('T')[0],
      content: '',
      image: '',
      link: ''
    };
    setBlogs([newBlog, ...blogs]);
  };

  const updateBlog = (id, field, value) => {
    setBlogs(blogs.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBlog = (id) => {
    if (window.confirm('Are you sure you want to delete this update?')) {
      setBlogs(blogs.filter(b => b.id !== id));
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-8 font-mono-custom flex items-center justify-center">
      <div className="flex items-center gap-3 animate-pulse">
        <BookOpen className="w-5 h-5 text-[var(--accent-glow)]" />
        <span>Loading Blogs & Events Config...</span>
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
            <h1 className="text-2xl sm:text-3xl font-sora font-extrabold">Blogs & Events Management</h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={addBlog} 
              className="bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] px-4 py-2.5 rounded-full text-xs font-bold uppercase transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Post</span>
            </button>

            <button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold text-xs uppercase px-6 py-2.5 rounded-full hover:opacity-90 transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Posts'}</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {fetchError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{fetchError.message}</span>
          </div>
        )}
        {saveError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Blog posts saved to GitHub successfully!</span>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl flex flex-col md:flex-row gap-6 shadow-xl relative">
              <button 
                onClick={() => removeBlog(blog.id)} 
                className="absolute top-4 right-4 p-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Delete post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="w-full md:w-48 shrink-0 space-y-3">
                <div className="aspect-video bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-center overflow-hidden">
                  {blog.image ? (
                    <img src={blog.image} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                  ) : (
                    <span className="text-[var(--text-muted)] text-[10px] uppercase">No Cover Image</span>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Cover Image</label>
                  <ImageUploader 
                    onUploadSuccess={(url) => updateBlog(blog.id, 'image', url)}
                  />
                  <input 
                    type="text" 
                    value={blog.image || ''} 
                    onChange={(e) => updateBlog(blog.id, 'image', e.target.value)}
                    placeholder="Or paste image URL..."
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-4 pr-10">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Article / Event Title</label>
                    <input 
                      type="text" 
                      value={blog.title} 
                      onChange={(e) => updateBlog(blog.id, 'title', e.target.value)}
                      className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors font-bold"
                    />
                  </div>
                  <div className="w-full sm:w-40">
                    <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Publish Date</label>
                    <input 
                      type="date" 
                      value={blog.date} 
                      onChange={(e) => updateBlog(blog.id, 'date', e.target.value)}
                      className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-1">External Link (Optional)</label>
                  <input 
                    type="text" 
                    value={blog.link || ''} 
                    onChange={(e) => updateBlog(blog.id, 'link', e.target.value)}
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                    placeholder="https://medium.com/..."
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Content Snippet</label>
                  <textarea 
                    value={blog.content} 
                    onChange={(e) => updateBlog(blog.id, 'content', e.target.value)}
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl p-4 text-xs outline-none transition-colors h-28 resize-y leading-relaxed"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {blogs.length === 0 && (
            <div className="text-center py-16 text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-2xl space-y-3">
              <BookOpen className="w-8 h-8 mx-auto opacity-50 text-[var(--text-muted)]" />
              <div className="text-xs">No posts yet. Click "Create Post" to write one.</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
