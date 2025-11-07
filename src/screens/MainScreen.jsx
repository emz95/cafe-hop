import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const MainScreen = () => {
  const navigate = useNavigate();

  const posts = [
    {
      id: 1,
      cafeName: 'Stagger Cafe',
      location: 'Ktown',
      date: '2025-11-05',
      time: '2:00 PM',
      posterUsername: 'judyhopps',
      description: 'Looking for study buddies!',
      joinByRequest: false
    }
  ];

  return (
    <div className="main-screen">
      <Header />
      <div className="main-content">
        <div className="main-header">
          <h2>Upcoming Cafe Trips</h2>
        </div>
        <button 
          className="create-trip-fab" 
          onClick={() => navigate('/post')}
          aria-label="Create Trip"
        >
          +
        </button>
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="cafe-trip-post">
              <div className="post-header">
                <div className="profile-picture profile-picture-small">
                  <div className="profile-placeholder">{post.posterUsername.charAt(0)}</div>
                </div>
                <div className="post-user-info">
                  <h4>{post.posterUsername}</h4>
                </div>
              </div>
              <div className="post-content">
                <h3 className="cafe-name">{post.cafeName}</h3>
                <p className="location">📍 {post.location}</p>
                <div className="post-datetime">
                  <span>📅 {post.date}</span>
                  <span>🕐 {post.time}</span>
                </div>
                <p className="description">{post.description}</p>
              </div>
              <div className="post-actions">
                <button className="">Join</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainScreen;