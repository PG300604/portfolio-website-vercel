import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGitHubData } from '../hooks/useGitHubData';
import { FolderKanban, Award, ShieldCheck, ExternalLink, LogOut, Code, Layers, FileText, Settings, Eye, Clock, Image, BookOpen } from 'lucide-react';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const { data: projects, loading: pLoading } = useGitHubData('projects.json');
  const { data: certs, loading: cLoading } = useGitHubData('certifications.json');

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-8 text-[var(--text-main)] font-sora">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <div className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">
              [ 00 / ADMINISTRATIVE CONTROL CENTER ]
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">System Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="font-mono-custom text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-red-400 transition-colors flex items-center gap-2 cursor-pointer bg-[var(--card-bg)] px-4 py-2 rounded-full border border-[var(--border-subtle)]"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-8 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between font-mono-custom text-xs text-[var(--text-muted)] uppercase border-b border-[var(--border-subtle)] pb-3">
              <span>PROJECTS MODULE</span>
              <FolderKanban className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-5xl font-extrabold">{pLoading ? '-' : projects?.length || 0}</div>
            <p className="font-mono-custom text-xs text-[var(--text-muted)]">3D Floating Posters & Details</p>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-8 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between font-mono-custom text-xs text-[var(--text-muted)] uppercase border-b border-[var(--border-subtle)] pb-3">
              <span>CERTIFICATIONS</span>
              <Award className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-5xl font-extrabold">{cLoading ? '-' : certs?.length || 0}</div>
            <p className="font-mono-custom text-xs text-[var(--text-muted)]">Verified Industry Credentials</p>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-8 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between font-mono-custom text-xs text-[var(--text-muted)] uppercase border-b border-[var(--border-subtle)] pb-3">
              <span>SYSTEM STATUS</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-mono-custom font-bold text-emerald-400 pt-2">[ 100% OPERATIONAL ]</div>
            <p className="font-mono-custom text-xs text-[var(--text-muted)]">GitHub Direct API Sync Active</p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="space-y-6">
          <div className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest">
            // EDITORIAL MANAGEMENT MODULES
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-mono-custom text-xs">
            <DashboardLink to="/admin/projects" label="Manage Projects & 3D Cards" icon={<FolderKanban className="w-4 h-4 text-emerald-400" />} />
            <DashboardLink to="/admin/skills" label="Technical Skills & Modules" icon={<Code className="w-4 h-4 text-sky-400" />} />
            <DashboardLink to="/admin/certs" label="Certifications & Badges" icon={<Award className="w-4 h-4 text-amber-400" />} />
            <DashboardLink to="/admin/timeline" label="Experience & History" icon={<Clock className="w-4 h-4 text-purple-400" />} />
            <DashboardLink to="/admin/media" label="Media Assets & Links" icon={<Image className="w-4 h-4 text-emerald-400" />} />
            <DashboardLink to="/admin/blogs" label="Blogs & Publications" icon={<BookOpen className="w-4 h-4 text-sky-400" />} />
            <DashboardLink to="/admin/about" label="About & Biography" icon={<FileText className="w-4 h-4 text-amber-400" />} />
            <DashboardLink to="/admin/visibility" label="Section Visibility Toggles" icon={<Eye className="w-4 h-4 text-purple-400" />} />
            <DashboardLink to="/admin/resume" label="Resume PDF Configuration" icon={<FileText className="w-4 h-4 text-emerald-400" />} />
            <DashboardLink to="/admin/settings" label="Security & API Settings" icon={<Settings className="w-4 h-4 text-sky-400" />} />
            <DashboardLink to="/" label="View Public Website" external icon={<ExternalLink className="w-4 h-4 text-amber-400" />} />
          </div>
        </div>

      </div>
    </div>
  );
}

function DashboardLink({ to, label, external, icon }) {
  if (external) {
    return (
      <a 
        href={to} 
        className="bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] p-5 rounded-2xl flex items-center justify-between transition-all group shadow-md uppercase tracking-wider"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-bold text-[var(--text-main)]">{label}</span>
        </div>
        <span className="text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform">↗</span>
      </a>
    );
  }
  return (
    <Link 
      to={to} 
      className="bg-[var(--card-bg)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] p-5 rounded-2xl flex items-center justify-between transition-all group shadow-md uppercase tracking-wider"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-bold text-[var(--text-main)]">{label}</span>
      </div>
      <span className="text-[var(--text-muted)] group-hover:translate-x-1 transition-transform">➔</span>
    </Link>
  );
}
