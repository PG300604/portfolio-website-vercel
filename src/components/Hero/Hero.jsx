import { useState, useEffect } from 'react';
import { useGitHubData } from '../../hooks/useGitHubData';
import HeroText from './HeroText';
import GridScan from '../ReactBits/GridScan';

export default function Hero() {
  const { data: visibility } = useGitHubData('visibility.json');
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(currentTheme);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  if (visibility && !visibility.hero) return null;

  const isCream = theme === 'cream';

  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-[var(--bg-main)] overflow-hidden transition-colors duration-400">
      
      {/* Dynamic Theme-Aware GridScan 3D Background */}
      <GridScan
        key={theme}
        sensitivity={isCream ? 0.5 : 0.4}
        lineThickness={1}
        linesColor={isCream ? '#c8c5b8' : '#262626'}
        gridScale={0.08}
        scanColor={isCream ? '#141413' : '#ffffff'}
        scanOpacity={isCream ? 0.65 : 0.15}
        enablePost={true}
        bloomIntensity={isCream ? 0.05 : 0.2}
        chromaticAberration={0.001}
        noiseIntensity={0.005}
        scanGlow={isCream ? 1.5 : 0.5}
        scanDuration={2.0}
        scanDelay={2.0}
      />

      <HeroText />
    </section>
  );
}
