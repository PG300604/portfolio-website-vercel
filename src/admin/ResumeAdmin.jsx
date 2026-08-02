import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useGitHubData } from '../hooks/useGitHubData';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { ArrowLeft, FileText, Upload, Download, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export default function ResumeAdmin() {
  const { data: about, loading } = useGitHubData('about.json');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF document (.pdf).');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    const token = import.meta.env.VITE_GH_TOKEN;
    const owner = import.meta.env.VITE_GH_OWNER;
    const repo = import.meta.env.VITE_GH_REPO;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/assets/resume.pdf`;

    try {
      // 1. Get current SHA if the file exists
      let currentSha = null;
      try {
        const getRes = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        currentSha = getRes.data.sha;
      } catch (err) {
        if (err.response && err.response.status !== 404) {
          throw err;
        }
      }

      // 2. Read file as base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result.split(',')[1];
          
          await axios.put(url, {
            message: 'update: resume.pdf',
            content: base64,
            sha: currentSha
          }, { headers: { Authorization: `Bearer ${token}` } });

          // 3. Update about.json with raw URL
          if (about) {
            const resumeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/assets/resume.pdf`;
            if (about.resumeUrl !== resumeUrl) {
              await writeGitHubData('about.json', { ...about, resumeUrl });
            }
          }

          setSuccess(true);
          setSaving(false);
        } catch (err) {
          console.error(err);
          setError(err.message || 'Failed to upload PDF');
          setSaving(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to upload PDF');
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-8 font-mono-custom flex items-center justify-center">
      <div className="flex items-center gap-3 animate-pulse">
        <FileText className="w-5 h-5 text-[var(--accent-glow)]" />
        <span>Loading Resume Config...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 sm:p-8 font-mono-custom">
      <div className="max-w-4xl mx-auto space-y-8">
        
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
            <h1 className="text-2xl sm:text-3xl font-sora font-extrabold">Resume PDF Upload</h1>
          </div>
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">[ DIRECT ASSETS SYNC ]</span>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Resume PDF uploaded and synced to GitHub successfully!</span>
          </div>
        )}

        <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="font-sora font-extrabold text-xl text-[var(--text-main)]">Upload Updated PDF Document</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Upload your latest resume PDF here. It will directly update `assets/resume.pdf` in your GitHub repository and refresh download links across the public site.
            </p>
          </div>

          <div className="border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--text-main)] rounded-2xl p-12 text-center relative transition-all bg-[var(--bg-main)] group">
            {saving ? (
              <div className="text-emerald-400 text-xs font-bold uppercase tracking-widest animate-pulse flex flex-col items-center gap-3">
                <Upload className="w-6 h-6 animate-bounce" />
                <span>Uploading PDF to GitHub Repository...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <FileText className="w-8 h-8 text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" />
                <div className="font-bold text-xs text-[var(--text-main)] uppercase tracking-wider">Select PDF Document</div>
                <div className="text-[11px] text-[var(--text-muted)]">Must be a valid .pdf file format</div>
                
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={saving}
                />
              </div>
            )}
          </div>

          {about?.resumeUrl && (
            <div className="pt-6 border-t border-[var(--border-subtle)] space-y-2">
              <h4 className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Active Public Resume Link</h4>
              <a 
                href={about.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-[var(--text-main)] hover:underline break-all inline-flex items-center gap-1.5 font-bold"
              >
                <span>{about.resumeUrl}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
