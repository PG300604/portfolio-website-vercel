import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGitHubData } from '../hooks/useGitHubData';

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
    <div className="min-h-screen bg-[#060a14] p-8 text-[#f0f6ff]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b-2 border-[#1e2d4a] pb-6">
          <div>
            <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
              // CONTROL_CENTER
            </div>
            <h1 className="text-4xl font-sora font-bold">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-transparent text-[#8fa3c0] border-none font-mono text-[13px] underline hover:text-[#388bfd] cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0d1525] border-2 border-[#1A56DB] p-6 border-t-[4px] border-t-[#1A56DB]">
            <h3 className="font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">Projects Count</h3>
            <div className="text-4xl font-sora font-bold">{pLoading ? '-' : projects?.length || 0}</div>
          </div>
          <div className="bg-[#0d1525] border-2 border-[#1A56DB] p-6 border-t-[4px] border-t-[#1A56DB]">
            <h3 className="font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">Certifications</h3>
            <div className="text-4xl font-sora font-bold">{cLoading ? '-' : certs?.length || 0}</div>
          </div>
          <div className="bg-[#0d1525] border-2 border-[#1A56DB] p-6 border-t-[4px] border-t-[#4fcea6]">
            <h3 className="font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">Status</h3>
            <div className="text-2xl font-sora font-bold text-[#4fcea6] mt-2">All Systems Go</div>
          </div>
        </div>

        <div>
          <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-4">
            // MODULES
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardLink to="/admin/projects" label="Projects" />
            <DashboardLink to="/admin/skills" label="Skills" />
            <DashboardLink to="/admin/certs" label="Certifications" />
            <DashboardLink to="/admin/timeline" label="Experience Timeline" />
            <DashboardLink to="/admin/media" label="Media & Socials" />
            <DashboardLink to="/admin/blogs" label="Blogs & Events" />
            <DashboardLink to="/admin/about" label="About & Stats" />
            <DashboardLink to="/admin/visibility" label="Visibility Toggles" />
            <DashboardLink to="/admin/resume" label="Resume PDF" />
            <DashboardLink to="/admin/settings" label="Settings & Security" />
            <DashboardLink to="/" label="View Public Site" external />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardLink({ to, label, external }) {
  if (external) {
    return (
      <a href={to} className="block bg-[#0d1525] border-2 border-[#1e2d4a] p-4 font-mono text-[13px] hover:border-[#388bfd] transition-colors rounded-none text-center uppercase tracking-wider">
        {label} ↗
      </a>
    );
  }
  return (
    <Link to={to} className="block bg-[#0d1525] border-2 border-[#1e2d4a] p-4 font-mono text-[13px] hover:border-[#388bfd] hover:bg-[#1A56DB] hover:text-[#f0f6ff] transition-colors rounded-none text-center uppercase tracking-wider">
      {label}
    </Link>
  );
}
