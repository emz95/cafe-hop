import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const CafeTripPostScreen = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save post to backend
    navigate('/main');
  };

  return (
    <div className="post-screen">
      <Header />
      <div className="main-content">
        <div className="main-header">
          <h2>Create Cafe Trip</h2>
        </div>
        <form onSubmit={handleSubmit} className="post-form">
          <div className="input-field">
            <label className="input-label">Cafe Name</label>
            <input type="text" className="input" required />
          </div>
          <div className="input-field">
            <label className="input-label">Location</label>
            <input type="text" className="input" required />
          </div>
          <div className="form-row">
            <div className="input-field">
              <label className="input-label">Date</label>
              <input type="date" className="input" required />
            </div>
            <div className="input-field">
              <label className="input-label">Time</label>
              <input type="time" className="input" required />
            </div>
          </div>
          <div className="input-field">
            <label className="input-label">Description</label>
            <textarea className="input textarea" rows="4" />
          </div>
          <div className="checkbox-field">
            <input type="checkbox" id="joinByRequest" />
            <label htmlFor="joinByRequest">Require approval to join</label>
          </div>
          <button type="submit" className="btn btn-primary btn-large btn-full-width">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CafeTripPostScreen;