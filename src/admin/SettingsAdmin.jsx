import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { writeGitHubData } from '../hooks/useGitHubWrite';
import { Link } from 'react-router-dom';

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

      // Create new credentials structure
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
    <div className="min-h-screen bg-[#060a14] p-8 text-[#f0f6ff]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-2 border-[#1e2d4a] pb-6">
          <div>
            <div className="font-mono text-[11px] text-[#4fcea6] uppercase tracking-widest mb-2">
              <Link to="/admin/dashboard" className="text-[#8fa3c0] hover:text-[#388bfd]">Dashboard</Link> / SETTINGS & SECURITY
            </div>
            <h1 className="text-3xl font-sora font-bold">Account Settings</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Change Password Form */}
          <div className="bg-[#0d1525] border-2 border-[#1A56DB] p-6 border-t-[4px] border-t-[#1A56DB] flex flex-col h-full">
            <h3 className="font-mono text-[13px] text-[#1A56DB] uppercase tracking-widest mb-4 border-b border-[#1e2d4a] pb-2 font-bold">// CHANGE_PASSWORD</h3>
            
            {passError && <div className="bg-[#e55353]/10 border border-[#e55353] text-[#e55353] p-3 text-xs mb-4 font-mono">{passError}</div>}
            {passSuccess && <div className="bg-[#4fcea6]/10 border border-[#4fcea6] text-[#4fcea6] p-3 text-xs mb-4 font-mono">Password updated successfully!</div>}

            <form onSubmit={handlePasswordChange} className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={passLoading}
                className="w-full mt-auto bg-[#1A56DB] text-white py-3 font-mono font-bold hover:bg-[#388bfd] transition-colors disabled:opacity-50 text-[12px] tracking-[0.1em]"
              >
                {passLoading ? 'CHANGING...' : 'UPDATE PASSWORD'}
              </button>
            </form>
          </div>

          {/* Security Questions Setup */}
          <div className="bg-[#0d1525] border-2 border-[#1A56DB] p-6 border-t-[4px] border-t-[#4fcea6] flex flex-col h-full">
            <h3 className="font-mono text-[13px] text-[#4fcea6] uppercase tracking-widest mb-4 border-b border-[#1e2d4a] pb-2 font-bold">// RECOVERY_QUESTIONS</h3>
            
            {questionError && <div className="bg-[#e55353]/10 border border-[#e55353] text-[#e55353] p-3 text-xs mb-4 font-mono">{questionError}</div>}
            {questionSuccess && <div className="bg-[#4fcea6]/10 border border-[#4fcea6] text-[#4fcea6] p-3 text-xs mb-4 font-mono">Security questions configured successfully!</div>}

            <form onSubmit={handleQuestionsChange} className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Question 1</label>
                <select 
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                >
                  {DEFAULT_QUESTIONS.map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Answer 1</label>
                <input 
                  type="text" 
                  value={a1}
                  onChange={(e) => setA1(e.target.value)}
                  placeholder="Enter answer (case-insensitive)..."
                  className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Question 2</label>
                <select 
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                >
                  {DEFAULT_QUESTIONS.map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[#8fa3c0] mb-1">Answer 2</label>
                <input 
                  type="text" 
                  value={a2}
                  onChange={(e) => setA2(e.target.value)}
                  placeholder="Enter answer (case-insensitive)..."
                  className="w-full bg-[#060a14] border border-[#1e2d4a] p-2 text-[#f0f6ff] focus:border-[#388bfd] outline-none font-mono text-sm"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={questionLoading}
                className="w-full mt-auto bg-[#4fcea6] text-[#060a14] py-3 font-mono font-bold hover:bg-[#3db892] transition-colors disabled:opacity-50 text-[12px] tracking-[0.1em]"
              >
                {questionLoading ? 'SAVING...' : 'SAVE RECOVERY CONFIG'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
