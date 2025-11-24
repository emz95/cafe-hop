import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const CafeTripPostScreen = () => {
  const navigate = useNavigate();
  const { token } = useAuth();   // backend uses req.user from token

  const [cafeName, setCafeName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setSubmitting(true);

      const dateTime = new Date(`${date}T${time}:00`);

      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          cafeName: cafeName,
          description,
          date: dateTime.toISOString(),
          location,
          isOpenToJoin: false,      // always requires approval
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create post');
      }

      // const createdPost = await res.json(); // use if you want to go to the post detail later
      navigate('/main');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
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
            <input
              type="text"
              className="input"
              required
              value={cafeName}
              onChange={(e) => setCafeName(e.target.value)}
            />
          </div>

          <div className="input-field">
            <label className="input-label">Location</label>
            <input
              type="text"
              className="input"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="input-field">
              <label className="input-label">Date</label>
              <input
                type="date"
                className="input"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="input-field">
              <label className="input-label">Time</label>
              <input
                type="time"
                className="input"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="input-field">
            <label className="input-label">Description</label>
            <textarea
              className="input textarea"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary btn-large btn-full-width"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
  

};

export default CafeTripPostScreen;
