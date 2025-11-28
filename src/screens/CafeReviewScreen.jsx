import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CafeCard from '../components/CafeRating';
import { useAuth } from '../contexts/AuthContext';
/*
// Mock data for cafes - exported for reuse
export const MOCK_CAFES = [
  { _id: '1', name: 'Stagger Cafe', location: 'Ktown', averageRating: 4.5, reviewCount: 12 },
  { _id: '2', name: 'Blue Bottle Coffee', location: 'Arts District', averageRating: 4.8, reviewCount: 24 },
  { _id: '3', name: 'Verve Coffee', location: 'West Hollywood', averageRating: 4.3, reviewCount: 18 },
  { _id: '4', name: 'Alfred Coffee', location: 'Melrose', averageRating: 4.6, reviewCount: 31 },
  { _id: '5', name: 'Go Get Em Tiger', location: 'Los Feliz', averageRating: 4.7, reviewCount: 22 },
  { _id: '6', name: 'Intelligentsia', location: 'Silver Lake', averageRating: 4.4, reviewCount: 15 }
];
*/

const CafeReviewScreen = () => {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const {token} = useAuth()

  useEffect(() => {

    async function loadCafes() {
      try {
        const res = await fetch ('http://localhost:3000/api/cafeReviews', {
          method: "GET",
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}` 
          }
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to load cafes');
        }
        const data = await res.json()
        
        setCafes(data)
      
      } catch(err) {
        console.log(err.message);

      } finally {
        setLoading(false)
      }
    }
    loadCafes()

    /*
    setTimeout(() => {
      setCafes(MOCK_CAFES);
      setLoading(false);
    }, 300);
    */
  }, []);

  return (
    <div className="cafe-review-screen">
      <Header />
      <div className="main-content">
        <div className="main-header">
          <h2>Cafe Reviews</h2>
          <p className="subtitle">Discover and review your favorite cafes</p>
        </div>
        
        {loading && <p className="loading-text">Loading cafes...</p>}
        
        {!loading && cafes.length > 0 && (
          <div className="cafes-grid">
            {cafes.map(cafe => (
              <CafeCard key={cafe._id} cafe={cafe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeReviewScreen;