import React from 'react';
import Header from '../components/Header';

const RequestScreen = () => {
  return (
    <div className="request-screen">
      <Header />
      <div className="request-content">
        <h2>Requests</h2>
        <div className="requests-section">
          <h3>Pending Requests</h3>
          <p>No pending requests</p>
        </div>
        <div className="requests-section">
          <h3>Your Requests</h3>
          <p>No requests sent</p>
        </div>
      </div>
    </div>
  );
};

export default RequestScreen;