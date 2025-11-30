import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProfilePicture from '../components/ProfilePicture';
import { RequestCard } from '../components/RequestCard';
import UserProfileModal from '../components/UserProfileModal';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3000/api';

function formatDate(isoString) {
  if (!isoString) return '';
  const dt = new Date(isoString);
  if (Number.isNaN(dt.getTime())) return '';
  return dt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(isoString) {
  if (!isoString) return '';
  const dt = new Date(isoString);
  if (Number.isNaN(dt.getTime())) return '';
  return dt.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

const RequestScreen = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();
  const userId = user?._id;

  useEffect(() => {
    if (!userId || !token) {
      setError('not logged in');
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const [posterRequests, requesterRequests] = await Promise.all([
          fetch(`${API_BASE}/joinRequests/getByPoster/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${API_BASE}/joinRequests/getByRequester/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        console.log('posterRequests status:', posterRequests.status);
        console.log('requesterRequests status:', requesterRequests.status);

        // Handle pending requests
        let pendingData = [];
        if (posterRequests.ok) {
          pendingData = await posterRequests.json();
        } else if (posterRequests.status === 401) {
          console.warn('Unauthorized - token may be expired');
          setError('Session expired. Please log in again.');
          setLoading(false);
          return;
        } else {
          console.warn('Failed to fetch pending requests, using empty array');
        }

        // Handle sent requests
        let sentData = [];
        if (requesterRequests.ok) {
          sentData = await requesterRequests.json();
        } else if (requesterRequests.status === 401) {
          console.warn('Unauthorized - token may be expired');
          setError('Session expired. Please log in again.');
          setLoading(false);
          return;
        } else {
          console.warn('Failed to fetch sent requests, using empty array');
        }

        setPendingRequests(pendingData);
        setSentRequests(sentData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId, token]);

  const handleApprove = async (requestId) => {
    try {
      setError(null);
      const res = await fetch(
        `${API_BASE}/joinRequests/${requestId}/approve/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to approve request (status ${res.status})`);
      }

      const data = await res.json();
      setPendingRequests((prev) =>
        prev.filter((req) => req._id !== data.joinRequest._id)
      );
      navigate('/chats');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setError(null);
      const res = await fetch(
        `${API_BASE}/joinRequests/${requestId}/reject/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to reject request (status ${res.status})`);
      }

      const data = await res.json();
      setPendingRequests((prev) =>
        prev.filter((req) => req._id !== data._id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="request-screen">
      <Header />
      <div className="main-content">
        <div className="main-header">
          <h2>Requests</h2>
        </div>
        {loading && <p>Loading requests...</p>}
        {error && <p className="error-message">{error}</p>}

        
        <div className="requests-section">
          <h3>Pending Requests</h3>

          <RequestCard
            requests={pendingRequests.map((req) => {
              const iso = req.post?.dateGoing || req.post?.date || '';
              return {
                id: req._id,
                userId: req.requester?._id,
                username: req.requester?.username || 'Unknown',
                profilePictureUrl: req.requester?.profilePictureUrl,
                cafeName: req.post?.cafeName || 'Unknown cafe',
                location: req.post?.location || 'Unknown location',
                date: iso ? formatDate(iso) : '',
                time: iso ? formatTime(iso) : '',
                status: req.status,
                raw: req,
              };
            })}
            onApprove={handleApprove}
            onReject={handleReject}
            onUserClick={setSelectedUserId}
          />
        </div>

      
        <div className="requests-section">
          <h3>Your Requests</h3>
          {sentRequests.length === 0 ? (
            <p className="empty-message">No requests sent</p>
          ) : (
            <div className="requests-list">
              {sentRequests.map((req) => {
                const posterUsername = req.poster?.username || 'Unknown';
                const postTitle = req.post?.cafeName || 'Unknown cafe';
                const location = req.post?.location || 'Unknown location';

                const iso = req.post?.dateGoing || req.post?.date || '';
                const date = iso ? formatDate(iso) : '';
                const time = iso ? formatTime(iso) : '';

                return (
                  <div
                    key={req._id}
                    className="request-card status-pending"
                  >
                    <div className="request-header">
                      <ProfilePicture
                        username={posterUsername}
                        imageUrl={req.poster?.profilePictureUrl}
                        size="small"
                      />
                      <div className="request-info">
                        <h4 className="clickable" onClick={() => setSelectedUserId(req.poster?._id)}>{posterUsername}</h4>
                        <p className="cafe-name">{postTitle}</p>
                        <p className="location-time">
                          📍 {location} • 📅 {date} • 🕐 {time}
                        </p>
                      </div>
                    </div>
                    <div className="request-status">
                      <span className="status-badge status-pending">
                        {req.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

export default RequestScreen;
