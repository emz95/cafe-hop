import React from 'react';

const ProfilePicture = ({ username, imageUrl, size = 'medium', editable = false, onEdit }) => {
  const sizeClass = `profile-picture-${size}`;

  return (
    <div className={`profile-picture ${sizeClass}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={username || 'User'} className="profile-img" />
      ) : (
        <div className="profile-placeholder">
          <svg 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="profile-icon"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      )}
      {editable && (
        <div className="profile-edit-overlay" onClick={onEdit}>
          📷
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;