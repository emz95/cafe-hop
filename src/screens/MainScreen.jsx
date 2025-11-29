import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProfilePicture from '../components/ProfilePicture';


const MainScreen = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', '24h', 'week', 'month'
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const API_BASE = 'http://localhost:3000/api';
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
    })();
    const userId = user?._id;

  useEffect(() => {
      if(!userId || !token) {
        setError('not logged in');
        setLoading(false);
        return;
      }
    async function loadPosts() {
      try {
        setError(null);
        const [postsRes, reqRes] = await Promise.all([
          fetch(`${API_BASE}/posts`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${API_BASE}/joinRequests/getAllByRequester/${userId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);


        if (!postsRes.ok) {
          throw new Error("Error fetching posts");
        }
        if (!reqRes.ok) {
          throw new Error("Error fetching join requests");
        }
        const postData = await postsRes.json();
        const reqData = await reqRes.json();
        setPosts(postData);
        setRequests(reqData);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, [userId, token]);


  const getRequestsForPost = (postId) => requests.find((r) => r.post._id === postId);



  const handleJoin = async(post) => {
    try {
    const res = await fetch(`${API_BASE}/joinRequests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post: post._id,
        requester: userId,
        poster: post.author._id
      })
    });
    const data = await res.json();

    setRequests((prev) => [...prev, {...data, post: {_id: post._id}}]);
    alert("Join request sent successfully!");
  }  catch (err) {
    console.error("JOIN REQUEST ERROR:", err);
    alert("Failed to send join request: " + err.message);
    return;
  }
    }
  

    const getButtonText = (post) => {
      // can't join your own trip
      if (post.author?._id === userId) return 'Your Trip';
      const req = getRequestsForPost(post._id);
      if(req?.status === 'Pending') return 'Requested';
      if(req?.status === 'Approved') return 'Joined';
      return 'Request to Join';
    };
    const isButtonDisabled = (post) => {
      if (post.author?._id === userId) return true;
  
      const req = getRequestsForPost(post._id);
      if (!req) return false;

      return req.status === 'Pending' || req.status === 'Approved';
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
            <div key={post._id} className="cafe-trip-post">
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
                  <span>📅 {formatDate(post.date)}</span>
                  <span>🕐 {formatTime(post.date)}</span>
                </div>
                <p className="description">{post.description}</p>
              </div>
              <div className="post-actions">
                <button 
                  className={ getRequestsForPost(post._id)?.status === 'Approved' ? "btn btn-secondary btn-medium" : "btn btn-primary btn-medium"}
                  onClick={() => handleJoin(post)}
                  disabled={isButtonDisabled(post)}
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
  function formatDate(isoString) {
    const dt = new Date(isoString);
  
    const date = dt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  
    return `${date}`;
  }
  function formatTime(isoString) {
    const dt = new Date(isoString);
  
    const time = dt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  
    return `${time}`;
  }
  
  
};

export default MainScreen;