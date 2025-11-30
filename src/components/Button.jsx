import React from 'react';

const ReviewCard = ({ review, onUserClick, onEdit, onDelete, currentUserId }) => {
  const renderTeaRating = (rating) => {
    return '🍵'.repeat(rating) + '🫖'.repeat(5 - rating);
  };


  

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user-info">
          <div className="profile-picture profile-picture-small">
            <div className="profile-placeholder">{review.reviewer.username.charAt(0).toUpperCase()}</div>
          </div>
          <div>
            <h4 className="review-username clickable" onClick={() => onUserClick && onUserClick(review.reviewer._id)}>{review.reviewer.username}</h4>
            <p className="review-date">{review.date}</p>
          </div>
        </div>
        <div className="review-rating-display">
          {renderTeaRating(review.rating)}
        </div>
      </div>
      <p className="review-text">{review.description}</p>
      {currentUserId && review.reviewer._id === currentUserId && (
        <div className="review-actions">
          <button className="btn btn-secondary btn-small" onClick={() => onEdit && onEdit(review)}>Edit</button>
          <button className="btn btn-secondary btn-small" onClick={() => onDelete && onDelete(review._id)}>Delete</button>
        </div>
      )}
      {review.photos && review.photos.length > 0 && (
        <div className="review-images">
          {review.photos.map((img, idx) => (
            <img key={idx} src={img} alt={`Review ${idx + 1}`} className="review-image" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;