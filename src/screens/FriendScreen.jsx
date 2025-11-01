import React from 'react';
import Header from '../components/Header';

const FriendScreen = () => {
  return (
    <div className="friend-screen">
      <Header />
      <div className="friend-content">
        <h2>Friends</h2>
        <div className="friends-section">
          <h3>Pending Friend Requests</h3>
          <p>No pending requests</p>
        </div>
        <div className="friends-section">
          <h3>Your Friends</h3>
          <p>No friends yet</p>
        </div>
      </div>
    </div>
  );
};

export default FriendScreen;