import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import {useAuth} from '../contexts/AuthContext'

const LoginScreen = () => {
  const {login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null)

  async function handleSubmit(e){
    console.log("handlesubmit")
    e.preventDefault();
    setError(null)
    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(formData)
      })
      console.log("Login status:", res.status)
      if (res.ok) {
        const data = await res.json()
        console.log("LOGIN SUCCESS:", data) 
        login(data.token)
        navigate('/main');
      } else {
        const err = await res.json()
        console.error("LOGIN ERROR:", err)
        setError(err.message)
        return
      }
    } catch (err) {
      console.error("LOGIN FETCH ERROR:", err)
      setError(err.message)
    }
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
          {error && <p className="error">{error}</p>}

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