import React from 'react';
import Header from '../components/Header';
import { RequestCard } from '../components/RequestCard';

const RequestScreen = () => {
  return (
    <div className="request-screen">
      <Header />
      <div className="request-content">
        <h2 className='request-header'>Requests</h2>
        <div className="requests-section">
          <h3>Pending Requests</h3>
          <RequestCard />
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