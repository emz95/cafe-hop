import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import {useAuth} from '../contexts/AuthContext'


const ProfileScreen = () => {
  const {token} = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  /*
  const user = {
    username: 'judyhopps',
    email: 'judy.hopps@example.com',
    firstName: 'Judy',
    lastName: 'Hopps',
    number: '(555) 123-4567',
    bio: 'Coffee enthusiast!'
  };
  */

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })

        if(!res.ok) {
          console.error(res.err)
          return
        }
        const data = await res.json()
        setUser(data)
        console.log(data)

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])


  const pastEvents = [
    { id: 1, cafeName: 'Stagger Cafe', date: '2025-10-15', location: 'Ktown' },
    { id: 2, cafeName: 'Blue Bottle', date: '2025-10-20', location: 'SF' }
  ];

  if (loading) return <p>Loading user</p>
  if (!user) return <p>Could not load user</p>

  return (
    <div className="profile-screen">
      <Header />
      <div className="main-content">
        <div className="main-header">
          <h2>Profile</h2>
        </div>
        <div className="profile-header">
          <div className="profile-picture profile-picture-large">
            <div className="profile-placeholder">
              {user.firstName.charAt(0)}
            </div>
          </div>
          <div className="profile-details">
            <h2>{user.firstName} {user.lastName}</h2>
            <p className="profile-username">@{user.username}</p>
            <p className="profile-contact">Email: {user.email}</p>
            <p className="profile-contact">Mobile: {user.number}</p>
            <p className="profile-bio">Bio: {user.bio}</p>
          </div>
        </div>

        <div className="past-events-section">
          <h3>Past Events</h3>
          <div className="posts-grid">
            {pastEvents.map(event => (
              <div key={event.id} className="cafe-trip-post">
                <h3 className="cafe-name">{event.cafeName}</h3>
                <p className="location">📍 {event.location}</p>
                <p>📅 {event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;