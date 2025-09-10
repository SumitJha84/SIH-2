import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface NavigationItem {
  name: string;
  path: string;
  icon: string;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Farm Management', path: '/farm-management', icon: '🌾' },
    { name: 'Analytics & Prediction', path: '/analytics', icon: '📈' },
    { name: 'Market Prices', path: '/market-prices', icon: '💰' },
    { name: 'Weather Monitor', path: '/weather', icon: '🌤️' },
    { name: 'Settings', path: '/settings', icon: '⚙️' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-inner">
        
        {/* Logo/Brand */}
  <div className="header-brand">
          <div className="header-logo">🌱</div>
          <div>
            <h1 className="header-title">AgriYield Pro</h1>
            <p className="header-subtitle">AI-Powered Crop Prediction</p>
          </div>
        </div>

        {/* Desktop Navigation */}
  <nav className="header-nav">
          <ul className="header-nav-list">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActive ? '#059669' : 'white',
                    backgroundColor: isActive ? 'white' : 'transparent',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    border: isActive ? 'none' : '1px solid transparent'
                  })}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile & Mobile Menu Toggle */}
  <div className="header-profile-menu">
          {/* User Profile */}
          <div className="header-profile">
            <div className="header-profile-avatar">SJ</div>
            <div className="header-profile-info">
              <div className="header-profile-name">Sumit Jha</div>
              <div className="header-profile-role">Farmer</div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="header-menu-toggle"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="header-mobile-menu">
          <nav className="header-mobile-nav">
            <ul className="header-mobile-nav-list">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="header-mobile-nav-link"
                  >
                    <span className="header-mobile-nav-icon">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
