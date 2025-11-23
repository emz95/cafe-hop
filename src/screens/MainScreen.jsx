import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const MainScreen = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch(`http://localhost:3000/api/posts`, {
          method: "GET",
        })

        if(!res.ok) {
          throw new Error("Error fetching posts")
        }
        const data = await res.json()
        setPosts(data)
        console.log(data)


      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadPosts()

  }, [])
  if (loading) return <p>Loading posts</p>

  /*
  const [posts, setPosts] = useState([
    // {
    //   id: 1,
    //   cafeName: 'Stagger Cafe',
    //   location: 'Ktown',
    //   date: '2025-11-05',
    //   time: '2:00 PM',
    //   posterUsername: 'judyhopps',
    //   description: 'Looking for study buddies!',
    //   joinByRequest: false,
    //   joined: false
    // },
    {
      id: 2,
      cafeName: 'Blue Bottle Coffee',
      location: 'Arts District',
      date: '2025-11-18',
      time: '10:00 AM',
      posterUsername: 'nickwilde',
      description: 'Morning coffee meetup!',
      joinByRequest: true,
      joined: false
    }
  ]);
  */


  const handleJoin = (postId, joinByRequest) => {
    if (joinByRequest) {
      alert('Request sent! Waiting for approval.');
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, joined: true, requested: true } : post
      ));
    } else {
      alert('Successfully joined the trip!');
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, joined: true, requested: false } : post
      ));
    }
  };

  const getButtonText = (post) => {
    if (post.joined && post.requested) return 'Requested';
    if (post.joined) return 'Joined';
    return post.joinByRequest ? 'Request to Join' : 'Join';
  };

  return (
    <div className="main-screen">
      <Header />
      <div className="main-content">
        <div className="main-header">
          <h2>Upcoming Cafe Trips</h2>
        </div>
        <button 
          className="create-trip-fab" 
          onClick={() => navigate('/post')}
          aria-label="Create Trip"
        >
          +
        </button>
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="cafe-trip-post">
              <div className="post-header">
                <div className="profile-picture profile-picture-small">
                  <div className="profile-placeholder">{post.author.username.charAt(0)}</div>
                </div>
                <div className="post-user-info">
                  <h4>{post.author.username}</h4>
                </div>
              </div>
              <div className="post-content">
                <h3 className="cafe-name">{post.cafeName}</h3>
                <p className="location">📍 {post.location}</p>
                <div className="post-datetime">
                  <span>📅 {post.date}</span>
                  <span>🕐 {post.time}</span>
                </div>
                <p className="description">{post.description}</p>
              </div>
              <div className="post-actions">
                <button 
                  className={post.joined ? "btn-secondary btn-medium" : "btn-primary btn-medium"}
                  onClick={() => handleJoin(post.id, post.joinByRequest)}
                  disabled={post.joined}
                >
                  {getButtonText(post)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainScreen;