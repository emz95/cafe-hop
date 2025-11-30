import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/CafeHopLogo.png';
import meetIcon from '../assets/Meet.png';
import exploreIcon from '../assets/Explore.png';
import tripIcon from '../assets/Trip.png';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-icon">
          <img src={logo} alt="CafeHop Logo" style={{ height: '160px', width: 'auto' }} />
        </div>
        <h1>Welcome to CafeHop</h1>
        <p className="welcome-subtitle">
          Connect with friends and discover cafes together
        </p>
        <div className="welcome-features">
          <div className="feature">
            <img src={meetIcon} alt="Meet" className="feature-icon" style={{ width: '60px', height: 'auto' }} />
            <p>Meet new people</p>
          </div>
          <div className="feature">
            <img src={exploreIcon} alt="Explore" className="feature-icon" style={{ width: '60px', height: 'auto' }} />
            <p>Explore cafes</p>
          </div>
          <div className="feature">
            <img src={tripIcon} alt="Trip" className="feature-icon" style={{ width: '60px', height: 'auto' }} />
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