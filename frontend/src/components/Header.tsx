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
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-inner" style={{
        display: 'flex',
        justifyContent: 'space-between', // This pushes logo left and nav+profile right
        alignItems: 'center',
        width: '100%',
        padding: '0 20px' // Add some padding
      }}>
       
        {/* Logo/Brand - Left Side */}
        <div className="header-brand">
          <div className="header-logo">🌱</div>
          <div>
            <h1 className="header-title">AgriYield Pro</h1>
            <p className="header-subtitle">AI-Powered Crop Prediction</p>
          </div>
        </div>

        {/* Right Side Container - Navigation + User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px' // Space between nav and profile
        }}>
          
          {/* Desktop Navigation */}
          <nav className="header-nav">
            <ul className="header-nav-list" style={{
              display: 'flex',
              gap: '16px', // Space between nav items
              listStyle: 'none',
              margin: 0,
              padding: 0
            }}>
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
                      border: isActive ? 'none' : '1px solid transparent',
                      whiteSpace: 'nowrap' // Prevents text wrapping
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
          <div className="header-profile-menu" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* User Profile */}
            <div className="header-profile" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
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
