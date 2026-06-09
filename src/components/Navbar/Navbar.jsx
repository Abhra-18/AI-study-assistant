import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  Sun, Moon, Menu, X, Sparkles, LogOut,
  LayoutDashboard, BookOpen, BrainCircuit, MessageSquare, User, FileText
} from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isLanding = location.pathname === '/';

  const navLinks = isAuthenticated
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/notes', label: 'Notes', icon: BookOpen },
        { path: '/documents', label: 'Documents', icon: FileText },
        { path: '/quiz', label: 'Quiz', icon: BrainCircuit },
        { path: '/chat', label: 'AI Chat', icon: MessageSquare },
        { path: '/profile', label: 'Profile', icon: User },
      ]
    : [
        { path: '/#features', label: 'Features' },
        { path: '/#pricing', label: 'Pricing' },
        { path: '/login', label: 'Login' },
      ];

  return (
    <nav className="navbar glass-strong">
      <div className="navbar-inner">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
          <div className="navbar-logo">
            <Sparkles size={22} />
          </div>
          <span className="navbar-title">StudyAI</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon && <link.icon size={16} />}
              {link.label}
            </Link>
          ))}

          {/* Mobile-only auth buttons */}
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="btn btn-primary btn-sm navbar-cta-mobile"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          )}

          {isAuthenticated && (
            <button
              className="btn btn-ghost btn-sm navbar-logout-mobile"
              onClick={() => { logout(); setMobileOpen(false); }}
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>

        <div className="navbar-actions">
          <button
            className="btn btn-icon btn-ghost theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!isAuthenticated && !isLanding && (
            <Link to="/signup" className="btn btn-primary btn-sm navbar-cta">
              Get Started
            </Link>
          )}

          {isAuthenticated && (
            <>
              <Link to="/profile" className="navbar-avatar">
                <div className="avatar">{user?.name?.charAt(0) || 'A'}</div>
              </Link>
              <button
                className="btn btn-ghost btn-sm navbar-logout"
                onClick={logout}
              >
                <LogOut size={16} />
              </button>
            </>
          )}

          <button
            className="btn btn-icon btn-ghost mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
