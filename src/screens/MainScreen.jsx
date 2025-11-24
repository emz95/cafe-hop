import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProfilePicture from '../components/ProfilePicture';

const MainScreen = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', '24h', 'week', 'month'
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([
    // {
    //   id: 1,
    //   cafeName: 'Stagger Cafe',
    //   location: 'Ktown',
    //   date: '2025-11-05',
    //   time: '2:00 PM',
    //   posterUsername: 'judyhopps',
    //   description: 'Looking for study buddies!',
    //   joinByRequest: false,
    //   joined: false
    // },
    {
      id: 2,
      cafeName: 'Blue Bottle Coffee',
      location: 'Arts District',
      date: '2025-11-18',
      time: '10:00 AM',
      posterUsername: 'nickwilde',
      description: 'Morning coffee meetup!',
      joinByRequest: true,
      joined: false
    }
  ]);

  const handleJoin = (postId, joinByRequest) => {
    if (joinByRequest) {
      alert('Request sent! Waiting for approval.');
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, joined: true, requested: true } : post
      ));
    } else {
      alert('Successfully joined the trip!');
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, joined: true, requested: false } : post
      ));
    }
  };

  const getButtonText = (post) => {
    if (post.joined && post.requested) return 'Requested';
    if (post.joined) return 'Joined';
    return post.joinByRequest ? 'Request to Join' : 'Join';
  };

  const filteredPosts = posts.filter(post => {
    // Search filter
    const matchesSearch = post.cafeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="main-screen">
      <Header />
      <div className="main-content">
        <div className="main-header">
          <div>
            <h2>Upcoming Cafe Trips</h2>
          </div>
          <div className="header-controls">
            <input
              type="text"
              className="search-input"
              placeholder="Search cafes or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${timeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTimeFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${timeFilter === '24h' ? 'active' : ''}`}
            onClick={() => setTimeFilter('24h')}
          >
            Last 24 Hours
          </button>
          <button
            className={`filter-btn ${timeFilter === 'week' ? 'active' : ''}`}
            onClick={() => setTimeFilter('week')}
          >
            Last Week
          </button>
          <button
            className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
            onClick={() => setTimeFilter('month')}
          >
            Last Month
          </button>
        </div>
        <button 
          className="create-trip-fab" 
          onClick={() => navigate('/post')}
          aria-label="Create Trip"
        >
          +
        </button>
        <div className="posts-grid">
          {filteredPosts.length === 0 && (
            <p className="empty-message">No trips found matching your search.</p>
          )}
          {filteredPosts.map(post => (
            <div key={post.id} className="cafe-trip-post">
              <div className="post-header">
                <ProfilePicture username={post.posterUsername} size="small" />
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
                <button 
                  className={post.joined ? "btn btn-secondary btn-medium" : "btn btn-primary btn-medium"}
                  onClick={() => handleJoin(post.id, post.joinByRequest)}
                  disabled={post.joined}
                >
                  {getButtonText(post)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainScreen;