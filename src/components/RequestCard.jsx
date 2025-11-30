import React from 'react';
import ProfilePicture from './ProfilePicture';

export const RequestCard = ({
  requests = [],
  onApprove,
  onReject,
  onUserClick,
}) => {

  if (!requests || requests.length === 0) {
    return <p className="empty-message">No active requests</p>;
  }

  return (
    <div className="requests-list">
      {requests.map((req) => (
        <div key={req.id} className="request-card">
          <div className="request-header">
            <ProfilePicture 
              username={req.username} 
              imageUrl={req.profilePictureUrl}
              size="small" 
            />
            <div className="request-info">
              <h4 className="clickable" onClick={() => onUserClick && onUserClick(req.userId)}>{req.username}</h4>
              <p className="cafe-name">{req.cafeName}</p>
              <p className="location-time">
                📍 {req.location} • 📅 {req.date} • 🕐 {req.time}
              </p>
            </div>
          </div>
          <div className="request-actions">
            <button
              className="btn btn-primary btn-small"
              onClick={() => onApprove && onApprove(req.id)}
            >
              Accept
            </button>
            <button
              className="btn btn-secondary btn-small"
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
