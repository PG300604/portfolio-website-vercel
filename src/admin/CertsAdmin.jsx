import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';

export default function CertsAdmin() {
  const { data: initialCerts, loading, error: fetchError } = useGitHubData('certifications.json');
  const [certs, setCerts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
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
    if (!window.confirm('Delete this cert?')) return;
    const updated = certs.filter(c => c.id !== id);
    setCerts(updated);
    await saveToGitHub(updated);
  };

  const saveToGitHub = async (dataToSave) => {
    setSaving(true);
    setError(null);
    try {
      await writeGitHubData('certifications.json', dataToSave);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-[#f0f6ff] bg-[#060a14] min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#060a14] p-8 text-[#f0f6ff]">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-2 border-[#1e2d4a] pb-6">
          <div>
            <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
              <Link to="/admin/dashboard" className="text-[#8fa3c0] hover:text-[#388bfd]">Dashboard</Link> / CERTIFICATIONS
            </div>
            <h1 className="text-3xl font-sora font-bold">Manage Certs</h1>
          </div>
        </div>

        {error && <div className="bg-[#2a0f0f] border-2 border-[#e55353] p-4 mb-6 text-[#e55353] font-mono text-sm">{error}</div>}
        {fetchError && <div className="bg-[#2a0f0f] border-2 border-[#e55353] p-4 mb-6 text-[#e55353] font-mono text-sm">{fetchError.message}</div>}
        {saving && <div className="bg-[#0d2a22] border-2 border-[#4fcea6] p-4 mb-6 text-[#4fcea6] font-mono text-sm">Saving to GitHub...</div>}

        <div className="bg-[#0d1525] border-2 border-[#1A56DB] p-6 mb-8 border-t-[4px] border-t-[#1A56DB]">
          <h3 className="font-mono text-[13px] text-[#1A56DB] uppercase tracking-widest mb-4">Add New Cert</h3>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">ID (slug)</label>
                <input value={newCert.id} onChange={e => setNewCert({...newCert, id: e.target.value})} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm" required />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Name / Title</label>
                <input value={newCert.name} onChange={e => setNewCert({...newCert, name: e.target.value})} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Organization</label>
                <input value={newCert.org} onChange={e => setNewCert({...newCert, org: e.target.value})} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm" />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Issued By</label>
                <input value={newCert.issuedBy} onChange={e => setNewCert({...newCert, issuedBy: e.target.value})} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm" />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Date</label>
                <input value={newCert.date} onChange={e => setNewCert({...newCert, date: e.target.value})} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-1">Credential ID (optional)</label>
                <input value={newCert.credentialId} onChange={e => setNewCert({...newCert, credentialId: e.target.value})} className="w-full bg-[#060a14] text-[#f0f6ff] border-2 border-[#1e2d4a] p-2 font-mono text-sm" />
              </div>
              <div className="flex justify-between items-center h-[40px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newCert.featured} onChange={e => setNewCert({...newCert, featured: e.target.checked})} className="w-4 h-4 accent-[#4fcea6]" />
                  <span className="font-mono text-sm">Featured</span>
                </label>
                <button type="submit" className="bg-[#1A56DB] text-[#f0f6ff] border-[3px] border-[#1A56DB] px-6 py-2 font-mono font-bold text-[12px] uppercase hover:bg-[#388bfd] transition-colors">Add</button>
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map(cert => (
            <div key={cert.id} className={`bg-[#0d1525] border-2 ${cert.featured ? 'border-[#388bfd]' : 'border-[#1e2d4a]'} p-4 flex justify-between items-start`}>
              <div>
                <div className="font-sora font-bold mb-1">{cert.name} {cert.featured && <span className="text-[#4fcea6] text-[10px] uppercase font-mono ml-2 border border-[#4fcea6] px-1">Featured</span>}</div>
                <div className="font-mono text-[11px] text-[#8fa3c0]">org: {cert.org} | date: {cert.date}</div>
              </div>
              <button onClick={() => handleDelete(cert.id)} className="text-[#e55353] hover:text-[#f0f6ff] font-mono text-[11px] uppercase ml-4">Del</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
