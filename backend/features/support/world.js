const { setWorldConstructor, After, setDefaultTimeout } = require('@cucumber/cucumber');
const request = require('supertest');

// Increase timeout for slow operations
setDefaultTimeout(10000);

class CafeHopWorld {
  constructor() {
    this.request = request('http://localhost:3000');
    this.response = null;
    this.token = null;
    this.userId = null;
    this.postId = null;
    this.reviewId = null;
    this.createdPosts = [];
    this.createdReviews = [];
  }
}

setWorldConstructor(CafeHopWorld);

// Note: We don't need Before hook for DB connection since the server handles that
// The tests make HTTP requests to the running server

After(async function() {
  // Clean up created posts
  if (this.createdPosts && this.createdPosts.length > 0) {
    for (const postId of this.createdPosts) {
      try {
        await this.request
          .delete(`/api/posts/${postId}`)
          .set('Authorization', `Bearer ${this.token}`);
      } catch (err) {
        // Ignore cleanup errors
      }
    }
  }
  
  // Clean up created reviews
  if (this.createdReviews && this.createdReviews.length > 0) {
    for (const reviewId of this.createdReviews) {
      try {
        await this.request
          .delete(`/api/cafeReviews/${reviewId}`)
          .set('Authorization', `Bearer ${this.token}`);
      } catch (err) {
        // Ignore cleanup errors
      }
    }
  }
});