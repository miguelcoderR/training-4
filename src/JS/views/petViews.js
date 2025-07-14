// src/js/views/petViews.js

// --- Pet Views ---

/**
 * View for the add new pet form.
 * @returns {string} HTML for the add pet form.
 */
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

/**
 * View for displaying pet details or editing them.
 * @param {object} pet - The pet object.
 * @param {boolean} editMode - True if the view should show the edit form, false for details.
 * @returns {string} HTML for pet details or edit form.
 */
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

