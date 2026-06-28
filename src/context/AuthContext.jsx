import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

async function hashString(str) {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState(null);

  const fetchCredentials = async () => {
    const owner = import.meta.env.VITE_GH_OWNER;
    const repo = import.meta.env.VITE_GH_REPO;
    const token = import.meta.env.VITE_GH_TOKEN;

    if (owner && repo && token) {
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/credentials.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3.raw',
            'Cache-Control': 'no-cache'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setCredentials(data);
          return data;
        }
      } catch (err) {
        console.error('Error fetching credentials:', err);
      }
    }
    return null;
  };

  useEffect(() => {
    const initAuth = async () => {
      await fetchCredentials();
      const isAuthed = localStorage.getItem('pg_admin') === 'true';
      setAuthed(isAuthed);
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (password) => {
    const hashedInput = await hashString(password);
    if (credentials && credentials.passwordHash) {
      if (hashedInput === credentials.passwordHash) {
        localStorage.setItem('pg_admin', 'true');
        setAuthed(true);
        return true;
      }
    } else {
      const SECRET = import.meta.env.VITE_ADMIN_SECRET;
      if (password === SECRET) {
        localStorage.setItem('pg_admin', 'true');
        setAuthed(true);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('pg_admin');
    setAuthed(false);
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ authed, login, logout, credentials, refetchCredentials: fetchCredentials }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
