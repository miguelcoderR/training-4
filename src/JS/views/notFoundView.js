// src/js/views/notFoundView.js

/**
 * 404 Not Found page view.
 * @returns {string} HTML for the 404 page.
 */
export const notFoundView = () => `
  <section class="not-found">
    <h2>404</h2>
    <h3>Page Not Found</h3>
    <p>Sorry, the page you are looking for does not exist.</p>
    <a href="#/" class="btn btn-primary">Go Back to Home</a>
  </section>
`;
