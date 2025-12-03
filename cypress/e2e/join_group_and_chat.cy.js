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
  