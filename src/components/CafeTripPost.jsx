import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import ReviewCard from './Button';

// Mock data for cafes (replace with API call when backend is ready)
const MOCK_CAFES = {
  '1': { _id: '1', name: 'Stagger Cafe', location: 'Ktown', averageRating: 4.5, reviewCount: 12 },
  '2': { _id: '2', name: 'Blue Bottle Coffee', location: 'Arts District', averageRating: 4.8, reviewCount: 24 },
  '3': { _id: '3', name: 'Verve Coffee', location: 'West Hollywood', averageRating: 4.3, reviewCount: 18 },
  '4': { _id: '4', name: 'Alfred Coffee', location: 'Melrose', averageRating: 4.6, reviewCount: 31 },
  '5': { _id: '5', name: 'Go Get Em Tiger', location: 'Los Feliz', averageRating: 4.7, reviewCount: 22 },
  '6': { _id: '6', name: 'Intelligentsia', location: 'Silver Lake', averageRating: 4.4, reviewCount: 15 }
};

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

const CafeDetailScreen = () => {
  const { cafeId } = useParams();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    text: '',
    images: []
  });

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      const cafeData = MOCK_CAFES[cafeId];
      if (cafeData) {
        setCafe(cafeData);
        setReviews(MOCK_REVIEWS);
      }
      setLoading(false);
    }, 300);
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
              {renderTeaRating(cafe.averageRating)}
              <span className="rating-text-large">
                {cafe.averageRating.toFixed(1)} / 5.0
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
              className="btn-primary btn-medium"
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

              <button type="submit" className="btn-primary btn-medium btn-full-width">
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