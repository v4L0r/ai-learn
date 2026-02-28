import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, UserPlus, Mail, Lock, User } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses =
    'w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/60 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/40 transition-all';

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-4">
      {/* Decorative background glows */}
      <div className="pointer-events-none fixed -top-40 -right-40 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <GraduationCap className="text-amber-400" size={28} />
          <span className="text-xl font-bold tracking-tight text-gray-50">
            AI Learn
          </span>
        </div>

        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-8">
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-amber-500/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-indigo-500/5 blur-3xl" />

          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-50 text-center mb-1">
              Create Account
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Start your personalised learning journey
            </p>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3 mb-5 text-sm text-red-400">
                <div className="mt-0.5 shrink-0 h-4 w-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-xs">!</span>
                </div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
                  <User size={12} />
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
                  <Mail size={12} />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
                  <Lock size={12} />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
                  <Lock size={12} />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Repeat your password"
                  className={inputClasses}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500
                           text-gray-950 font-semibold text-sm hover:bg-amber-400
                           disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all shadow-lg shadow-amber-500/20 disabled:shadow-none mt-6"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-gray-950/30 border-t-gray-950 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Register
                  </>
                )}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}