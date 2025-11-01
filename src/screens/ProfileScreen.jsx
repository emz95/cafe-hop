import React from 'react';
import Header from '../components/Header';

const ProfileScreen = () => {
  const user = {
    firstName: 'Judy',
    lastName: 'Hopps',
    phoneNumber: '(555) 123-4567',
    bio: 'Coffee enthusiast!'
  };

  const pastEvents = [
    { id: 1, cafeName: 'Stagger Cafe', date: '2025-10-15', location: 'Ktown' },
    { id: 2, cafeName: 'Blue Bottle', date: '2025-10-20', location: 'SF' }
  ];

  return (
    <div className="profile-screen">
      <Header />
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-picture profile-picture-large">
            <div className="profile-placeholder">
              {user.firstName.charAt(0)}
            </div>
          </div>
          <div className="profile-details">
            <h2>{user.firstName} {user.lastName}</h2>
            <p className="profile-contact">Mobile: {user.phoneNumber}</p>
            <p className="profile-bio">Bio: {user.bio}</p>
          </div>
        </div>

        <div className="past-events-section">
          <h3>Past Events</h3>
          <div className="posts-grid">
            {pastEvents.map(event => (
              <div key={event.id} className="cafe-trip-post">
                <h3 className="cafe-name">{event.cafeName}</h3>
                <p className="location">📍 {event.location}</p>
                <p>📅 {event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;