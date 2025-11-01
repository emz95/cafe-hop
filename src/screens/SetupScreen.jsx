import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SetupScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/main');
  };

  return (
    <div className="setup-screen">
      <div className="setup-container">
        <h1>Create Your Account</h1>
        <p className="setup-subtitle">Tell us a bit about yourself</p>
        
        <form onSubmit={handleSubmit} className="setup-form">
          <div className="input-field">
            <label className="input-label">First Name <span className="required">*</span></label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="input"
              required
            />
          </div>

          <div className="input-field">
            <label className="input-label">Last Name <span className="required">*</span></label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="input"
              required
            />
          </div>

          <div className="input-field">
            <label className="input-label">Phone Number <span className="required">*</span></label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              className="input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-large btn-full-width">
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;