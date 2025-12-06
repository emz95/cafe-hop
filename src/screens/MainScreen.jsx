import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProfilePicture from '../components/ProfilePicture';
import UserProfileModal from '../components/UserProfileModal';

/**
 * MainScreen - all code pertaining to the search filters and time filters for cafe trips
 * was AI generated with prompt:
 * "Create React components for the main screen that fetch and display
 * the list of cafe trips from the backend API, where the user can then view all trips, or
 * use a search bar functionality to filter trips through 
 * text input
 *  Add buttons to filter trips by time in which they took place 
 * within next 24 hours, next week, next month
 *
 */
const MainScreen = () => {
  const navigate = useNavigate();
  // Filter trips by time period (all, 24h, week, month)
  const [timeFilter, setTimeFilter] = useState('all');
  // Text input for search (updates as user types)
  const [searchQuery, setSearchQuery] = useState('');
  // Actual search term being used (only updates when user presses Enter or clicks search)
  const [activeSearch, setActiveSearch] = useState('');
  // List of cafe trips from backend
  const [posts, setPosts] = useState([]);
  // User's join requests to track which trips they've requested
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  // For showing user profile modal when clicking on profile pictures
  const [selectedUserId, setSelectedUserId] = useState(null);

  const API_BASE = 'http://localhost:3000/api';
  // Get current user from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
    })();
    const userId = user?._id;

  // Fetch posts whenever search or filter changes
  useEffect(() => {
      // Check if user is authenticated
      if(!userId || !token) {
        setError('not logged in');
        setLoading(false);
        return;
      }
    
    async function loadPosts() {
      try {
        setLoading(true)
        // Build query parameters for search and filter
        const params = new URLSearchParams()
        const q = activeSearch.trim()
        if (q) params.set('search', q)

        if (timeFilter && timeFilter !== 'all') {
          params.set('timeFilter', timeFilter)
        }

        // Construct URL with query params
        const url = params.toString()
        ? `http://localhost:3000/api/posts?${params.toString()}`
        : `http://localhost:3000/api/posts`

        const res = await fetch(url, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Error fetching posts");
        }
        const postData = await res.json();
        setPosts(postData);

        // Also fetch user's join requests to show which trips they've already requested
        const reqRes = await fetch(`${API_BASE}/joinRequests/getByRequester/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!reqRes.ok) {
          throw new Error("Error fetching join requests");
        }
        const reqData = await reqRes.json();
        setRequests(reqData);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, [activeSearch, timeFilter, userId, token]);


  const handleSearch = () => {
    setActiveSearch(searchQuery);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
  };

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

  if (loading) return <p>Loading posts</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="main-screen">
      <Header />
      <div className="main-content">
        <div className="main-header">
          <h2>Upcoming Cafe Trips</h2>
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
            Next 24 Hours
          </button>
          <button
            className={`filter-btn ${timeFilter === 'week' ? 'active' : ''}`}
            onClick={() => setTimeFilter('week')}
          >
            Next Week
          </button>
          <button
            className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
            onClick={() => setTimeFilter('month')}
          >
            Next Month
          </button>
          <div className="search-controls" style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search cafes or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
            <button 
              className="btn btn-primary btn-small"
              onClick={handleSearch}
            >
              Search
            </button>
            {(searchQuery || activeSearch) && (
              <button 
                className="btn btn-secondary btn-small"
                onClick={handleClearSearch}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <button 
          className="create-trip-fab" 
          onClick={() => navigate('/post')}
          aria-label="Create Trip"
        >
          +
        </button>
        <div className="posts-grid">
          {posts.length === 0 && (
            <p className="empty-message">No trips found matching your search.</p>
          )}
          {filteredPosts.map(post => (
            <div key={post._id} className="cafe-trip-post">
              <div className="post-header">
                <ProfilePicture 
                  username={post.author.username} 
                  imageUrl={post.author.profilePictureUrl}
                  size="small" 
                />
                <div 
                  className="post-user-info clickable" 
                  onClick={() => setSelectedUserId(post.author._id)}
                >
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
      {selectedUserId && (
        <UserProfileModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}
    </div>
  );
};

export default MainScreen;
