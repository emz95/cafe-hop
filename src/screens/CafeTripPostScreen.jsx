import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const CafeTripPostScreen = () => {
  const navigate = useNavigate();
  const {token} = useAuth()

  async function handleSubmit(e) {
    e.preventDefault();

    const data = e.target
    const date = data.date.value
    const time = data.time.value
    const combined = new Date(`${date}T${time}:00`).toISOString()

    const body = {
      cafeName: data.cafeName.value,
      location: data.location.value,
      date: combined,
      description: data.description.value
    }

    try {
      const res = await fetch("http://localhost:3000/api/posts/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if(!res.ok) {
        throw new Error("Error creating post")
        ///do somethign
      }

    } catch (err) {
      console.error(err)
      return
    }

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
            <input type="text" className="input" name="cafeName" required />
          </div>
          <div className="input-field">
            <label className="input-label">Location</label>
            <input type="text" className="input" name="location" required />
          </div>
          <div className="form-row">
            <div className="input-field">
              <label className="input-label">Date</label>
              <input type="date" className="input" name="date" required />
            </div>
            <div className="input-field">
              <label className="input-label">Time</label>
              <input type="time" className="input" name="time" required />
            </div>
          </div>
          <div className="input-field">
            <label className="input-label">Description</label>
            <textarea className="input textarea" rows="4" name="description" />
          </div>
          {/* cutting out open to join?
              <div className="checkbox-field">
                <input type="checkbox" id="joinByRequest name=" />
                <label htmlFor="joinByRequest">Require approval to join</label>
              </div>
          */}

          <button type="submit" className="btn btn-primary btn-large btn-full-width">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CafeTripPostScreen;