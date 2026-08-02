import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { ArrowLeft, Plus, Trash2, Award, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CertsAdmin() {
  const { data: initialCerts, loading, error: fetchError } = useGitHubData('certifications.json');
  const [certs, setCerts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newCert, setNewCert] = useState({ id: '', name: '', org: '', issuedBy: '', date: '', credentialId: '', featured: false });

  useEffect(() => {
    if (initialCerts) queueMicrotask(() => setCerts(initialCerts));
  }, [initialCerts]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCert.id || !newCert.name) return;
    const updated = [...certs, newCert];
    setCerts(updated);
    setNewCert({ id: '', name: '', org: '', issuedBy: '', date: '', credentialId: '', featured: false });
    await saveToGitHub(updated);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certification entry?')) return;
    const updated = certs.filter(c => c.id !== id);
    setCerts(updated);
    await saveToGitHub(updated);
  };

  const saveToGitHub = async (dataToSave) => {
    setSaving(true);
    setError(null);
    try {
      await writeGitHubData('certifications.json', dataToSave);
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
        <Award className="w-5 h-5 text-[var(--accent-glow)]" />
        <span>Loading Certifications...</span>
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
            <h1 className="text-2xl sm:text-3xl font-sora font-extrabold">Certifications Management</h1>
          </div>
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">[ {certs.length} CREDENTIALS TOTAL ]</span>
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
            <span>Certifications saved to GitHub successfully!</span>
          </div>
        )}

        {/* Add Cert Form Card */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)] text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">
            <Plus className="w-4 h-4 text-[var(--accent-glow)]" />
            <span>Add New Certificate / Credential</span>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">ID (slug)</label>
                <input 
                  value={newCert.id} 
                  onChange={e => setNewCert({...newCert, id: e.target.value})} 
                  placeholder="e.g. java-se-17" 
                  className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
                  required 
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Certificate Title</label>
                <input 
                  value={newCert.name} 
                  onChange={e => setNewCert({...newCert, name: e.target.value})} 
                  placeholder="e.g. Java SE 17 Developer Certification" 
                  className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Organization</label>
                <input 
                  value={newCert.org} 
                  onChange={e => setNewCert({...newCert, org: e.target.value})} 
                  placeholder="e.g. Oracle" 
                  className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Issued By</label>
                <input 
                  value={newCert.issuedBy} 
                  onChange={e => setNewCert({...newCert, issuedBy: e.target.value})} 
                  placeholder="e.g. Oracle University" 
                  className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Issue Date</label>
                <input 
                  value={newCert.date} 
                  onChange={e => setNewCert({...newCert, date: e.target.value})} 
                  placeholder="e.g. May 2025" 
                  className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Credential ID (Optional)</label>
                <input 
                  value={newCert.credentialId} 
                  onChange={e => setNewCert({...newCert, credentialId: e.target.value})} 
                  placeholder="e.g. ORC-8930211" 
                  className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors" 
                />
              </div>
              <div className="flex items-center justify-between pt-4 md:pt-0">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text-main)] font-mono-custom">
                  <input 
                    type="checkbox" 
                    checked={newCert.featured} 
                    onChange={e => setNewCert({...newCert, featured: e.target.checked})} 
                    className="w-4 h-4 rounded accent-[var(--text-main)] cursor-pointer" 
                  />
                  <span>Feature Badge</span>
                </label>
                
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-[var(--text-main)] text-[var(--bg-main)] font-bold text-xs uppercase px-6 py-3 rounded-full hover:opacity-90 transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{saving ? 'Adding...' : 'Add Certificate'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Existing Certs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map(cert => (
            <div 
              key={cert.id} 
              className={`bg-[var(--card-bg)] border ${cert.featured ? 'border-[var(--text-main)] shadow-2xl' : 'border-[var(--border-subtle)]'} p-5 rounded-2xl flex justify-between items-start hover:border-[var(--border-strong)] transition-all shadow-lg`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-sora font-extrabold text-sm text-[var(--text-main)]">
                  <span>{cert.name}</span>
                  {cert.featured && (
                    <span className="font-mono-custom text-[9px] uppercase font-bold bg-[var(--text-main)] text-[var(--bg-main)] px-2 py-0.5 rounded-full shrink-0">
                      Featured
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">ORG: {cert.org} | DATE: {cert.date}</div>
                {cert.credentialId && (
                  <div className="text-[10px] text-[var(--text-muted)] opacity-80">ID: {cert.credentialId}</div>
                )}
              </div>
              
              <button 
                onClick={() => handleDelete(cert.id)} 
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0 ml-4"
                title="Delete certification"
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
