// src/js/services/stayService.js

// Import necessary functions from other services
import { getPets } from './petService.js'; // Needed to get pet names
import { getCurrentUser } from './authService.js'; // Needed to get the current user
// We don't import 'navigateTo' or 'renderView' here, as they are responsibilities of 'main.js' or 'router.js'
// and will be passed as arguments if necessary, or redirection will be handled in 'main.js'.


/**
 * Submits a new stay request.
 * @param {object} stayData - Object with stay data (petId, ownerId, startDate, endDate, description).
 * @returns {Promise<boolean>} - True if the request is submitted successfully, otherwise false.
 */
export const requestStay = async (stayData) => {
    try {
        const dailyRate = 40000; // Fixed daily rate
        const start = new Date(stayData.startDate);
        const end = new Date(stayData.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the check-in day
        const totalValue = diffDays * dailyRate;

        const newStay = {
            ...stayData,
            status: 'pending', // Initial status for new requests
            dailyRate,
            totalValue,
        };

        const response = await fetch('http://localhost:5000/stays', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStay),
        });

        if (response.ok) {
            alert('Stay request submitted successfully.');
            return true;
        } else {
            alert('Error submitting request.');
            return false;
        }
    } catch (error) {
        console.error('Error submitting request:', error);
        alert('An error occurred. Please try again later.');
        return false;
    }
};

/**
 * Gets stay requests for a specific owner.
 * @param {string} ownerId - The owner's ID.
 * @returns {Promise<Array>} - An array of stay objects.
 */
export const getStaysByOwnerId = async (ownerId) => {
    try {
        const response = await fetch(`http://localhost:5000/stays?ownerId=${ownerId}`);
        return response.json();
    } catch (error) {
        console.error('Error loading stays by owner:', error);
        return [];
    }
};

/**
 * Gets all stay requests.
 * @returns {Promise<Array>} - An array of stay objects.
 */
export const getAllStays = async () => {
    try {
        const response = await fetch('http://localhost:5000/stays');
        return response.json();
    } catch (error) {
        console.error('Error loading all stays:', error);
        return [];
    }
};

/**
 * Gets the details of a specific stay by its ID.
 * @param {string} stayId - The ID of the stay.
 * @returns {Promise<object|null>} - The stay object if found, otherwise null.
 */
export const getStayById = async (stayId) => {
    try {
        const response = await fetch(`http://localhost:5000/stays/${stayId}`);
        if (response.ok) {
            return response.json();
        }
        return null;
    } catch (error) {
        console.error('Error getting stay by ID:', error);
        return null;
    }
};

/**
 * Updates the status of a stay request (confirmed/rejected).
 * @param {string} stayId - The ID of the stay.
 * @param {string} newStatus - The new status ('confirmed' or 'rejected').
 * @returns {Promise<boolean>} - True if the update is successful, otherwise false.
 */
export const updateStayStatus = async (stayId, newStatus) => {
    try {
        const response = await fetch(`http://localhost:5000/stays/${stayId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (response.ok) {
            alert(`Stay request ${newStatus === 'confirmed' ? 'confirmed' : 'rejected'} successfully.`);
            return true;
        } else {
            alert('Error updating stay status.');
            return false;
        }
    } catch (error) {
        console.error('Error managing the stay:', error);
        alert('An error occurred. Please try again later.');
        return false;
    }
};

/**
 * Updates the complete information of an existing stay.
 * @param {string} stayId - The ID of the stay to update.
 * @param {object} updatedData - Object with the updated stay data.
 * @returns {Promise<boolean>} - True if the update is successful, otherwise false.
 */
export const updateStay = async (stayId, updatedData) => {
    try {
        const response = await fetch(`http://localhost:5000/stays/${stayId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            alert('Stay updated successfully.');
            return true;
        } else {
            alert('An error occurred while updating the stay. Please try again.');
            return false;
        }
    } catch (error) {
        console.error('Error updating the stay:', error);
        alert('An error occurred. Please check the console.');
        return false;
    }
};

/**
 * Deletes a stay request from the system.
 * @param {string} stayId - The ID of the stay to delete.
 * @returns {Promise<boolean>} - True if the deletion is successful, otherwise false.
 */
export const deleteStay = async (stayId) => {
    try {
        const response = await fetch(`http://localhost:5000/stays/${stayId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Stay deleted successfully.');
            return true;
        } else {
            alert('Error deleting the stay.');
            return false;
        }
    } catch (error) {
        console.error('Error deleting the stay:', error);
        alert('An error occurred. Please try again later.');
        return false;
    }
};

/**
 * Displays stays for a specific user (customer) in the stays list container.
 * @param {object} user - The current user object (customer).
 */
export const displayStays = async (user) => {
    const staysContent = document.getElementById('stays-list-container');
    if (!staysContent) return;

    try {
        const stays = await getStaysByOwnerId(user.id); // Uses the service function
        const pets = await getPets(); // Gets all pets to display names

        // Debug logs
        console.log('displayStays: User stays:', stays);
        console.log('displayStays: All pets:', pets);

        const stayListHtml = stays.map(stay => {
            // Ensures ID comparison is numeric
            const pet = pets.find(p => p.id === parseInt(stay.petId)); 
            // Debug log: which pet was found (or not)
            console.log(`displayStays: Looking for pet with ID ${stay.petId}. Found:`, pet);
            
            // More informative message if pet is not found
            const petName = pet ? pet.name : `Pet not found (ID: ${stay.petId})`;
            
            return `
                <div class="stay-card">
                    <h4>Stay for ${petName}</h4>
                    <p><strong>Dates:</strong> ${stay.startDate} to ${stay.endDate}</p>
                    <p><strong>Description:</strong> ${stay.description}</p>
                    <p><strong>Status:</strong> <span class="status-${stay.status}">${stay.status}</span></p>
                </div>
            `;
        }).join('');

        staysContent.innerHTML = stays.length > 0 ? stayListHtml : '<p>No stay requests registered.</p>';

    } catch (error) {
        console.error('Error loading stays:', error);
        staysContent.innerHTML = '<p>An error occurred while loading the stays.</p>';
    }
};

/**
 * Displays all stays in the stays list container (for workers).
 * @param {function} navigateToFunction - The navigation function (for redirects).
 */
export const displayAllStays = async (navigateToFunction) => {
    const staysContent = document.getElementById('stays-list-container');
    if (!staysContent) return;

    try {
        const stays = await getAllStays(); // Uses the service function
        const pets = await getPets(); // Gets all pets
        
        // Here we would need a function to get all users, which will be in userService.js
        // For now, to make it work, we will simulate getting users or import it.
        // We will assume that we will have a 'getUsers' in userService.js
        const usersResponse = await fetch('http://localhost:5000/users'); 
        const users = await usersResponse.json();
        
        const currentUser = getCurrentUser(); // Gets the current user from the authentication service

        // Debug logs
        console.log('displayAllStays: All stays:', stays);
        console.log('displayAllStays: All pets:', pets);
        console.log('displayAllStays: All users:', users);


        const stayListHtml = stays.map(stay => {
            // Ensures ID comparison is numeric
            const pet = pets.find(p => p.id === parseInt(stay.petId)); 
            const owner = users.find(u => u.id === stay.ownerId);

            // Debug log: which pet and owner were found (or not)
            console.log(`displayAllStays: Looking for pet with ID ${stay.petId}. Found:`, pet);
            console.log(`displayAllStays: Looking for owner with ID ${stay.ownerId}. Found:`, owner);

            // More informative message if pet is not found
            const petName = pet ? pet.name : `Pet found (ID: ${stay.petId})`;
            const ownerName = owner ? owner.name : 'Owner not found';
            
            const formattedTotal = new Intl.NumberFormat('en-US', { // Changed to en-US for currency formatting
                style: 'currency',
                currency: 'USD', // Changed to USD for currency formatting
                minimumFractionDigits: 0,
            }).format(stay.totalValue);

            let actionsHtml = '';
            if (currentUser && currentUser.roleId === 'worker') {
                if (stay.status === 'pending') {
                    actionsHtml = `
                        <button class="btn btn-confirm" data-id="${stay.id}">Confirm</button>
                        <button class="btn btn-reject" data-id="${stay.id}">Reject</button>
                    `;
                }
                actionsHtml += `
                    <a href="#stay/${stay.id}/edit" class="btn btn-primary btn-small">Edit</a>
                    <button class="btn btn-danger btn-small" data-id="${stay.id}" data-action="delete">Delete</button>
                `;
            }

            return `
                <div class="stay-card">
                    <h4>Stay for ${petName}</h4>
                    <p><strong>Owner:</strong> ${ownerName}</p>
                    <p><strong>Dates:</strong> ${stay.startDate} to ${stay.endDate}</p>
                    <p><strong>Description:</strong> ${stay.description}</p>
                    <p><strong>Status:</strong> <span class="status-${stay.status}">${stay.status}</span></p>
                    <p><strong>Total Value:</strong> ${formattedTotal}</p>
                    <div class="stay-actions">
                        ${actionsHtml}
                    </div>
                </div>
            `;
        }).join('');

        staysContent.innerHTML = stays.length > 0 ? stayListHtml : '<p>No stay requests.</p>';

    } catch (error) {
        console.error('Error loading stays:', error);
        staysContent.innerHTML = '<p>An error occurred while loading the stays.</p>';
    }
};

/**
 * Handles stay management actions (confirm, reject, delete).
 * @param {function} navigateToFunction - The navigation function (for redirects).
 */
export const handleStayManagement = (navigateToFunction) => {
    const staysContainer = document.getElementById('stays-list-container');
    if (!staysContainer) return;

    staysContainer.addEventListener('click', async (e) => {
        const target = e.target;
        const stayId = target.dataset.id;
        const action = target.dataset.action;

        if (target.classList.contains('btn-confirm') || target.classList.contains('btn-reject')) {
            const newStatus = target.classList.contains('btn-confirm') ? 'confirmed' : 'rejected';
            const updated = await updateStayStatus(stayId, newStatus); // Uses the service function
            if (updated) {
                displayAllStays(navigateToFunction); // Updates the list
            }
        } else if (action === 'delete') {
            if (confirm('Are you sure you want to delete this stay?')) {
                const deleted = await deleteStay(stayId); // Uses the service function
                if (deleted) {
                    displayAllStays(navigateToFunction); // Updates the list
                }
            }
        }
    });
};

/**
 * Handles editing a stay.
 * @param {object} stay - The stay object to edit.
 * @param {function} navigateToFunction - The navigation function (for redirects).
 */
export const handleEditStay = (stay, navigateToFunction) => {
    const editStayForm = document.getElementById('edit-stay-form');
    if (!editStayForm) return;

    editStayForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const description = document.getElementById('service-description').value;
        
        const updatedStayData = {
            ...stay, // Keeps the rest of the properties
            startDate,
            endDate,
            description
        };

        const updated = await updateStay(stay.id, updatedStayData); // Uses the service function
        if (updated) {
            navigateToFunction('dashboard');
        }
    });
};


