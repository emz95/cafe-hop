import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProfilePicture from '../components/ProfilePicture';

// Mock leaderboard data
const MOCK_LEADERBOARD = [
  { id: 1, username: 'judyhopps', tripCount: 47, rank: 1, avatar: 'J' },
  { id: 2, username: 'nickwilde', tripCount: 42, rank: 2, avatar: 'N' },
  { id: 3, username: 'clawhauser', tripCount: 38, rank: 3, avatar: 'C' },
  { id: 4, username: 'chiefbogo', tripCount: 35, rank: 4, avatar: 'C' },
  { id: 5, username: 'gazelle', tripCount: 31, rank: 5, avatar: 'G' },
  { id: 6, username: 'flashsloth', tripCount: 28, rank: 6, avatar: 'F' },
  { id: 7, username: 'mrbigg', tripCount: 24, rank: 7, avatar: 'M' },
  { id: 8, username: 'bellwether', tripCount: 22, rank: 8, avatar: 'B' },
  { id: 9, username: 'yax', tripCount: 19, rank: 9, avatar: 'Y' },
  { id: 10, username: 'finnick', tripCount: 17, rank: 10, avatar: 'F' }
];

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLeaderboard(MOCK_LEADERBOARD);
      setLoading(false);
    }, 300);
  }, []);

  const getRankBadge = (rank) => {
    return `#${rank}`;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-default';
  };

  return (
    <div className="leaderboard-screen">
      <Header />
      <div className="main-content">
        <div className="leaderboard-header-section">
          <h2 className="leaderboard-main-title">🏆 Leaderboard</h2>
          <p className="leaderboard-description">
            See who's exploring the most cafes! Users are ranked by the total number of cafe trips they've completed. 
            Keep hopping to climb the ranks and become the ultimate cafe explorer!
          </p>
        </div>

        {loading && <p className="loading-text">Loading leaderboard...</p>}

        {!loading && leaderboard.length > 0 && (
          <div className="leaderboard-container">
            {leaderboard.map((user, index) => (
              <div key={user.id} className={`leaderboard-item ${getRankClass(user.rank)} ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                <div className="leaderboard-rank">
                  <span className="rank-badge">{getRankBadge(user.rank)}</span>
                </div>
                <div className="leaderboard-user-info">
                  <ProfilePicture username={user.username} size="small" />
                  <div className="leaderboard-details">
                    <h3 className="leaderboard-username">{user.username}</h3>
                    <p className="leaderboard-trips">
                      ☕ {user.tripCount} cafe {user.tripCount === 1 ? 'trip' : 'trips'}
                    </p>
                  </div>
                </div>
                <div className="leaderboard-stats">
                  <span className="trip-count-large">{user.tripCount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;