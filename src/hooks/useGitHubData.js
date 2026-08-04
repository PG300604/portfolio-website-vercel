import { useState, useEffect, useCallback } from 'react';

export function useGitHubData(filename) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const owner = import.meta.env.VITE_GH_OWNER;
    const repo = import.meta.env.VITE_GH_REPO;
    const branch = import.meta.env.VITE_GH_BRANCH || 'main';

    if (!owner || !repo) {
      setError(new Error('GitHub owner or repo not configured in .env'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/data/${filename}?t=${timestamp}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          // Fallback gracefully for missing JSON files
          if (filename.includes('visibility')) {
            setData({ hero: true, about: true, stack: true, projects: true, certifications: true, timeline: true, media: true, blogs: true, contact: true });
          } else if (filename.includes('about')) {
            setData({
              bio: "Independent software developer shaping digital products, full-stack architectures, and intuitive web experiences.",
              degree: "B.Tech in Computer Science & Engineering",
              college: "Techno Main Salt Lake",
              year: "3rd Year Student",
              location: "Giridih, India",
              sgpa: "9.2",
              projectsCount: "12+",
              email: "priyanshughosh97@gmail.com",
              heroRoles: "Full Stack Engineer, Java Spring Boot Specialist, UI Architect",
              linkedin: "https://linkedin.com/in/priyanshu-ghosh-",
              github: "https://github.com/PG300604",
              instagram: "https://instagram.com/"
            });
          } else {
            setData([]);
          }
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch ${filename}: ${res.statusText}`);
      }

      const jsonData = await res.json();
      setData(jsonData);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error(`useGitHubData Error [${filename}]:`, err);
      setError(err);
      setLoading(false);
    }
  }, [filename]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
