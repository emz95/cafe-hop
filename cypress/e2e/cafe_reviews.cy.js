// cypress/e2e/cafe_reviews.cy.js

describe('User leaves a cafe review that becomes visible to others', () => {
    const API = 'http://localhost:3000/api';
  
    const REVIEWER = {
      username: 'revieweruser',
      firstName: 'Review',
      lastName: 'User',
      email: 'reviewer@ucla.edu',
      password: 'Password123!',
    };
  
    const VIEWER = {
      username: 'vieweruser',
      firstName: 'View',
      lastName: 'User',
      email: 'viewer@ucla.edu',
      password: 'Password123!',
    };
  
    // Use a cafe name from cafeSeeder.js
    const TEST_CAFE_NAME = 'Kerckhoff Coffee House';
  
    const REVIEW_TEXT =
      'Great atmosphere and friendly baristas (E2E cafe review)';
    const RATING_VALUE = '4';
  
    // Reuse the same UI login helper pattern as Test 1
    function uiLogin(user) {
      cy.visit('/login');
      cy.get('input[type=email]').type(user.email);
      cy.get('input[type=password]').type(user.password);
      cy.contains('button', 'Login').click();
      cy.url().should('include', '/main');
    }
  
    beforeEach(() => {
      // 1) Reset DB
      cy.request('POST', 'http://localhost:3000/test/reset');
  
      // 2) Seed cafes (using your cafeSeeder turned into /test/seed-cafes)
      cy.request('POST', 'http://localhost:3000/test/seed-cafes');
  
      // 3) Create reviewer + viewer accounts
      cy.request('POST', `${API}/users`, REVIEWER);
      cy.request('POST', `${API}/users`, VIEWER);
    });
  
    it('reviewer creates a review and viewer can see it', () => {
      cy.on('window:alert', () => {}); // just in case any alerts pop up
  
      // ---------------- REVIEWER LOGS IN ----------------
      uiLogin(REVIEWER);
  
      // Go to the cafe reviews hub
      cy.visit('/reviews');
  
      // Find the test cafe card and click it to open /reviews/:cafeId
      cy.contains('.cafe-card-name', TEST_CAFE_NAME, { timeout: 10000 })
        .should('exist')
        .click(); // click on the h3; event bubbles up to .cafe-card
  
      cy.url().should('include', '/reviews/');
  
      // ---------------- REVIEWER SUBMITS A REVIEW ----------------
  
      // TODO: adjust this to your actual rating UI.
      // Example options depending on how you implemented it:

  // Open review form
cy.contains('button', 'Write a Review').click();

// Wait for the form to appear
cy.get('.review-form', { timeout: 10000 }).should('exist');

// Select rating
// Click the 4th emoji (rating = 4)
cy.get('.rating-input .rating-button').eq(3).click();




// Type review text
cy.get('textarea, textarea.review-text')
  .first()
  .clear()
  .type(REVIEW_TEXT);

// Submit review
cy.contains('button', 'Submit Review').click();



      // Reload to confirm it was persisted in DB
      cy.reload();
      cy.contains('.review-card .review-text', REVIEW_TEXT, { timeout: 10000 })
        .should('exist');
      cy.contains('.review-card .review-username', REVIEWER.username).should(
        'exist'
      );
  
      // ---------------- VIEWER LOGS IN AND SEES THE REVIEW ----------------
      uiLogin(VIEWER);
  
      cy.visit('/reviews');
  
      cy.contains('.cafe-card-name', TEST_CAFE_NAME, { timeout: 10000 })
        .should('exist')
        .click();
  
      // Viewer should see the same review and username
      cy.contains('.review-card .review-text', REVIEW_TEXT, { timeout: 10000 })
        .should('exist');
      cy.contains('.review-card .review-username', REVIEWER.username).should(
        'exist'
      );
    });
  });
  