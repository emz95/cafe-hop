import React from 'react';
import { useNavigate } from 'react-router-dom';

const CafeCard = ({ cafe }) => {
  const navigate = useNavigate();

  const renderTeaRating = (rating) => {
    const fullTeas = Math.floor(rating);
    const hasHalfTea = rating % 1 >= 0.5;
    
    return (
      <div className="tea-rating">
        {'🍵'.repeat(fullTeas)}
        {hasHalfTea && '🫖'}
      </div>
    );
  };

  return (
    <div 
      className="cafe-card" 
      onClick={() => navigate(`/reviews/${cafe._id}`)}
    >
      <div className="cafe-card-image">
        <div className="cafe-image-placeholder">☕</div>
      </div>
      <div className="cafe-card-content">
        <h3 className="cafe-card-name">{cafe.name}</h3>
        {/*<p className="cafe-card-location">📍 {cafe.location}</p> */}
        <div className="cafe-card-rating">
          {renderTeaRating(cafe.avgRating)}
          <span className="rating-text">{cafe.avgRating.toFixed(1)} / 5</span>
        </div>
        <p className="cafe-card-reviews">{cafe.reviewCount} reviews</p>
      </div>
    </div>
  );
};

export default CafeCard;