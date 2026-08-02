import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, Key, AlertCircle, CheckCircle2, Save } from 'lucide-react';

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

const DEFAULT_QUESTIONS = [
  "What was the name of your first elementary school?",
  "What is your mother's maiden name?",
  "What was the model of your first car?",
  "In what city were you born?",
  "What is the name of your favorite childhood pet?",
  "What was your first job?"
];

export default function SettingsAdmin() {
  const { credentials, refetchCredentials } = useAuth();
  
  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState(null);
  const [passSuccess, setPassSuccess] = useState(false);

  // Questions Form States
  const [q1, setQ1] = useState(DEFAULT_QUESTIONS[0]);
  const [a1, setA1] = useState('');
  const [q2, setQ2] = useState(DEFAULT_QUESTIONS[1]);
  const [a2, setA2] = useState('');
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState(null);
  const [questionSuccess, setQuestionSuccess] = useState(false);

  useEffect(() => {
    if (credentials?.questions && credentials.questions.length >= 2) {
      queueMicrotask(() => {
        setQ1(credentials.questions[0].question);
        setQ2(credentials.questions[1].question);
      });
    }
  }, [credentials]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassError(null);
    setPassSuccess(false);

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      setPassLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPassError('Password must be at least 6 characters long');
      setPassLoading(false);
      return;
    }

    try {
      const hashedCurrent = await hashString(currentPassword);
      let isValidCurrent = false;

      if (credentials && credentials.passwordHash) {
        isValidCurrent = hashedCurrent === credentials.passwordHash;
      } else {
        const DEFAULT_SECRET = import.meta.env.VITE_ADMIN_SECRET;
        isValidCurrent = currentPassword === DEFAULT_SECRET;
      }

      if (!isValidCurrent) {
        setPassError('Current password is incorrect');
        setPassLoading(false);
        return;
      }

      const newHash = await hashString(newPassword);

      const updatedCredentials = {
        passwordHash: newHash,
        questions: credentials?.questions || []
      };

      await writeGitHubData('credentials.json', updatedCredentials);
      setPassSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      refetchCredentials();
    } catch (err) {
      setPassError(err.message || 'Failed to update password');
    } finally {
      setPassLoading(false);
    }
  };

  const handleQuestionsChange = async (e) => {
    e.preventDefault();
    setQuestionLoading(true);
    setQuestionError(null);
    setQuestionSuccess(false);

    if (q1 === q2) {
      setQuestionError('Please select two different security questions');
      setQuestionLoading(false);
      return;
    }

    if (!a1 || !a2) {
      setQuestionError('Answers cannot be empty');
      setQuestionLoading(false);
      return;
    }

    try {
      const hash1 = await hashAnswer(a1);
      const hash2 = await hashAnswer(a2);

      const currentPasswordHash = credentials?.passwordHash;
      if (!currentPasswordHash) {
        setQuestionError('Please set a custom admin password first before setting security questions');
        setQuestionLoading(false);
        return;
      }

      const updatedCredentials = {
        passwordHash: currentPasswordHash,
        questions: [
          { question: q1, answerHash: hash1 },
          { question: q2, answerHash: hash2 }
        ]
      };

      await writeGitHubData('credentials.json', updatedCredentials);
      setQuestionSuccess(true);
      setA1('');
      setA2('');
      refetchCredentials();
    } catch (err) {
      setQuestionError(err.message || 'Failed to update security questions');
    } finally {
      setQuestionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 sm:p-8 font-mono-custom">
      <div className="max-w-5xl mx-auto space-y-8">
        
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
            <h1 className="text-2xl sm:text-3xl font-sora font-extrabold">Account & Security Settings</h1>
          </div>
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">[ SHA-256 ENCRYPTED CREDENTIALS ]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Change Password Form */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)] text-xs text-[var(--text-main)] uppercase font-bold">
                <Lock className="w-4 h-4 text-[var(--accent-glow)]" />
                <span>Change Admin Password</span>
              </div>

              {passError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}
              {passSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Password updated successfully!</span>
                </div>
              )}

              <form id="pass-form" onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                    required
                  />
                </div>
              </form>
            </div>

            <button 
              type="submit" 
              form="pass-form"
              disabled={passLoading}
              className="w-full bg-[var(--text-main)] text-[var(--bg-main)] font-bold text-xs uppercase px-6 py-3.5 rounded-full hover:opacity-90 transition-all shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              <span>{passLoading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>

          {/* Security Questions Setup */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)] text-xs text-[var(--text-main)] uppercase font-bold">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-glow)]" />
                <span>Recovery Security Questions</span>
              </div>

              {questionError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{questionError}</span>
                </div>
              )}
              {questionSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Security questions configured successfully!</span>
                </div>
              )}

              <form id="q-form" onSubmit={handleQuestionsChange} className="space-y-4">
                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Question 1</label>
                  <select 
                    value={q1}
                    onChange={(e) => setQ1(e.target.value)}
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                  >
                    {DEFAULT_QUESTIONS.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Answer 1</label>
                  <input 
                    type="text" 
                    value={a1}
                    onChange={(e) => setA1(e.target.value)}
                    placeholder="Enter answer (case-insensitive)..."
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Question 2</label>
                  <select 
                    value={q2}
                    onChange={(e) => setQ2(e.target.value)}
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                  >
                    {DEFAULT_QUESTIONS.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Answer 2</label>
                  <input 
                    type="text" 
                    value={a2}
                    onChange={(e) => setA2(e.target.value)}
                    placeholder="Enter answer (case-insensitive)..."
                    className="w-full bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] focus:border-[var(--text-main)] rounded-xl px-4 py-2.5 text-xs outline-none transition-colors"
                    required
                  />
                </div>
              </form>
            </div>

            <button 
              type="submit" 
              form="q-form"
              disabled={questionLoading}
              className="w-full bg-[var(--text-main)] text-[var(--bg-main)] font-bold text-xs uppercase px-6 py-3.5 rounded-full hover:opacity-90 transition-all shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{questionLoading ? 'Saving...' : 'Save Security Questions'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
