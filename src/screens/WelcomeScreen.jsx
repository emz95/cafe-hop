import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-icon">☕</div>
        <h1>Welcome to CafeHop</h1>
        <p className="welcome-subtitle">
          Connect with friends and discover cafes together
        </p>
        <div className="welcome-features">
          <div className="feature">
            <span className="feature-icon">🤝</span>
            <p>Meet new people</p>
          </div>
          <div className="feature">
            <span className="feature-icon">☕</span>
            <p>Explore cafes</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📅</span>
            <p>Plan cafe trips</p>
          </div>
        </div>
        <button 
          className="btn btn-primary btn-large"
          onClick={() => navigate('/setup')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;