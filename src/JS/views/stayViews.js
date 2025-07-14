// src/js/views/stayViews.js

// --- Stay Views ---

/**
 * View for customers to request a pet stay.
 * @param {object} user - The current user object.
 * @param {Array<object>} pets - Array of pet objects belonging to the user.
 * @returns {string} HTML for the stay request form.
 */
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

/**
 * View to edit a stay request (for workers).
 * @param {object} stay - The stay object to edit.
 * @returns {string} HTML for the stay edit form.
 */
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
