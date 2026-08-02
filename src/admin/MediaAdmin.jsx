import { useState, useEffect } from 'react';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { Link } from 'react-router-dom';
import ImageUploader from '../components/shared/ImageUploader';
import { ArrowLeft, Plus, Trash2, Image, Layers, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MediaAdmin() {
  const { data, loading, error: fetchError, refetch } = useGitHubData('media.json');
  const [mediaData, setMediaData] = useState({ profiles: [], items: [] });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profiles'); // 'profiles' or 'items'

  useEffect(() => {
    if (data) {
      queueMicrotask(() => {
        if (Array.isArray(data)) {
          setMediaData({ profiles: [], items: data });
        } else {
          setMediaData({
            profiles: data.profiles || [],
            items: data.items || []
          });
        }
      });
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
    if (window.confirm('Remove this category?')) {
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

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-8 font-mono-custom flex items-center justify-center">
      <div className="flex items-center gap-3 animate-pulse">
        <Image className="w-5 h-5 text-[var(--accent-glow)]" />
        <span>Loading Media Gallery Config...</span>
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
            <h1 className="text-2xl sm:text-3xl font-sora font-extrabold">Media & Socials Gallery</h1>
          </div>

          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold text-xs uppercase px-6 py-3 rounded-full hover:opacity-90 transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4 font-mono-custom text-xs uppercase">
          <button 
            onClick={() => setActiveTab('profiles')}
            className={`px-5 py-2.5 rounded-full border transition-all inline-flex items-center gap-2 cursor-pointer ${
              activeTab === 'profiles' 
                ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-bold border-[var(--text-main)] shadow-lg' 
                : 'bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories & Social Links</span>
          </button>

          <button 
            onClick={() => setActiveTab('items')}
            className={`px-5 py-2.5 rounded-full border transition-all inline-flex items-center gap-2 cursor-pointer ${
              activeTab === 'items' 
                ? 'bg-[var(--text-main)] text-[var(--bg-main)] font-bold border-[var(--text-main)] shadow-lg' 
                : 'bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Gallery Images ({mediaData.items.length})</span>
          </button>
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
            <span>Media data saved to GitHub successfully!</span>
          </div>
        )}

        {/* TAB: PROFILES / CATEGORIES */}
        {activeTab === 'profiles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[var(--border-subtle)] gap-4">
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Create gallery categories (e.g., Photography, Tech) and link their Instagram profiles.
              </p>
              <button 
                onClick={addProfile} 
                className="bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] px-4 py-2 rounded-full text-xs font-bold uppercase transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {mediaData.profiles.map(profile => (
                <div key={profile.id} className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Category Display Name</label>
                      <input 
                        type="text" 
                        value={profile.label} 
                        onChange={(e) => updateProfile(profile.id, 'label', e.target.value)}
                        className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Internal Category ID</label>
                      <input 
                        type="text" 
                        value={profile.id} 
                        onChange={(e) => updateProfile(profile.id, 'id', e.target.value)}
                        className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Instagram Profile Link</label>
                      <input 
                        type="text" 
                        value={profile.instagram} 
                        onChange={(e) => updateProfile(profile.id, 'instagram', e.target.value)}
                        className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                        placeholder="https://instagram.com/your_handle"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => removeProfile(profile.id)} 
                    className="p-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                    title="Remove category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: GALLERY IMAGES */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[var(--border-subtle)] gap-4">
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Add artwork & photography images to your public gallery and assign them to categories.
              </p>
              <button 
                onClick={addItem} 
                className="bg-[var(--card-bg)] text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] px-4 py-2 rounded-full text-xs font-bold uppercase transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {mediaData.items.map(item => (
                <div key={item.id} className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl flex flex-col md:flex-row gap-6 shadow-xl">
                  {/* Image Preview Box */}
                  <div className="w-full md:w-36 h-36 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] overflow-hidden shrink-0 flex items-center justify-center">
                    {item.url ? (
                      <img src={item.url} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                      <div className="text-[var(--text-muted)] text-[10px] uppercase">No Image</div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Gallery Image File / URL</label>
                      <ImageUploader 
                        onUploadSuccess={(url) => updateItem(item.id, 'url', url)}
                      />
                      <input 
                        type="text" 
                        value={item.url} 
                        onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                        className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                        placeholder="Or paste an image URL..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Caption / Description</label>
                      <input 
                        type="text" 
                        value={item.caption} 
                        onChange={(e) => updateItem(item.id, 'caption', e.target.value)}
                        className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Assigned Category</label>
                      <select 
                        value={item.categoryId || 'all'} 
                        onChange={(e) => updateItem(item.id, 'categoryId', e.target.value)}
                        className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                      >
                        <option value="all">Uncategorized (All)</option>
                        {mediaData.profiles.map(p => (
                          <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end items-start shrink-0">
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="p-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
