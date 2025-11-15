import React, { useState } from 'react';
import Header from '../components/Header';
import { RequestCard } from '../components/RequestCard';

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
  const [pendingRequests] = useState(MOCK_PENDING_REQUESTS);
  const [sentRequests] = useState(MOCK_SENT_REQUESTS);

  return (
    <div className="request-screen">
      <Header />
      <div className="main-content">
        <div className="main-header">
          <h2>Requests</h2>
        </div>
        
        <div className="requests-section">
          <h3>Pending Requests</h3>
          <RequestCard requests={pendingRequests} />
        </div>
        
        <div className="requests-section">
          <h3>Your Requests</h3>
          {sentRequests.length === 0 ? (
            <p className="empty-message">No requests sent</p>
          ) : (
            <div className="requests-list">
              {sentRequests.map(req => (
                <div key={req.id} className="request-card status-pending">
                  <div className="request-header">
                    <div className="profile-picture profile-picture-small">
                      <div className="profile-placeholder">{req.username.charAt(0).toUpperCase()}</div>
                    </div>
                    <div className="request-info">
                      <h4>{req.username}</h4>
                      <p className="cafe-name">{req.cafeName}</p>
                      <p className="location-time">
                        📍 {req.location} • 📅 {req.date} • 🕐 {req.time}
                      </p>
                    </div>
                  </div>
                  <div className="request-status">
                    <span className="status-badge status-pending">Pending</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestScreen;