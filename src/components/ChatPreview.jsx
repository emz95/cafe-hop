import React, { useState, useEffect } from 'react';
import Header from './Header';

// Mock leaderboard data (replace with API call when backend is ready)
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

const LeaderboardScreen = () => {
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
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
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
        <div className="main-header">
          <h2>🏆 Leaderboard</h2>
          <p className="subtitle">Top cafe explorers ranked by trip count</p>
        </div>

        {loading && <p className="loading-text">Loading leaderboard...</p>}

        {!loading && leaderboard.length > 0 && (
          <div className="leaderboard-container">
            {leaderboard.map((user) => (
              <div key={user.id} className={`leaderboard-item ${getRankClass(user.rank)}`}>
                <div className="leaderboard-rank">
                  <span className="rank-badge">{getRankBadge(user.rank)}</span>
                </div>
                <div className="leaderboard-user-info">
                  <div className="profile-picture profile-picture-small">
                    <div className="profile-placeholder">{user.avatar}</div>
                  </div>
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

export default LeaderboardScreen;