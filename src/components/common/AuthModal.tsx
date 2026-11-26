import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../services/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, login, register, logout, migrateGuestData } = useAppStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRegistering(false);
      setUsername('');
      setEmail('');
      setPassword('');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (!username.trim()) {
          setErrorMsg('Username is required.');
          setIsLoading(false);
          return;
        }
        const res = await register(username, email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed.');
        } else {
          setSuccessMsg('Account created. Syncing your guest progress...');
          await migrateGuestData();
          setTimeout(() => onClose(), 900);
        }
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Invalid credentials.');
        } else {
          setSuccessMsg('Signed in.');
          await migrateGuestData();
          setTimeout(() => onClose(), 900);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Operation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    setErrorMsg('');
    const res = await migrateGuestData();
    if (res.success) {
      setSuccessMsg(res.message || 'Progress synchronized with your account.');
    } else {
      setErrorMsg(res.message || 'Sync failed.');
    }
    setIsLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="ui-dialog-enter relative w-full max-w-md bg-[#101319] border border-white/12 rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Keyline */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="auth-modal-title" className="text-lg font-semibold text-white">
              {user.isGuest
                ? isRegistering
                  ? 'Create Doomflix Account'
                  : 'Sign In to Doomflix'
                : 'Account & Cloud Sync'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {user.isGuest
                ? 'Sync watchlists, progress, badges, and quiz scores across devices.'
                : `${user.username} (${user.email || 'Cloud synced'})`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="ui-press ui-press--on-dark ui-focus w-8 h-8 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white flex items-center justify-center shrink-0"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="p-3 bg-rose-500/10 border border-rose-500/35 rounded-xl text-xs text-rose-200 flex items-center gap-2"
          >
            <AlertCircle size={14} className="shrink-0 text-rose-400" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            role="status"
            className="p-3 bg-emerald-500/10 border border-emerald-500/35 rounded-xl text-xs text-emerald-200 flex items-center gap-2"
          >
            <CheckCircle2 size={14} className="shrink-0 text-emerald-400" aria-hidden="true" />
            <span>{successMsg}</span>
          </div>
        )}

        {!user.isGuest ? (
          <div className="space-y-4">
            <div className="bg-[#090a0f] p-4 rounded-xl border border-white/10 space-y-3 text-xs">
              <div>
                <div className="text-slate-400">Username</div>
                <div className="text-sm font-medium text-white mt-0.5">{user.username}</div>
              </div>
              <div>
                <div className="text-slate-400">Email</div>
                <div className="text-sm font-mono text-slate-200 mt-0.5">
                  {user.email || user.id}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isLoading}
                className="ui-press ui-focus h-9 w-full bg-white text-doom-950 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} aria-hidden="true" />
                <span>{isLoading ? 'Syncing...' : 'Sync Progress Now'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="ui-press ui-press--on-dark ui-focus h-9 w-full rounded-xl text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/25"
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label htmlFor="auth-username" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  id="auth-username"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="CaptainDoom616"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="ui-field w-full h-10 bg-[#090a0f] border border-white/14 rounded-xl px-3.5 text-sm text-white placeholder:text-slate-500"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ui-field w-full h-10 bg-[#090a0f] border border-white/14 rounded-xl px-3.5 text-sm text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                required
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ui-field w-full h-10 bg-[#090a0f] border border-white/14 rounded-xl px-3.5 text-sm text-white placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="ui-press ui-focus h-10 w-full bg-white text-doom-950 font-semibold rounded-xl text-sm flex items-center justify-center gap-2"
            >
              {isLoading && <RefreshCw size={15} className="animate-spin" aria-hidden="true" />}
              <span>
                {isLoading
                  ? isRegistering
                    ? 'Creating account...'
                    : 'Signing in...'
                  : isRegistering
                  ? 'Create account & sync'
                  : 'Sign In'}
              </span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="ui-dim ui-focus text-xs text-emerald-400 hover:text-emerald-300 py-1 px-2 rounded-md"
              >
                {isRegistering
                  ? 'Already have an account? Sign in'
                  : 'New here? Create an account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
