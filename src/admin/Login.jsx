import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { writeGitHubData } from '../hooks/useGitHubWrite';

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
        setLoginError('Invalid admin secret');
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
    <div className="min-h-screen bg-[#060a14] flex items-center justify-center p-4">
      <div className="bg-[#0d1525] border-2 border-[#1A56DB] p-8 w-full max-w-md border-t-[4px] border-t-[#1A56DB]">
        
        {/* LOGIN MODE */}
        {mode === 'login' && (
          <>
            <div className="mb-8">
              <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
                // SECURE_ZONE
              </div>
              <h1 className="text-3xl font-sora font-bold text-[#f0f6ff]">Admin Access</h1>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] uppercase tracking-widest mb-2">
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0d1525] text-[#f0f6ff] border-2 border-[#1e2d4a] p-[10px] pr-10 font-mono text-sm focus:border-3 focus:border-[#1A56DB] focus:outline-none hover:border-[#388bfd] transition-colors rounded-none"
                    placeholder="Enter admin secret..."
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fa3c0] hover:text-[#388bfd] focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {loginError && <p className="text-[#e55353] text-sm mt-2 font-mono">{loginError}</p>}
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="font-mono text-[11px] text-[#8fa3c0] hover:text-[#388bfd] underline bg-transparent border-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="bg-[#1A56DB] text-[#f0f6ff] border-[3px] border-[#1A56DB] px-7 py-3 font-mono font-bold text-[13px] uppercase tracking-[0.1em] hover:bg-[#388bfd] hover:border-[#388bfd] active:bg-[#0f3d9e] transition-colors rounded-none disabled:opacity-50"
              >
                {loginLoading ? 'Authenticating...' : 'Authenticate'}
              </button>
            </form>
          </>
        )}

        {/* FORGOT PASSWORD MODE */}
        {mode === 'forgot' && (
          <>
            <div className="mb-8">
              <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
                // PASSWORD_RECOVERY
              </div>
              <h1 className="text-2xl font-sora font-bold text-[#f0f6ff]">Verify Identity</h1>
            </div>

            {!credentials?.questions || credentials.questions.length < 2 ? (
              <div className="space-y-6">
                <p className="text-sm font-mono text-[#8fa3c0] leading-relaxed">
                  No security recovery questions have been configured for this portfolio yet. 
                </p>
                <div className="bg-[#e55353]/10 border border-[#e55353] text-[#e55353] p-4 font-mono text-xs leading-relaxed">
                  Please log in using your default Secret Key from the local environment configurations, and set up your questions inside Settings.
                </div>
                <button
                  onClick={() => setMode('login')}
                  className="w-full bg-[#060a14] text-[#8fa3c0] border-2 border-[#1e2d4a] py-3 font-mono text-xs uppercase hover:border-[#388bfd] hover:text-white"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecoverySubmit} className="flex flex-col gap-6">
                {recoveryError && <div className="bg-[#e55353]/10 border border-[#e55353] text-[#e55353] p-3 text-xs font-mono">{recoveryError}</div>}
                
                <div>
                  <label className="block font-mono text-[11px] text-[#4fcea6] uppercase tracking-wider mb-2">
                    Question 1: {credentials.questions[0].question}
                  </label>
                  <input
                    type="text"
                    value={ans1}
                    onChange={(e) => setAns1(e.target.value)}
                    className="w-full bg-[#0d1525] text-[#f0f6ff] border-2 border-[#1e2d4a] p-[10px] font-mono text-sm focus:border-[#1A56DB] focus:outline-none"
                    placeholder="Enter answer..."
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-[#4fcea6] uppercase tracking-wider mb-2">
                    Question 2: {credentials.questions[1].question}
                  </label>
                  <input
                    type="text"
                    value={ans2}
                    onChange={(e) => setAns2(e.target.value)}
                    className="w-full bg-[#0d1525] text-[#f0f6ff] border-2 border-[#1e2d4a] p-[10px] font-mono text-sm focus:border-[#1A56DB] focus:outline-none"
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
                    className="flex-1 bg-transparent border-2 border-[#1e2d4a] text-[#8fa3c0] py-3 font-mono text-xs uppercase hover:text-white hover:border-[#8fa3c0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="flex-1 bg-[#1A56DB] text-white py-3 font-mono font-bold text-xs uppercase hover:bg-[#388bfd] disabled:opacity-50"
                  >
                    {recoveryLoading ? 'VERIFYING...' : 'VERIFY ANSWERS'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* RESET PASSWORD MODE */}
        {mode === 'reset' && (
          <>
            <div className="mb-8">
              <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
                // PASSWORD_RESET
              </div>
              <h1 className="text-2xl font-sora font-bold text-[#f0f6ff]">Set New Password</h1>
            </div>

            <form onSubmit={handleResetSubmit} className="flex flex-col gap-6">
              {resetError && <div className="bg-[#e55353]/10 border border-[#e55353] text-[#e55353] p-3 text-xs font-mono">{resetError}</div>}

              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0d1525] text-[#f0f6ff] border-2 border-[#1e2d4a] p-[10px] font-mono text-sm focus:border-[#1A56DB] focus:outline-none"
                  placeholder="At least 6 characters..."
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0d1525] text-[#f0f6ff] border-2 border-[#1e2d4a] p-[10px] font-mono text-sm focus:border-[#1A56DB] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-[#4fcea6] text-[#060a14] py-3 font-mono font-bold text-xs uppercase hover:bg-[#3db892] disabled:opacity-50"
              >
                {resetLoading ? 'SAVING...' : 'RESET PASSWORD & LOGIN'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
