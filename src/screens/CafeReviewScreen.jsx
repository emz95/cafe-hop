import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CafeCard from '../components/CafeRating';
import { useAuth } from '../contexts/AuthContext';

/*
 * AI GENERATED SECTION - Cafe Rating Display
 * Prompt: "Create a React component to display cafe ratings using a tea cup icon system.
 * Fetch cafes from backend API, show average rating (1-5 tea cups), review count,
 * and location. Make it visually appealing with cards and grid layout."
 */

/**
 * CafeReviewScreen - Main screen for browsing and reviewing cafes
 * Displays all cafes with their ratings in a grid layout
 */
const CafeReviewScreen = () => {
  // Store list of cafes from backend
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const {token} = useAuth()

  // Fetch cafes when component loads
  useEffect(() => {
    // Get all cafes with their ratings from backend
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
        
        // Update state with fetched cafes
        setCafes(data)
      
      } catch(err) {
        console.log(err.message);

      } finally {
        setLoading(false)
      }
    }
    loadCafes()
  }, []);
  /* END AI GENERATED SECTION */

  return (
    <div className="cafe-review-screen">
      <Header />
      <div className="main-content">
        <div className="main-header">
          <h2>Cafe Reviews</h2>
          <p className="subtitle">Discover and review your favorite cafes</p>
        </div>
        
        {/* Show loading message while fetching data */}
        {loading && <p className="loading-text">Loading cafes...</p>}
        
        {/* Display cafes in a grid once loaded */}
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