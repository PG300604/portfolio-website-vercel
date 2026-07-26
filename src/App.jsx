import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes as SwitchRoutes, Route as SingleRoute } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './shared/ProtectedRoute';

// Admin Views
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import ProjectsAdmin from './admin/ProjectsAdmin';
import SkillsAdmin from './admin/SkillsAdmin';
import CertsAdmin from './admin/CertsAdmin';
import AboutAdmin from './admin/AboutAdmin';
import VisibilityAdmin from './admin/VisibilityAdmin';
import ResumeAdmin from './admin/ResumeAdmin';
import TimelineAdmin from './admin/TimelineAdmin';
import MediaAdmin from './admin/MediaAdmin';
import BlogsAdmin from './admin/BlogsAdmin';
import SettingsAdmin from './admin/SettingsAdmin';

// Jordi Garreta Theme Components
import LoaderOverlay from './components/shared/LoaderOverlay';
import CursorFollower from './components/shared/CursorFollower';
import JordiHeader from './components/shared/JordiHeader';
import BottomDock from './components/shared/BottomDock';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import TechStack from './components/TechStack/TechStack';
import Projects from './components/Projects/Projects';
import Certifications from './components/Certifications/Certifications';
import Timeline from './components/Timeline/Timeline';
import Media from './components/Media/Media';
import Blogs from './components/Blogs/Blogs';
import Contact from './components/Contact/Contact';
import Footer from './components/shared/Footer';

// React Bits Components
import FlowingMenu from './components/ReactBits/FlowingMenu';
import GradualBlur from './components/ReactBits/GradualBlur';

function PublicLayout() {
  const [theme, setTheme] = useState('dark'); // 'dark' | 'cream'
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | 'list'
  const [activeSection, setActiveSection] = useState('projects');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'cream' : 'dark'));
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'projects', 'about', 'stack', 'contact'];
      const scrollPos = window.scrollY + 300;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const flowingMenuItems = [
    { 
      link: '#projects', 
      text: '01. SELECTED WORKS & 3D STAGE ↗', 
      image: '/menu-projects.jpg' 
    },
    { 
      link: '#about', 
      text: '02. ENGINEERING PRACTICE & BIO ↗', 
      image: '/menu-about.jpg' 
    },
    { 
      link: '#stack', 
      text: '03. CORE TECH STACK & SPECS ↗', 
      image: '/menu-stack.jpg' 
    },
    { 
      link: '#contact', 
      text: '04. INITIATE COLLABORATION ↗', 
      image: '/menu-contact.jpg' 
    },
  ];

  return (
    <div className="bg-[var(--bg-main)] min-h-screen font-sora text-[var(--text-main)] transition-colors duration-400 relative">
      <LoaderOverlay />
      <CursorFollower />
      <JordiHeader />

      {/* GradualBlur background scroll overlay at zIndex 5 */}
      <GradualBlur
        target="page"
        position="top"
        height="5rem"
        strength={1.2}
        divCount={5}
        curve="bezier"
        zIndex={5}
      />
      <GradualBlur
        target="page"
        position="bottom"
        height="5rem"
        strength={1.2}
        divCount={5}
        curve="bezier"
        zIndex={5}
      />

      <main>
        <Hero />

        {/* React Bits FlowingMenu Marquee Navigation — Positioned Right After Hero with Custom 3D Artwork */}
        <div className="my-12 py-8 border-y border-[var(--border-subtle)] overflow-hidden relative z-10 bg-[var(--card-bg)]/40 backdrop-blur-md">
          <FlowingMenu items={flowingMenuItems} speed={14} />
        </div>

        <Projects viewMode={viewMode} />
        <About />
        <TechStack />
        <Certifications />
        <Timeline />
        <Media />
        <Blogs />
        <Contact />
      </main>

      <Footer />

      <BottomDock
        activeSection={activeSection}
        viewMode={viewMode}
        setViewMode={setViewMode}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <SwitchRoutes>
          <SingleRoute path="/" element={<PublicLayout />} />
          <SingleRoute path="/admin" element={<Login />} />
          
          <SingleRoute path="/admin/*" element={<ProtectedRoute />}>
            <SingleRoute path="dashboard" element={<Dashboard />} />
            <SingleRoute path="projects" element={<ProjectsAdmin />} />
            <SingleRoute path="skills" element={<SkillsAdmin />} />
            <SingleRoute path="certs" element={<CertsAdmin />} />
            <SingleRoute path="about" element={<AboutAdmin />} />
            <SingleRoute path="visibility" element={<VisibilityAdmin />} />
            <SingleRoute path="resume" element={<ResumeAdmin />} />
            <SingleRoute path="timeline" element={<TimelineAdmin />} />
            <SingleRoute path="media" element={<MediaAdmin />} />
            <SingleRoute path="blogs" element={<BlogsAdmin />} />
            <SingleRoute path="settings" element={<SettingsAdmin />} />
            <SingleRoute path="*" element={<Dashboard />} />
          </SingleRoute>
        </SwitchRoutes>
      </Router>
    </AuthProvider>
  );
}

export default App;
