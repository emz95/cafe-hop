import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/CafeHopLogo.png';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { id: 'chats', label: 'Chats', path: '/chats' },
    { id: 'requests', label: 'Requests', path: '/requests' },
    { id: 'reviews', label: 'Reviews', path: '/reviews' },
    { id: 'leaderboard', label: 'Leaderboard', path: '/leaderboard' },
    { id: 'profile', label: 'Profile', path: '/profile' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate('/main')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} alt="CafeHop Logo" style={{ height: '80px', width: 'auto' }} />
          <h1>CafeHop</h1>
        </div>
        <nav className="nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
          <button
            className="nav-item"
            onClick={() => {
              if (window.confirm('Are you sure you want to logout?')) {
                logout();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;