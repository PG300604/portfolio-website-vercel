import { useState, useEffect } from 'react';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { Link } from 'react-router-dom';
import ImageUploader from '../components/shared/ImageUploader';

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
      title: 'New Update',
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

  if (loading) return <div className="p-8 text-[#8fa3c0] font-mono">Loading data...</div>;

  return (
    <div className="min-h-screen bg-[#060a14] p-8 text-[#f0f6ff]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-2 border-[#1e2d4a] pb-6">
          <div>
            <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
              <Link to="/admin/dashboard" className="text-[#8fa3c0] hover:text-[#388bfd]">Dashboard</Link> / BLOGS & EVENTS
            </div>
            <h1 className="text-3xl font-sora font-bold">Manage Blogs & Events</h1>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-8 border-b-2 border-[#1e2d4a] pb-4">
          <p className="text-[#8fa3c0] text-sm">Post new blogs, events, or general updates here.</p>
          <button onClick={addBlog} className="bg-[#388bfd] text-white px-4 py-2 font-mono text-sm hover:bg-[#1A56DB] transition-colors">
            + Create New Post
          </button>
        </div>

        {fetchError && <div className="bg-[#e55353]/10 border border-[#e55353] text-[#e55353] p-4 mb-6">{fetchError.message}</div>}
        {saveError && <div className="bg-[#e55353]/10 border border-[#e55353] text-[#e55353] p-4 mb-6">{saveError}</div>}
        {success && <div className="bg-[#4fcea6]/10 border border-[#4fcea6] text-[#4fcea6] p-4 mb-6">Saved successfully!</div>}

        <div className="space-y-6">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-[#0d1525] border border-[#1e2d4a] p-6 flex flex-col md:flex-row gap-6 relative">
              <button 
                onClick={() => removeBlog(blog.id)} 
                className="absolute top-4 right-4 text-[#e55353] hover:text-white hover:bg-[#e55353] px-3 py-1 font-mono text-xs transition-colors border border-[#e55353]"
              >
                Delete
              </button>
              
              <div className="w-full md:w-48 flex-shrink-0 space-y-4">
                <div className="aspect-video bg-[#060a14] border border-[#1e2d4a] flex items-center justify-center overflow-hidden">
                  {blog.image ? (
                    <img src={blog.image} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                  ) : (
                    <span className="text-[#8fa3c0] font-mono text-xs">No Cover Image</span>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Cover Image</label>
                  <ImageUploader 
                    onUploadSuccess={(url) => updateBlog(blog.id, 'image', url)}
                  />
                  <input 
                    type="text" 
                    value={blog.image || ''} 
                    onChange={(e) => updateBlog(blog.id, 'image', e.target.value)}
                    placeholder="Or paste an image URL here..."
                    className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Title</label>
                    <input 
                      type="text" 
                      value={blog.title} 
                      onChange={(e) => updateBlog(blog.id, 'title', e.target.value)}
                      className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm font-bold"
                    />
                  </div>
                  <div className="w-40">
                    <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Date</label>
                    <input 
                      type="date" 
                      value={blog.date} 
                      onChange={(e) => updateBlog(blog.id, 'date', e.target.value)}
                      className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">External Link (Optional)</label>
                  <input 
                    type="text" 
                    value={blog.link || ''} 
                    onChange={(e) => updateBlog(blog.id, 'link', e.target.value)}
                    className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Content Snippet</label>
                  <textarea 
                    value={blog.content} 
                    onChange={(e) => updateBlog(blog.id, 'content', e.target.value)}
                    className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm h-32 resize-y"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {blogs.length === 0 && (
            <div className="text-center py-12 text-[#8fa3c0] font-mono border-2 border-dashed border-[#1e2d4a]">
              No posts yet. Click "Create New Post" to start.
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t-2 border-[#1e2d4a]">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full bg-[#4fcea6] text-[#060a14] font-bold font-mono py-3 hover:bg-[#388bfd] hover:text-white transition-colors disabled:opacity-50"
          >
            {saving ? 'SAVING...' : 'SAVE CHANGES TO GITHUB'}
          </button>
        </div>
      </div>
    </div>
  );
}
