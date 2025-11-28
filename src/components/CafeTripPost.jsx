import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import ReviewCard from './Button';
import { useAuth } from '../contexts/AuthContext';


// Convert array to object for quick lookup by ID
/*
const MOCK_CAFES = MOCK_CAFES_ARRAY.reduce((acc, cafe) => {
  acc[cafe._id] = cafe;
  return acc;
}, {});
*/
/*
// Mock reviews data (replace with API call when backend is ready)
const MOCK_REVIEWS = [
  {
    id: 1,
    username: 'judyhopps',
    rating: 5,
    text: 'Amazing atmosphere and great coffee! Perfect place for studying.',
    images: [],
    date: '2025-11-10'
  },
  {
    id: 2,
    username: 'nickwilde',
    rating: 4,
    text: 'Good vibes and friendly staff. The matcha latte is a must-try!',
    images: [],
    date: '2025-11-08'
  },
  {
    id: 3,
    username: 'tux',
    rating: 5,
    text: 'Love this place! The pastries are incredible and the coffee is top-notch.',
    images: [],
    date: '2025-11-05'
  }
];
*/
const CafeDetailScreen = () => {
  const { cafeId } = useParams();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const {token} = useAuth()
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    text: '',
    images: []
  });

  useEffect(() => {
    async function loadCafe() {
      try {
        const res = await fetch (`http://localhost:3000/api/cafes/${cafeId}`, {
          method: "GET",
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to load cafe');
        }
        const data = await res.json()
        
        setCafe(data)
      
      } catch(err) {
        console.log(err.message);
      }
    }

    async function loadReviews() {
      try {
        const res = await fetch (`http://localhost:3000/api/cafeReviews/byCafe/${cafeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to load reviews');
        }
        const data = await res.json()
        
        setReviews(data)

      } catch (err) {
        console.log(err.message)
      }
    }
    async function init() {
      setLoading(true);
      await Promise.all([loadCafe(), loadReviews()]);
      setLoading(false);
    }
  
    if (cafeId) {
      init();
    }


  }, [cafeId]);

  const renderTeaRating = (rating) => {
    const fullTeas = Math.floor(rating);
    const hasHalfTea = rating % 1 >= 0.5;
    const emptyTeas = 5 - fullTeas - (hasHalfTea ? 1 : 0);
    
    return (
      <div className="tea-rating-large">
        {'🍵'.repeat(fullTeas)}
        {hasHalfTea && '🫖'}
        {'⚪'.repeat(emptyTeas)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="cafe-detail-screen">
        <Header />
        <div className="main-content">
          <p className="loading-text">Loading cafe details...</p>
        </div>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="cafe-detail-screen">
        <Header />
        <div className="main-content">
          <p className="error-text">Cafe not found</p>
          <button className="btn-secondary" onClick={() => navigate('/reviews')}>
            Back to Cafes
          </button>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setNewReview(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const review = {
      id: Date.now(),
      username: 'currentUser', // Replace with actual user
      rating: newReview.rating,
      text: newReview.text,
      images: newReview.images,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, text: '', images: [] });
    setShowReviewForm(false);
  };

  const removeImage = (index) => {
    setNewReview(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="cafe-detail-screen">
      <Header />
      <div className="main-content">
        <button className="back-button" onClick={() => navigate('/reviews')}>
          ← Back to Cafes
        </button>
        
        <div className="cafe-detail-header">
          <div className="cafe-detail-info">
            <h1 className="cafe-detail-name">{cafe.name}</h1>
            <p className="cafe-detail-location">📍 {cafe.location}</p>
            <div className="cafe-detail-rating">
              {renderTeaRating(cafe.avgRating)}
              <span className="rating-text-large">
                {cafe.avgRating.toFixed(1)} / 5.0
              </span>
            </div>
            <p className="cafe-detail-review-count">
              Based on {cafe.reviewCount} reviews
            </p>
          </div>
        </div>

        <div className="reviews-section">
          <div className="reviews-header">
            <h2 className="reviews-title">Reviews</h2>
            <button 
              className="btn btn-primary btn-medium"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {showReviewForm && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={`rating-button ${newReview.rating >= num ? 'active' : ''}`}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: num }))}
                    >
                      🍵
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  className="review-textarea"
                  value={newReview.text}
                  onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Share your experience at this cafe..."
                  required
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Add Photos</label>
                <div className="image-upload-section">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" className="upload-button">
                    📷 Upload Images
                  </label>
                  
                  {newReview.images.length > 0 && (
                    <div className="preview-images">
                      {newReview.images.map((img, idx) => (
                        <div key={idx} className="preview-image-container">
                          <img src={img} alt={`Preview ${idx + 1}`} className="preview-image" />
                          <button
                            type="button"
                            className="remove-image-button"
                            onClick={() => removeImage(idx)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-medium btn-full-width">
                Submit Review
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};




export default CafeDetailScreen;