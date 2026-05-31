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

  const fetchCredentials = () => {
    const owner = import.meta.env.VITE_GH_OWNER;
    const repo = import.meta.env.VITE_GH_REPO;
    const branch = import.meta.env.VITE_GH_BRANCH || 'main';

    if (owner && repo) {
      fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/data/credentials.json?t=${Date.now()}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setCredentials(data))
        .catch(() => {});
    }
  };

  useEffect(() => {
    fetchCredentials();
    const isAuthed = localStorage.getItem('pg_admin') === 'true';
    setAuthed(isAuthed);
    setLoading(false);
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
