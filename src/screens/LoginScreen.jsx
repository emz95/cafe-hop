import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add auth logic!
    navigate('/main');
  };

  return (
    <div className="setup-screen">
      <div className="setup-container">
        <h1>Welcome Back</h1>
        <p className="setup-subtitle">Login to your account</p>
        
        <form onSubmit={handleSubmit} className="setup-form">
          <InputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />

          <InputField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <button type="submit" className="btn btn-primary btn-large btn-full-width">
            Login
          </button>
        </form>

        <p className="setup-footer">
          Don't have an account? <a href="/setup" className="link">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;