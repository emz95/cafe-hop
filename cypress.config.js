// cypress.config.js  (ESM style, for "type": "module" projects)
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5174',
    // no setupNodeEvents needed yet
  },
});
