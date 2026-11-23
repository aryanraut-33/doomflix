import React, { useState } from 'react';
import { X, Shield, LogIn, UserPlus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (!username.trim()) {
          setErrorMsg('Username is required');
          setIsLoading(false);
          return;
        }
        const res = await register(username, email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed');
        } else {
          setSuccessMsg('Account created successfully! Syncing guest progress...');
          await migrateGuestData();
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Invalid credentials');
        } else {
          setSuccessMsg('Logged in successfully!');
          await migrateGuestData();
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    const res = await migrateGuestData();
    if (res.success) {
      setSuccessMsg(res.message || 'Data synchronized successfully with Cloudflare D1!');
    } else {
      setErrorMsg(res.message || 'Sync failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-doom-900 border border-doom-border rounded-2xl p-6 md:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-doom-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-doom-red flex items-center justify-center shadow-glow-red mb-3">
            <Shield className="text-white" size={24} />
          </div>
          <h3 className="font-cinematic text-3xl uppercase tracking-wider text-white">
            {user.isGuest 
              ? (isRegistering ? 'Create Doomflix Account' : 'Authenticate Operative') 
              : 'Operative Credentials'}
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-sans">
            {user.isGuest
              ? 'Save your watch progress, custom collections, and quiz stats to Cloudflare D1 across all your devices.'
              : `Authenticated as ${user.username} (${user.email || 'Cloudflare D1 Account'})`}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-xs text-red-200 flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {!user.isGuest ? (
          // Authenticated User Panel
          <div className="space-y-4">
            <div className="bg-doom-950 p-4 rounded-xl border border-doom-border space-y-2">
              <div className="text-xs text-gray-400">Username</div>
              <div className="text-sm font-semibold text-white">{user.username}</div>
              <div className="text-xs text-gray-400 pt-2">Email / Auth ID</div>
              <div className="text-sm font-mono text-gray-300">{user.email || user.id}</div>
            </div>

            <button
              onClick={handleManualSync}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-doom-800 hover:bg-doom-750 border border-doom-border text-white text-xs py-2.5 rounded-lg font-semibold transition-all"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span>Sync All Progress to Cloudflare D1</span>
            </button>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full text-center text-xs text-red-400 hover:text-red-300 py-2 transition-colors font-medium"
            >
              Log Out (Revert to Guest Mode)
            </button>
          </div>
        ) : (
          // Login / Register Form
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Operative Codename</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CaptainDoom616"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-doom-950 border border-doom-border rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-doom-red transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="operative@marvel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-doom-950 border border-doom-border rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-doom-red transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Security Passcode</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-doom-950 border border-doom-border rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-doom-red transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-doom-red hover:bg-doom-red-bright text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-glow-red flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : isRegistering ? (
                <>
                  <UserPlus size={16} />
                  <span>Register & Sync Guest Progress</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Log In to Account</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-doom-gold hover:underline"
              >
                {isRegistering
                  ? 'Already have an operative account? Log in'
                  : 'New here? Create account to preserve watchlist across devices'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
