import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Lock, Shield, X, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { showAdminLoginModal, setShowAdminLoginModal, adminLogin, adminGoogleLogin } = useShop();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);

  if (!showAdminLoginModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    const success = adminLogin(email.trim(), password);
    if (!success) {
      setError('Invalid admin credentials. Access denied.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoggingInGoogle(true);
    try {
      await adminGoogleLogin();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoggingInGoogle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#155e3c] text-white flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 leading-tight">
                Seller Center Portal
              </h3>
              <p className="text-[11px] text-stone-400">Shopping Kori Management</p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowAdminLoginModal(false);
              setError('');
              setEmail('');
              setPassword('');
            }}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Option: Google Login */}
        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoggingInGoogle}
            className="w-full py-3 px-4 bg-white hover:bg-stone-50 active:scale-98 border border-stone-300 hover:border-stone-400 text-stone-800 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoggingInGoogle ? 'Signing in with Google...' : 'Sign in with Google'}</span>
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-stone-200"></div>
          <span className="flex-shrink mx-3 text-stone-400 text-[11px] uppercase font-bold tracking-wider">
            Or Admin Credentials
          </span>
          <div className="flex-grow border-t border-stone-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Admin Email
            </label>
            <input
              id="admin-email-input"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter merchant email"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-hidden focus:border-emerald-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-stone-500">
              <span>Default: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-[10px] text-stone-700">admin123456</code></span>
              <span>Can change inside Settings</span>
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            className="w-full py-3 bg-[#155e3c] hover:bg-[#114b30] active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In to Seller Center</span>
          </button>
        </form>

        <p className="text-[11px] text-center text-stone-400">
          Protected Firebase Merchant Console. Confidential access only.
        </p>
      </div>
    </div>
  );
};
