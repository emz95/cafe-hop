import React from 'react';

export const RequestCard = ({
  requests = [],
  onApprove,
  onReject,
}) => {

  if (!requests || requests.length === 0) {
    return <p className="empty-message">No active requests</p>;
  }

  return (
    <div className="requests-list">
      {requests.map((req) => (
        <div key={req.id} className="request-card">
          <div className="request-header">
            <div className="profile-picture profile-picture-small">
              <div className="profile-placeholder">
                {req.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="request-info">
              <h4>{req.username}</h4>
              <p className="cafe-name">{req.cafeName}</p>
              <p className="location-time">
                📍 {req.location} • 📅 {req.date} • 🕐 {req.time}
              </p>
            </div>
          </div>
          <div className="request-actions">
            <button
              className="btn-accept btn-small"
              onClick={() => onApprove && onApprove(req.id)}
            >
              Accept
            </button>
            <button
              className="btn-decline btn-small"
              onClick={() => onReject && onReject(req.id)}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
