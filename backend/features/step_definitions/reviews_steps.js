const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

When('I submit a review with the following details:', async function(dataTable) {
  const reviewData = dataTable.rowsHash();
  
  this.response = await this.request
    .post('/api/cafeReviews')
    .set('Authorization', `Bearer ${this.token}`)
    .send({
      cafeName: reviewData.cafeName,
      rating: parseInt(reviewData.rating),
      comment: reviewData.comment,
      reviewer: this.userId
    });
  
  if (this.response.status === 201) {
    this.reviewId = this.response.body._id;
    this.cafeName = reviewData.cafeName;
  }
});

Then('the review should be created successfully', function() {
  assert.strictEqual(this.response.status, 201);
  assert.ok(this.response.body._id);
});

Then('the review should be visible on the cafe page', async function() {
  const response = await this.request
    .get(`/api/cafeReviews/cafe/${encodeURIComponent(this.cafeName)}`)
    .set('Authorization', `Bearer ${this.token}`);
  
  assert.strictEqual(response.status, 200);
  const review = response.body.find(r => r._id === this.reviewId);
  assert.ok(review, 'Review should be visible');
});

Given('I have written a review for {string}', async function(cafeName) {
  this.response = await this.request
    .post('/api/cafeReviews')
    .set('Authorization', `Bearer ${this.token}`)
    .send({
      cafeName: cafeName,
      rating: 5,
      comment: 'Original comment',
      reviewer: this.userId
    });
  
  this.reviewId = this.response.body._id;
  this.cafeName = cafeName;
});

When('I update the review rating to {int}', async function(rating) {
  this.newRating = rating;
});

When('I update the review comment to {string}', async function(comment) {
  this.response = await this.request
    .patch(`/api/cafeReviews/${this.reviewId}`)
    .set('Authorization', `Bearer ${this.token}`)
    .send({
      rating: this.newRating,
      comment: comment
    });
});

Then('the review should be updated successfully', function() {
  assert.strictEqual(this.response.status, 200);
});

Then('the updated review should be visible', async function() {
  const response = await this.request
    .get(`/api/cafeReviews/cafe/${encodeURIComponent(this.cafeName)}`)
    .set('Authorization', `Bearer ${this.token}`);
  
  const review = response.body.find(r => r._id === this.reviewId);
  assert.ok(review);
  assert.strictEqual(review.rating, this.newRating);
});

When('I delete my review', async function() {
  this.response = await this.request
    .delete(`/api/cafeReviews/${this.reviewId}`)
    .set('Authorization', `Bearer ${this.token}`);
});

Then('the review should be removed successfully', function() {
  assert.strictEqual(this.response.status, 200);
});

Given('another user has written a review', async function() {
  // Create another user
  const userData = {
    firstName: 'Other',
    lastName: 'User',
    username: 'otheruser' + Date.now(),
    email: `other${Date.now()}@ucla.edu`,
    password: 'password123',
    phone: '9876543210'
  };
  
  const userResponse = await this.request
    .post('/api/users')
    .send(userData);
  
  const otherToken = userResponse.body.token;
  
  // Create review as other user
  const reviewResponse = await this.request
    .post('/api/cafeReviews')
    .set('Authorization', `Bearer ${otherToken}`)
    .send({
      cafeName: 'Some Cafe',
      rating: 4,
      comment: 'Other user review',
      reviewer: userResponse.body._id
    });
  
  this.otherReviewId = reviewResponse.body._id;
});

When('I attempt to edit their review', async function() {
  this.response = await this.request
    .patch(`/api/cafeReviews/${this.otherReviewId}`)
    .set('Authorization', `Bearer ${this.token}`)
    .send({
      rating: 1,
      comment: 'Trying to edit'
    });
});

Then('I should receive an authorization error', function() {
  assert.strictEqual(this.response.status, 403);
});