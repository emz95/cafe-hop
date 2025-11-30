import React, { useEffect, useState } from 'react';
import ProfilePicture from './ProfilePicture';
import { useAuth } from '../contexts/AuthContext';

const UserProfileModal = ({ userId, onClose }) => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, token]);

  if (!userId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}
        
        {user && (
          <div className="user-profile-content">
            <ProfilePicture 
              username={user.firstName} 
              imageUrl={user.profilePictureUrl}
              size="large" 
            />
            <div className="user-profile-details">
              <h2>{user.firstName} {user.lastName}</h2>
              <p className="profile-username">@{user.username}</p>
              <p className="profile-contact">📧 {user.email}</p>
              {user.number && <p className="profile-contact">📱 {user.number}</p>}
              {user.bio && <p className="profile-bio">{user.bio}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;