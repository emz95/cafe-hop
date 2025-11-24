import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProfilePicture from '../components/ProfilePicture';
import { RequestCard } from '../components/RequestCard';
import { useNavigate } from 'react-router-dom';
const API_BASE = 'http://localhost:3000/api';

// Mock request data
const MOCK_PENDING_REQUESTS = [
  {
    id: 1,
    username: 'nickwilde',
    cafeName: 'Stagger Cafe',
    location: 'Ktown',
    date: '2025-11-20',
    time: '3:00 PM'
  },
  {
    id: 2,
    username: 'bellwether',
    cafeName: 'Blue Bottle Coffee',
    location: 'Arts District',
    date: '2025-11-22',
    time: '2:30 PM'
  }
];

const MOCK_SENT_REQUESTS = [
  {
    id: 3,
    username: 'gazelle',
    cafeName: 'Alfred Coffee',
    location: 'Melrose',
    date: '2025-11-25',
    time: '4:00 PM',
    status: 'pending'
  }
];

const RequestScreen = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      if(!userId || !token) {
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
                'Content-Type': 'application/json'
              }
            }),
            fetch(`${API_BASE}/joinRequests/getByRequester/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
          ]);
          console.log('posterRequests status:', posterRequests.status);
          if (!posterRequests.ok) {
            setError(
              `Failed to fetch pending requests (status ${posterRequests.status})`
            );
            setLoading(false);
            return;
          }
          
          if (!requesterRequests.ok) {
            setError(
              `Failed to fetch sent requests (status ${requesterRequests.status})`
            );
            setLoading(false);
            return;
          }
          
          const pendingData = await posterRequests.json();
          const sentData = await requesterRequests.json();
          setPendingRequests(pendingData);
          setSentRequests(sentData);
          
        }
        catch (err) {
          setError(err.message);
        }
        finally {
          setLoading(false);
        }
      };
      fetchRequests();
    }, [userId, token]);

  const handleApprove = async(requestId) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/joinRequests/approve/${requestId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to approve request (status ${res.status})`);
      }
      const data = await res.json();
      setPendingRequests((prev) =>
        prev.filter((req) => req._id !== data.joinRequest._id)
      );
      navigate('/chat');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async(requestId) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/joinRequests/reject/${requestId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
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
            requests={pendingRequests.map((req) => ({
              id: req._id,
              username: req.requester?.username || 'Unknown',
              cafeName: req.post?.title || 'Unknown cafe',
              location: req.post?.location || 'Unknown location',
              date: req.post?.dateGoing || req.post?.date || '',
              time: req.post?.time || '',
              status: req.status,
              raw: req, 
            }))}
            onApprove={handleApprove}
            onReject={handleReject}
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
        const postTitle = req.post?.title || 'Unknown cafe';
        const location = req.post?.location || 'Unknown location';
        const date = req.post?.dateGoing || req.post?.date || '';
        const time = req.post?.time || '';

        return (
          <div key={req._id} className="request-card status-pending">
            <div className="request-header">
              <ProfilePicture username={posterUsername} size="small" />
              <div className="request-info">
                <h4>{posterUsername}</h4>
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
    </div>
  );
};

export default RequestScreen;