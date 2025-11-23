import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { useAuth } from "../contexts/AuthContext";

const SetupScreen = () => {
  const {login} = useAuth()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    number: ''
  });

  const [error, setError] = useState(null)

  async function handleSubmit (e){
    e.preventDefault();
    setError(null)
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const data = await res.json()
        login(data.token)
        navigate('/main');
      } else {
        const err = await res.json()
        setError(err.message)
        return
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="setup-screen">
      <div className="setup-container">
        <h1>Create Your Account</h1>
        <p className="setup-subtitle">Tell us a bit about yourself</p>
        
        <form onSubmit={handleSubmit} className="setup-form">
          <InputField
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />

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

          <InputField
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
          />

          <InputField
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
          />

          <InputField
            label="Phone Number"
            type="tel"
            value={formData.number}
            onChange={(e) => setFormData({...formData, number: e.target.value})}
          />
          {error && <p className="error">{error}</p>}


          <button type="submit" className="btn btn-primary btn-large btn-full-width">
            Complete Setup
          </button>
        </form>

        <p className="setup-footer">
          Already have an account? <a href="/login" className="link">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SetupScreen;