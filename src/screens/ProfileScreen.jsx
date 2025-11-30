import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProfilePicture from '../components/ProfilePicture';
import {useAuth} from '../contexts/AuthContext'


const ProfileScreen = () => {
  const {token} = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pastEvents, setPastEvents] = useState(null)

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

    async function loadPosts() {
      try {
        const res = await fetch(`http://localhost:3000/api/users/me/posts`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if(!res.ok) {
          throw new Error("Error fetching posts")
        }
        const data = await res.json()
        setPastEvents(data)

      } catch (err) {
        console.error(err)
      }
    }

    async function init() {
      loadUser()
      if (user) {
        loadPosts()
      }
      setLoading(false)
    } 
    init()
  }, [user, token])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB. Please choose a smaller image.');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result;
        
        try {
          console.log('Uploading profile picture...');
          // Upload to backend
          const res = await fetch('http://localhost:3000/api/users/me', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ profilePictureUrl: imageData }),
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('Upload failed:', errorData);
            throw new Error(errorData.message || 'Failed to upload profile picture');
          }

          const updatedUser = await res.json();
          console.log('Profile picture updated:', updatedUser);
          setUser(updatedUser);
          alert('Profile picture updated successfully!');
        } catch (err) {
          console.error('Error uploading profile picture:', err);
          alert(`Failed to upload profile picture: ${err.message}`);
        }
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Failed to read image file');
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    document.getElementById('profile-image-input').click();
  };

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
          <input
            type="file"
            id="profile-image-input"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <ProfilePicture 
            username={user.firstName} 
            imageUrl={user.profilePictureUrl}
            size="large" 
            editable={true}
            onEdit={handleEditClick}
          />
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
          {pastEvents && pastEvents.length > 0 ? (
            <div className="posts-grid">
            {pastEvents.map(event => (
              <div key={event.id} className="cafe-trip-post">
                <h3 className="cafe-name">{event.cafeName}</h3>
                <p className="location">📍 {event.location}</p>
                <p>{formatPrettyDate(event.date)}</p>
              </div>
            ))}
            </div> 
          ):(
            <p>No past posts.</p>
          )}
        </div>
      </div>
    </div>
  );
  function formatPrettyDate(isoString) {
    const dt = new Date(isoString);
  
    const date = dt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  
    const time = dt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  
    return `📅 ${date} • 🕒 ${time}`;
  }
  
};

export default ProfileScreen;