import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProfilePicture from '../components/ProfilePicture';

const MainScreen = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', '24h', 'week', 'month'
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch(`http://localhost:3000/api/posts`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Error fetching posts");
        }
        const data = await res.json();
        setPosts(data);
        console.log(data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

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
    // Search filter - add safety checks for undefined values
    const cafeName = post.cafeName || '';
    const location = post.location || '';
    const matchesSearch = cafeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) return <p>Loading posts</p>;

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
                <ProfilePicture username={post.author.username} size="small" />
                <div className="post-user-info">
                  <h4>{post.author.username}</h4>
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