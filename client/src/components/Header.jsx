import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link to="/" className="text-xl font-bold text-white tracking-tight">
          AI Learn
        </Link>
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-slate-300 hover:text-white font-medium transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-slate-500 text-sm">
                {user?.name ?? user?.email ?? 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="py-1.5 px-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
