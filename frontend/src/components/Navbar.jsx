import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, LogOut } from 'lucide-react';

export default function Navbar({ farmerName = null, showLogout = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/farmer-dashboard', label: 'My Dashboard' },
    { path: '/pool-dashboard', label: 'Pool Dashboard' },
    { path: '/admin', label: 'Admin' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Clear any stored data and redirect to home
    localStorage.removeItem('farmerData');
    window.location.href = '/';
  };

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '1rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          textDecoration: 'none',
          color: 'var(--text-main)'
        }}>
          <ShieldCheck size={28} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>AgroShield</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  textDecoration: 'none',
                  color: isActive(link.path) ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive(link.path) ? 600 : 500,
                  fontSize: '0.95rem',
                  padding: '0.5rem 0',
                  borderBottom: isActive(link.path) ? '2px solid var(--primary)' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Info & Logout */}
          {(farmerName || showLogout) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {farmerName && (
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--text-muted)',
                  padding: '0.5rem 1rem',
                  background: 'var(--bg-color)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  {farmerName}
                </span>
              )}
              {showLogout && (
                <button 
                  onClick={handleLogout}
                  className="btn"
                  style={{ 
                    background: 'white',
                    border: '1px solid var(--border)',
                    color: 'var(--text-main)',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem'
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          background: 'white',
          borderTop: '1px solid var(--border)',
          padding: '1rem'
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: isActive(link.path) ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: isActive(link.path) ? 600 : 500,
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: isActive(link.path) ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
              }}
            >
              {link.label}
            </Link>
          ))}
          {showLogout && (
            <button 
              onClick={handleLogout}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                marginTop: '0.5rem',
                padding: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--danger)',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
