// src/js/views/dashboardViews.js

// --- Dashboard Views ---

/**
 * Dashboard view, dynamically rendered based on user role.
 * @param {object} user - The current user object.
 * @returns {string} HTML for the dashboard based on the user's role.
 */
export const dashboardView = (user) => {
  // Check if the 'user' object is null or undefined
  if (!user) {
      return `
          <section class="dashboard-error text-center">
              <h2>Dashboard Error</h2>
              <p>Could not load user information. Please, <a href="#login" class="btn btn-primary">log in</a> again.</p>
          </section>
      `;
  }

  if (user.roleId === 'worker') {
    return `
      <section class="dashboard-worker">
      <h2>Worker's Dashboard</h2>
      <p>Welcome, ${user.name}.</p>
      
      <div class="dashboard-actions">
        <a href="#users" class="btn btn-primary">View all users</a>
      </div>

      <h3>Pet Management</h3>
      <div id="pet-list-container" class="pet-list-container"></div>
      
      <hr>

      <h3>Stay Management</h3>
      <div id="stays-list-container" class="stays-list-container"></div>

      <a href="#" id="logout-btn" class="btn btn-danger">Log Out</a>
    </section>
    `;
  } else if (user.roleId === 'customer') {
    return `
      <section class="dashboard-customer">
        <h2>Customer's Dashboard</h2>
        <p>Welcome, ${user.name}.</p>

        <h3>My Pets</h3>
        <a href="#add-pet" class="btn btn-primary">Add Pet</a>
        <a href="#request-stay" class="btn btn-secondary">Request a Stay</a>
        <div id="pet-list-container" class="pet-list-container"></div>
        
        <hr>

        <h3>My Stay Requests</h3>
        <div id="stays-list-container" class="stays-list-container"></div>

        <a href="#" id="logout-btn" class="btn btn-danger">Log Out</a>
      </section>
    `;
  }
};
