import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { Shield, Eye, EyeOff, Lock, Key, Check } from 'lucide-react';

async function hashString(str) {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashAnswer(str) {
  const normalized = str.toLowerCase().trim().replace(/\s+/g, ' ');
  return hashString(normalized);
}

export default function Login() {
  const { login, credentials, refetchCredentials } = useAuth();
  const navigate = useNavigate();

  // Mode: 'login', 'forgot', 'reset'
  const [mode, setMode] = useState('login');

  // Login States
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Recovery States
  const [ans1, setAns1] = useState('');
  const [ans2, setAns2] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  // Reset States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const success = await login(password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setLoginError('Invalid admin secret key');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setRecoveryLoading(true);
    setRecoveryError('');

    try {
      if (!credentials?.questions || credentials.questions.length < 2) {
        setRecoveryError('No security questions set up yet.');
        setRecoveryLoading(false);
        return;
      }

      const hash1 = await hashAnswer(ans1);
      const hash2 = await hashAnswer(ans2);

      const targetHash1 = credentials.questions[0].answerHash;
      const targetHash2 = credentials.questions[1].answerHash;

      if (hash1 === targetHash1 && hash2 === targetHash2) {
        setMode('reset');
      } else {
        setRecoveryError('Security answers are incorrect');
      }
    } catch (err) {
      setRecoveryError(err.message || 'Recovery failed');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      setResetLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long');
      setResetLoading(false);
      return;
    }

    try {
      const newHash = await hashString(newPassword);
      const updated = {
        passwordHash: newHash,
        questions: credentials.questions
      };

      await writeGitHubData('credentials.json', updated);
      await refetchCredentials();
      
      // Auto login
      const success = await login(newPassword);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setMode('login');
      }
    } catch (err) {
      setResetError(err.message || 'Reset failed');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-6 text-[var(--text-main)] font-sora">
      <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-8 sm:p-10 w-full max-w-md rounded-3xl shadow-2xl space-y-8">
        
        {/* LOGIN MODE */}
        {mode === 'login' && (
          <>
            <div>
              <div className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>// SECURE ADMINISTRATIVE GATEWAY</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">Admin Authentication</h1>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6 font-mono-custom text-xs">
              <div>
                <label className="block text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3.5 pr-12 rounded-xl outline-none"
                    placeholder="Enter admin secret..."
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginError && <p className="text-red-400 text-xs mt-2 font-mono-custom">{loginError}</p>}
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="font-mono-custom text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] underline bg-transparent border-none cursor-pointer"
                >
                  Forgot Secret Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-[var(--text-main)] text-[var(--bg-main)] font-bold py-3.5 rounded-full uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{loginLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}</span>
              </button>
            </form>
          </>
        )}

        {/* FORGOT PASSWORD MODE */}
        {mode === 'forgot' && (
          <>
            <div>
              <div className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-sky-400" />
                <span>// IDENTITY RECOVERY</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">Security Verification</h1>
            </div>

            {!credentials?.questions || credentials.questions.length < 2 ? (
              <div className="space-y-6 font-mono-custom text-xs">
                <p className="text-[var(--text-muted)] leading-relaxed">
                  No security recovery questions have been configured for this portfolio yet. 
                </p>
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl leading-relaxed">
                  Please log in using your default Secret Key, and set up your questions inside Security Settings.
                </div>
                <button
                  onClick={() => setMode('login')}
                  className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] py-3 rounded-full uppercase font-bold hover:border-[var(--text-main)]"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecoverySubmit} className="space-y-6 font-mono-custom text-xs">
                {recoveryError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl">{recoveryError}</div>}
                
                <div>
                  <label className="block text-emerald-400 uppercase tracking-wider mb-2">
                    Q1: {credentials.questions[0].question}
                  </label>
                  <input
                    type="text"
                    value={ans1}
                    onChange={(e) => setAns1(e.target.value)}
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3.5 rounded-xl outline-none"
                    placeholder="Enter answer..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-emerald-400 uppercase tracking-wider mb-2">
                    Q2: {credentials.questions[1].question}
                  </label>
                  <input
                    type="text"
                    value={ans2}
                    onChange={(e) => setAns2(e.target.value)}
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3.5 rounded-xl outline-none"
                    placeholder="Enter answer..."
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setRecoveryError('');
                      setAns1('');
                      setAns2('');
                    }}
                    className="flex-1 bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] py-3.5 rounded-full uppercase font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="flex-1 bg-[var(--text-main)] text-[var(--bg-main)] font-bold py-3.5 rounded-full uppercase tracking-wider hover:opacity-90"
                  >
                    {recoveryLoading ? 'VERIFYING...' : 'VERIFY'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* RESET PASSWORD MODE */}
        {mode === 'reset' && (
          <>
            <div>
              <div className="font-mono-custom text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>// PASSWORD RESET</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">Configure New Password</h1>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-6 font-mono-custom text-xs">
              {resetError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl">{resetError}</div>}

              <div>
                <label className="block text-[var(--text-muted)] mb-2 uppercase">New Secret Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3.5 rounded-xl outline-none"
                  placeholder="At least 6 characters..."
                  required
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] mb-2 uppercase">Confirm New Secret Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] p-3.5 rounded-xl outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-[var(--text-main)] text-[var(--bg-main)] font-bold py-3.5 rounded-full uppercase tracking-wider hover:opacity-90 shadow-xl"
              >
                {resetLoading ? 'SAVING...' : 'SAVE & LOGIN'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
