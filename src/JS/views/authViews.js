// src/js/views/authViews.js

// --- Authentication Views ---

/**
 * Main landing page view.
 * @returns {string} HTML for the landing page.
 */
export const landingView = () => `
    <section class="landing-page text-center">
        <h1>Welcome to PetCare Center!</h1>
        <p class="subtitle">Your trusted home for pet care.</p>
        <div class="landing-actions">
            <a href="#login" class="btn btn-primary">Log In</a>
            <a href="#register" class="btn btn-secondary">Create Account</a>
        </div>
    </section>
`;

/**
 * Login form view.
 * @returns {string} HTML for the login form.
 */
export const loginView = () => `
  <section class="auth-form">
    <h2>Log In</h2>
    <form id="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" required>
      </div>
      <button type="submit" class="btn btn-success">Enter</button>
    </form>
    <p class="auth-switch">Don't have an account? <a href="#register">Register here</a></p>
  </section>
`;

/**
 * Registration form view.
 * @returns {string} HTML for the registration form.
 */
export const registerView = () => `
  <section class="auth-form">
    <h2>Register</h2>
    <form id="register-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" required>
      </div>
      <button type="submit" class="btn btn-success">Create Account</button>
    </form>
    <p class="auth-switch">Already have an account? <a href="#login">Log in</a></p>
  </section>
`;