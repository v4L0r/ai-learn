// src/components/Header.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  User,
  Settings,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';

const tabs = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Social',    path: '/social',    icon: Users },
  { name: 'Profile',   path: '/profile',   icon: User },
  { name: 'Settings',  path: '/settings',  icon: Settings },
];

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-amber-500/10 text-amber-400'
        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <GraduationCap className="h-6 w-6 text-amber-400" />
            <span className="text-lg font-bold tracking-tight text-gray-50">
              AI Learn
            </span>
          </div>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <NavLink key={tab.path} to={tab.path} className={linkClasses}>
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop logout */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900 px-4 pb-4 pt-2 space-y-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={linkClasses}
              onClick={() => setMobileMenuOpen(false)}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;