import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'friends', label: 'Friends', path: '/friends' },
    { id: 'chats', label: 'Chats', path: '/chats' },
    { id: 'requests', label: 'Requests', path: '/requests' },
    { id: 'reviews', label: 'Reviews', path: '/reviews' },
    { id: 'leaderboard', label: 'Leaderboard', path: '/leaderboard' },
    { id: 'profile', label: 'Profile', path: '/profile' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate('/main')} style={{ cursor: 'pointer' }}>
          <h1>☕ CafeHop</h1>
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
        </nav>
      </div>
    </header>
  );
};

export default Header;