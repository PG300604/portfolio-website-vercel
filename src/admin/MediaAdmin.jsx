import { useState, useEffect } from 'react';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { Link } from 'react-router-dom';
import ImageUploader from '../components/shared/ImageUploader';

export default function MediaAdmin() {
  const { data, loading, error: fetchError, refetch } = useGitHubData('media.json');
  const [mediaData, setMediaData] = useState({ profiles: [], items: [] });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profiles'); // 'profiles' or 'items'

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        // Legacy format migration
        setMediaData({ profiles: [], items: data });
      } else {
        setMediaData({
          profiles: data.profiles || [],
          items: data.items || []
        });
      }
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await writeGitHubData('media.json', mediaData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      refetch();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Profile Management
  const addProfile = () => {
    setMediaData(prev => ({
      ...prev,
      profiles: [...prev.profiles, { id: Date.now().toString(), label: 'New Category', instagram: '' }]
    }));
  };

  const updateProfile = (id, field, value) => {
    setMediaData(prev => {
      const updatedProfiles = prev.profiles.map(p => p.id === id ? { ...p, [field]: value } : p);
      let updatedItems = prev.items;
      if (field === 'id') {
        updatedItems = prev.items.map(item => 
          item.categoryId === id ? { ...item, categoryId: value } : item
        );
      }
      return {
        ...prev,
        profiles: updatedProfiles,
        items: updatedItems
      };
    });
  };

  const removeProfile = (id) => {
    if (window.confirm('Remove this category? Images in this category will remain but may not be filterable until reassigned.')) {
      setMediaData(prev => ({
        ...prev,
        profiles: prev.profiles.filter(p => p.id !== id)
      }));
    }
  };

  // Item Management
  const addItem = () => {
    setMediaData(prev => ({
      ...prev,
      items: [{ id: Date.now().toString(), url: '', caption: '', categoryId: 'all' }, ...prev.items]
    }));
  };

  const updateItem = (id, field, value) => {
    setMediaData(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === id ? { ...i, [field]: value } : i)
    }));
  };

  const removeItem = (id) => {
    setMediaData(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== id)
    }));
  };

  if (loading) return <div className="p-8 text-[#8fa3c0] font-mono">Loading data...</div>;

  return (
    <div className="min-h-screen bg-[#060a14] p-8 text-[#f0f6ff]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-2 border-[#1e2d4a] pb-6">
          <div>
            <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
              <Link to="/admin/dashboard" className="text-[#8fa3c0] hover:text-[#388bfd]">Dashboard</Link> / MEDIA & SOCIALS
            </div>
            <h1 className="text-3xl font-sora font-bold">Manage Media Gallery</h1>
          </div>
        </div>
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('profiles')}
            className={`px-6 py-2 font-mono text-sm border-2 ${activeTab === 'profiles' ? 'border-[#388bfd] bg-[#388bfd]/10' : 'border-[#1e2d4a] hover:border-[#8fa3c0]'}`}
          >
            Categories & Socials
          </button>
          <button 
            onClick={() => setActiveTab('items')}
            className={`px-6 py-2 font-mono text-sm border-2 ${activeTab === 'items' ? 'border-[#388bfd] bg-[#388bfd]/10' : 'border-[#1e2d4a] hover:border-[#8fa3c0]'}`}
          >
            Gallery Images
          </button>
        </div>

        {fetchError && <div className="bg-[#e55353]/10 border border-[#e55353] text-[#e55353] p-4 mb-6">{fetchError.message}</div>}
        {saveError && <div className="bg-[#e55353]/10 border border-[#e55353] text-[#e55353] p-4 mb-6">{saveError}</div>}
        {success && <div className="bg-[#4fcea6]/10 border border-[#4fcea6] text-[#4fcea6] p-4 mb-6">Saved successfully!</div>}

        {activeTab === 'profiles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b-2 border-[#1e2d4a] pb-4">
              <p className="text-[#8fa3c0] text-sm">Create categories for your media (e.g., Photography, Fitness) and link their respective Instagram accounts.</p>
              <button onClick={addProfile} className="bg-[#388bfd] text-white px-4 py-2 font-mono text-sm hover:bg-[#1A56DB] transition-colors">
                + Add Category
              </button>
            </div>
            
            {mediaData.profiles.map(profile => (
              <div key={profile.id} className="bg-[#0d1525] border border-[#1e2d4a] p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Category Name (e.g. Photography)</label>
                    <input 
                      type="text" 
                      value={profile.label} 
                      onChange={(e) => updateProfile(profile.id, 'label', e.target.value)}
                      className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Category Internal ID (lowercase, no spaces)</label>
                    <input 
                      type="text" 
                      value={profile.id} 
                      onChange={(e) => updateProfile(profile.id, 'id', e.target.value)}
                      className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Instagram Link</label>
                    <input 
                      type="text" 
                      value={profile.instagram} 
                      onChange={(e) => updateProfile(profile.id, 'instagram', e.target.value)}
                      className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                      placeholder="https://instagram.com/your_handle"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <button onClick={() => removeProfile(profile.id)} className="text-[#e55353] hover:text-white hover:bg-[#e55353] px-3 py-1 font-mono text-xs transition-colors border border-[#e55353]">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b-2 border-[#1e2d4a] pb-4">
              <p className="text-[#8fa3c0] text-sm">Add images to your gallery and assign them to categories.</p>
              <button onClick={addItem} className="bg-[#388bfd] text-white px-4 py-2 font-mono text-sm hover:bg-[#1A56DB] transition-colors">
                + Add Image
              </button>
            </div>
            
            {mediaData.items.map(item => (
              <div key={item.id} className="bg-[#0d1525] border border-[#1e2d4a] p-4 flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-32 h-32 bg-[#060a14] border border-[#1e2d4a] flex-shrink-0">
                  {item.url ? (
                    <img src={item.url} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8fa3c0] font-mono text-xs">No Image</div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Gallery Image</label>
                    <ImageUploader 
                      onUploadSuccess={(url) => updateItem(item.id, 'url', url)}
                    />
                    <input 
                      type="text" 
                      value={item.url} 
                      onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                      className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                      placeholder="Or paste an image URL here..."
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Caption</label>
                    <input 
                      type="text" 
                      value={item.caption} 
                      onChange={(e) => updateItem(item.id, 'caption', e.target.value)}
                      className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Category</label>
                    <select 
                      value={item.categoryId || 'all'} 
                      onChange={(e) => updateItem(item.id, 'categoryId', e.target.value)}
                      className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                    >
                      <option value="all">Uncategorized (All)</option>
                      {mediaData.profiles.map(p => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-start justify-end">
                  <button onClick={() => removeItem(item.id)} className="text-[#e55353] hover:text-white hover:bg-[#e55353] px-3 py-1 font-mono text-xs transition-colors border border-[#e55353]">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
