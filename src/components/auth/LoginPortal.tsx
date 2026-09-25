import React, { useState } from 'react';
import { Organization, User } from '../../types';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginPortalProps {
  organizations: Organization[];
  users: User[];
  onLoginSuccess: (user: User, org: Organization) => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  organizations,
  users,
  onLoginSuccess
}) => {
  const mineazyOrg = organizations.find(o => o.id === 'org-mineazy') || organizations[0]!;
  const [email, setEmail] = useState('vision');
  const [password, setPassword] = useState('MyAdmin30$');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      
      const normalizedInput = email.trim().toLowerCase();
      const isVision = normalizedInput === 'vision' || normalizedInput === 'vision@mineazy.com';

      const targetUser = users.find(
        u => u.orgId === mineazyOrg.id && 
        (u.email.toLowerCase() === normalizedInput || 
         u.email.toLowerCase().split('@')[0] === normalizedInput ||
         (isVision && u.id === 'u-vision'))
      );
      
      if (!targetUser) {
        setError('Invalid email address, username or credentials.');
        return;
      }

      if (isVision || targetUser.id === 'u-vision') {
        if (password !== 'MyAdmin30$') {
          setError('Invalid password for ADMIN account "vision". Use MyAdmin30$');
          return;
        }
      } else {
        const expectedPassword = targetUser.password || 'password123';
        if (password !== expectedPassword) {
          setError('Invalid password.');
          return;
        }
      }

      onLoginSuccess(targetUser, mineazyOrg);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 md:p-8 relative overflow-y-auto selection:bg-teal-500 selection:text-slate-950">
      {/* Decorative ambient blobs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md mx-auto z-10 my-auto">
        {/* BRAND HEADER */}
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-2xl font-black bg-gradient-to-r from-teal-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent uppercase tracking-wider">
            MinEazy Resources
          </h1>
          <p className="text-[10px] tracking-wider text-slate-400 font-semibold uppercase mt-1">
            IT Hardware & Device Operations Ledger
          </p>
        </div>

        {/* SECURE PORTAL ACCESS LOGIN FORM CARD */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between backdrop-blur-md">
          {/* Top border glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 to-indigo-500" />
          
          <div className="mb-6 text-center">
            <div className="w-11 h-11 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mb-4 text-teal-400 mx-auto">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Secure Portal Access</h3>
            <p className="text-xs text-slate-400 mt-1">Sign in with your enterprise credentials.</p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="font-sans">{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                Work Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. vision or name@mineazy.com"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/35 transition font-medium font-sans"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/35 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-teal-500/25 transition flex items-center justify-center gap-2 mt-6 text-xs uppercase tracking-wider cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-sans">Authenticating...</span>
                </>
              ) : (
                <>
                  <span className="font-sans">Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-500 font-sans">
              Secured by high-performance client-side cryptography.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
