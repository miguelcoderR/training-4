// src/js/services/petService.js

/**
 * Adds a new pet to the system.
 * @param {object} petData - Object with the new pet's data (name, type, breed, age, description, ownerId).
 * @returns {Promise<boolean>} - True if the pet is added successfully, otherwise false.
 */
export const addPet = async (petData) => {
    try {
        const response = await fetch('http://localhost:5000/pets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(petData),
        });

        if (response.ok) {
            alert('Pet added successfully.');
            return true;
        } else {
            alert('Error adding pet.');
            return false;
        }
    } catch (error) {
        console.error('Error adding pet:', error);
        alert('An error occurred. Please try again later.');
        return false;
    }
};

/**
 * Gets all pets in the system or filters by ownerId if provided.
 * @param {string|null} ownerId - (Optional) The owner's ID to filter pets.
 * @returns {Promise<Array>} - An array of pet objects.
 */
export const getPets = async (ownerId = null) => {
    try {
        const url = ownerId ? `http://localhost:5000/pets?ownerId=${ownerId}` : 'http://localhost:5000/pets';
        const response = await fetch(url);
        return response.json();
    } catch (error) {
        console.error('Error loading pets:', error);
        // You could throw the error or return an empty array as needed
        return [];
    }
};

/**
 * Gets the details of a specific pet by its ID.
 * @param {string} petId - The ID of the pet.
 * @returns {Promise<object|null>} - The pet object if found, otherwise null.
 */
export const getPetById = async (petId) => {
    try {
        const response = await fetch(`http://localhost:5000/pets/${petId}`);
        if (response.ok) {
            return response.json();
        }
        return null;
    } catch (error) {
        console.error('Error getting pet by ID:', error);
        return null;
    }
};

/**
 * Updates the information of an existing pet.
 * @param {string} petId - The ID of the pet to update.
 * @param {object} updatedData - Object with the updated pet data.
 * @returns {Promise<boolean>} - True if the update is successful, otherwise false.
 */
export const updatePet = async (petId, updatedData) => {
    try {
        const response = await fetch(`http://localhost:5000/pets/${petId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        if (response.ok) {
            alert('Pet updated successfully.');
            return true;
        } else {
            alert('Error updating the pet.');
            return false;
        }
    } catch (error) {
        console.error('Error updating the pet:', error);
        alert('An error occurred. Please try again later.');
        return false;
    }
};

/**
 * Deletes a pet from the system.
 * @param {string} petId - The ID of the pet to delete.
 * @returns {Promise<boolean>} - True if the deletion is successful, otherwise false.
 */
export const deletePet = async (petId) => {
    try {
        const response = await fetch(`http://localhost:5000/pets/${petId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Pet deleted successfully.');
            return true;
        } else {
            alert('Error deleting the pet.');
            return false;
        }
    } catch (error) {
        console.error('Error deleting the pet:', error);
        alert('An error occurred. Please try again later.');
        return false;
    }
};

/**
 * Checks if a pet has registered stays.
 * @param {string} petId - The ID of the pet.
 * @returns {Promise<boolean>} - True if it has stays, otherwise false.
 */
export const hasStays = async (petId) => {
    try {
        const staysResponse = await fetch(`http://localhost:5000/stays?petId=${petId}`);
        const petStays = await staysResponse.json();
        return petStays.length > 0;
    } catch (error) {
        console.error('Error verifying stays:', error);
        alert('An error occurred while verifying stays.');
        return false; // Assumes no stays in case of error to prevent blocking
    }
};

/**
 * Displays pets in the pet list container.
 * @param {object} user - The current user object (to filter by owner or show all).
 */
export const displayPets = async (user) => {
    const petContent = document.getElementById('pet-list-container');
    if (!petContent) return;
    try {
        const pets = await getPets(); // Gets all pets
        const filteredPets = user.roleId === 'customer'
            ? pets.filter(pet => pet.ownerId === user.id)
            : pets;
        
        const petListHtml = filteredPets.map(pet => {
            let petActionsHtml = '';
            if (user.roleId === 'customer') {
                petActionsHtml = `
                    <div class="pet-actions">
                        <a href="#pet/${pet.id}/edit" class="btn btn-primary">Edit</a>
                        <button class="btn btn-danger" data-id="${pet.id}">Delete</button>
                    </div>
                `;
            }
            return `
                <div class="pet-card">
                    <a href="#pet/${pet.id}"><h3>${pet.name}</h3></a>
                    <p><strong>Type:</strong> ${pet.type}</p>
                    <p><strong>Breed:</strong> ${pet.breed}</p>
                    <p><strong>Age:</strong> ${pet.age} years</p>
                    <p><strong>Description:</strong> ${pet.description}</p>
                    ${petActionsHtml}
                </div>
            `;
        }).join('');
        petContent.innerHTML = filteredPets.length > 0 ? petListHtml : '<p>No pets registered.</p>';
    } catch (error) {
        console.error('Error loading pets:', error);
        petContent.innerHTML = '<p>An error occurred while loading the pets.</p>';
    }
};
