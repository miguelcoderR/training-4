// This file contains all the HTML templates (views) for the application.

// Main landing page view
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

// Login form view
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

// Registration form view
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

// 404 Not Found view
export const notFoundView = () => `
  <section class="not-found">
    <h2>404</h2>
    <h3>Page Not Found</h3>
    <p>Sorry, the page you are looking for does not exist.</p>
    <a href="#/" class="btn btn-primary">Go Back to Home</a>
  </section>
`;

// Dashboard view, dynamically rendered based on user role
export const dashboardView = (user) => {
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

// Add New Pet form view
export const addPetView = () => `
  <section class="add-pet-form">
    <h2>Add New Pet</h2>
    <form id="add-pet-form">
      <div class="form-group">
        <label for="pet-name">Pet Name</label>
        <input type="text" id="pet-name" required>
      </div>
      <div class="form-group">
        <label for="pet-type">Animal Type</label>
        <input type="text" id="pet-type" required>
      </div>
      <div class="form-group">
        <label for="pet-breed">Breed</label>
        <input type="text" id="pet-breed" required>
      </div>
      <div class="form-group">
        <label for="pet-age">Age</label>
        <input type="number" id="pet-age" required>
      </div>
      <div class="form-group">
        <label for="pet-description">Description</label>
        <textarea id="pet-description" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Save Pet</button>
    </form>
    <p class="auth-switch"><a href="#dashboard">Go Back to Dashboard</a></p>
  </section>
`;

// View for displaying pet details or editing them
export const petDetailsView = (pet, editMode = false) => {
  if (!pet) {
    return `
      <section class="pet-details">
        <h2>Pet Not Found</h2>
        <p>Sorry, we could not find the details for this pet.</p>
        <a href="#dashboard" class="btn btn-secondary">Go Back to Dashboard</a>
      </section>
    `;
  }

  if (editMode) {
    return `
      <section class="pet-details-edit">
        <h2>Edit ${pet.name}</h2>
        <form id="edit-pet-form">
          <div class="form-group">
            <label for="pet-name">Name</label>
            <input type="text" id="pet-name" value="${pet.name}" required>
          </div>
          <div class="form-group">
            <label for="pet-type">Type</label>
            <input type="text" id="pet-type" value="${pet.type}" required>
          </div>
          <div class="form-group">
            <label for="pet-breed">Breed</label>
            <input type="text" id="pet-breed" value="${pet.breed}" required>
          </div>
          <div class="form-group">
            <label for="pet-age">Age</label>
            <input type="number" id="pet-age" value="${pet.age}" required>
          </div>
          <div class="form-group">
            <label for="pet-description">Description</label>
            <textarea id="pet-description" required>${pet.description}</textarea>
          </div>
          <div class="pet-actions">
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <a href="#pet/${pet.id}" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </section>
    `;
  }

  return `
    <section class="pet-details">
      <h2>Details for ${pet.name}</h2>
      <div class="pet-info">
        <p><strong>Type:</strong> ${pet.type}</p>
        <p><strong>Breed:</strong> ${pet.breed}</p>
        <p><strong>Age:</strong> ${pet.age} years</p>
        <p><strong>Description:</strong> ${pet.description}</p>
      </div>
      <div class="pet-actions">
        <a href="#dashboard" class="btn btn-secondary">Go Back to Dashboard</a>
        <a href="#pet/${pet.id}/edit" id="edit-pet-link" class="btn btn-primary">Edit Pet</a>
        <button id="delete-pet-btn" class="btn btn-danger">Delete Pet</button>
      </div>
    </section>
  `;
};

// Form view for customers to request a pet stay
export const requestStayView = (user, pets) => {
  if (!pets || pets.length === 0) {
    return `
      <section class="request-stay">
        <h2>Request a Stay</h2>
        <p>You have no registered pets. Please, <a href="#add-pet">add a pet</a> before requesting a stay.</p>
        <a href="#dashboard" class="btn btn-secondary">Go Back to Dashboard</a>
      </section>
    `;
  }

  const petOptions = pets.map(pet => `<option value="${pet.id}">${pet.name}</option>`).join('');

  return `
    <section class="request-stay">
      <h2>Request a Stay</h2>
      <form id="request-stay-form">
        <div class="form-group">
          <label for="pet-select">Select the pet</label>
          <select id="pet-select" required>
            <option value="">-- Choose a pet --</option>
            ${petOptions}
          </select>
        </div>
        <div class="form-group">
          <label for="start-date">Start Date</label>
          <input type="date" id="start-date" required>
        </div>
        <div class="form-group">
          <label for="end-date">End Date</label>
          <input type="date" id="end-date" required>
        </div>
        <div class="form-group">
          <label for="service-description">Service Description</label>
          <textarea id="service-description" placeholder="Ex: Daycare from 8 am to 5 pm, needs an afternoon walk." required></textarea>
        </div>
        <div class="pet-actions">
          <button type="submit" class="btn btn-primary">Submit Request</button>
          <a href="#dashboard" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
    </section>
  `;
};

// View to display all users (for workers)
export const allUsersView = (users) => {
    const userListHtml = users.map(user => {
        let actionsHtml = '';
        // Only show the 'Convert to Worker' button for customer roles
        if (user.roleId === 'customer') {
            actionsHtml = `
                <button class="btn btn-secondary btn-change-role" data-id="${user.id}" data-role="worker">
                    Convert to Worker
                </button>
            `;
        }
        return `
            <div class="user-card">
                <h4>${user.name}</h4>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.roleId}</p>
                <div class="user-actions">
                    ${actionsHtml}
                </div>
            </div>
        `;
    }).join('');

    return `
        <section class="all-users-view">
            <h2>All Users</h2>
            <p>Here you can view all users registered in the system.</p>
            <a href="#dashboard" class="btn btn-secondary">Go Back to Dashboard</a>
            <div id="user-list-container" class="user-list-container">
                ${userListHtml || '<p>No users registered.</p>'}
            </div>
        </section>
    `;
};

// View to edit a stay (for workers)
export const editStayView = (stay) => {
    return `
        <div class="container edit-stay-view">
            <h1>Edit Stay Request</h1>
            <div class="form-container">
                <form id="edit-stay-form">
                    <div class="form-group">
                        <label for="pet-name">Pet</label>
                        <input type="text" id="pet-name" value="${stay.petName}" disabled>
                    </div>
                    <div class="form-group">
                        <label for="owner-name">Owner</label>
                        <input type="text" id="owner-name" value="${stay.ownerName}" disabled>
                    </div>
                    <div class="form-group">
                        <label for="start-date">Start Date</label>
                        <input type="date" id="start-date" value="${stay.startDate}" required>
                    </div>
                    <div class="form-group">
                        <label for="end-date">End Date</label>
                        <input type="date" id="end-date" value="${stay.endDate}" required>
                    </div>
                    <div class="form-group">
                        <label for="service-description">Service Description</label>
                        <textarea id="service-description" rows="4" required>${stay.description}</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <a href="#dashboard" class="btn btn-secondary">Cancel</a>
                </form>
            </div>
        </div>
    `;
};