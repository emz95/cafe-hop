// AI Generated, prompts in bottom of file
describe('Guest joins group and sends message', () => {
    const API = 'http://localhost:3000/api';
  
    const HOST = {
      username: 'hostuser',
      firstName: 'Host',
      lastName: 'User',
      email: 'host@ucla.edu',
      password: 'Password123!',
    };
  
    const GUEST = {
      username: 'guestuser',
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@ucla.edu',
      password: 'Password123!',
    };
  
    const TEST_POST = {
      cafeName: 'E2E Test Cafe',
      location: 'Westwood',
      description: 'E2E Test Trip',
    };
  
    // Helper: Login via API and return access token
    function apiLogin(user) {
      return cy
        .request('POST', `${API}/users/login`, {
          email: user.email,
          password: user.password,
        })
        .then((res) => res.body.token);
    }
  
    // Helper: Login through UI (cookie + memory flow)
    function uiLogin(user) {
      cy.visit('/login');
      cy.get('input[type=email]').type(user.email);
      cy.get('input[type=password]').type(user.password);
      cy.contains('button', 'Login').click();
      cy.url().should('include', '/main');
    }
  
    beforeEach(() => {
      // Reset database
      cy.request('POST', 'http://localhost:3000/test/reset');
  
      // Create host + guest accounts
      cy.request('POST', `${API}/users`, HOST);
      cy.request('POST', `${API}/users`, GUEST);
  
      // Host logs in (API) -> creates a post with Bearer token
      apiLogin(HOST).then((accessToken) => {
        const oneHourFromNow = new Date(Date.now() + 3600000).toISOString();
  
        cy.request({
          method: 'POST',
          url: `${API}/posts`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: {
            cafeName: TEST_POST.cafeName,
            location: TEST_POST.location,
            date: oneHourFromNow,
            description: TEST_POST.description,
          },
        });
      });
    });
  
    it('guest requests to join, host approves, guest chats', () => {
      cy.on('window:alert', () => {}); // suppress alert popups
  
      // ---------------- GUEST LOGS IN (UI) ----------------
      uiLogin(GUEST);
  
      // Guest sees the post
      cy.contains('.cafe-trip-post .cafe-name', TEST_POST.cafeName).should('exist');
  
      // Guest requests to join
      cy.contains('.cafe-trip-post', TEST_POST.cafeName)
        .find('button')
        .contains('Request to Join')
        .click();
  
      cy.contains('.cafe-trip-post', TEST_POST.cafeName)
        .find('button')
        .contains('Requested')
        .should('exist');
  
      // Logout guest by clearing memory storage
      cy.window().then((win) => win.location.reload());
  
  
      // ---------------- HOST LOGS IN (UI) ----------------
      uiLogin(HOST);
  
      // Host navigates to requests page
      cy.visit('/requests');
  
      // Host sees pending requests
      cy.contains('h3', 'Pending Requests', { timeout: 10000 }).should('exist');
  
      // Approve the user
cy.contains('button', 'Accept').first().click();
  
      // Should navigate to chats
      cy.url().should('include', '/chats');
  
  
      // ---------------- GUEST LOGS IN AGAIN & CHATS ----------------
      uiLogin(GUEST);
  
      cy.visit('/chats');
  
      // Select the group chat
      cy.get('.chat-preview', { timeout: 10000 }).first().click();
  
      // Send message
      const msg = 'Hello from Cypress E2E!';
      cy.get('input.chat-input').type(msg);
      cy.contains('button', 'Send').click();
  
      // Message appears
      cy.contains('.message-text', msg, { timeout: 10000 }).should('exist');
    // ---------------- HOST CAN SEE THE MESSAGE TOO ----------------
    uiLogin(HOST);
    cy.visit('/chats');

    // open the chat (first chat)
    cy.get('.chat-preview', { timeout: 10000 }).first().click();

    // the host should also see the guest’s message
    cy.contains('.message-text', msg, { timeout: 10000 }).should('exist');

    });
  });
  

  /*
  Prompts: 
  1. You are a software engineer tasked with writing 2 end to end tests to test our project. 
    Our project currently has login, sign in, creating a post, viewing posts and filtering, sending request to join a group (from post), approving people's join requests, 
    sending chat messages to an accepted group, and writing reviews for cafes. Give me your plan for the 2 tests.

  2. cypress is installed. what kind of files would u need to complete writing the first test of Test 1 – 
   “New user joins a group and sends first chat message” Keep the flow simpler

  3. i currently do not have a way to reset accounts. what would be the best way to reset our database if we are using mongodb, mongoose, and express

  4. write Test 1 – “New user joins a group and sends first chat message” Keep the flow simpler. you already have /test/reset.
    Added files relevant. What other files do you need. 
  
  5. Where do I need to add/change cypress files. 


  6. What about the config
  what about the config // cypress.config.js (ESM style, for "type": "module" projects) import { defineConfig } from 'cypress'; export default defineConfig({ e2e: { baseUrl: 'http://localhost:5174', // no setupNodeEvents needed yet }, });

  7. Sent picture of register screen. This is register. Rewrite test to account for users getting reset. 

  8. similarly write cypress test to test for this Test 2 – “User leaves a cafe review that becomes visible to others”

  9. I am not using localstorage. 

  had to change variables to match and test user emails to end in @ucla.edu to match

  10. debugging error submitting rating
    CypressError Timed out retrying after 4000ms: cy.find() failed because it requires a DOM element or document. No elements in the current DOM matched your query: > cy.contains(Rating).parent()

  11. Pasted in UI file again that contained rating

  */


 