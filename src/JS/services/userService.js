// src/js/services/userService.js

// Import necessary functions from other services if any (e.g., authService for getCurrentUser)
import { getCurrentUser } from './authService.js'; // Needed for permission logic

/**
 * Gets all registered users in the system.
 * @returns {Promise<Array>} - An array of user objects.
 */
export const getAllUsers = async () => {
    try {
        const response = await fetch('http://localhost:5000/users');
        return response.json();
    } catch (error) {
        console.error('Error loading users:', error);
        return []; // Returns an empty array in case of error
    }
};

/**
 * Updates a user's role.
 * @param {string} userId - The ID of the user to update.
 * @param {string} newRoleId - The new role ID (e.g., 'worker', 'customer').
 * @returns {Promise<boolean>} - True if the role update is successful, otherwise false.
 */
export const updateUserRole = async (userId, newRoleId) => {
    try {
        const response = await fetch(`http://localhost:5000/users/${userId}`, {
            method: 'PATCH', // Use PATCH for partial updates
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roleId: newRoleId }),
        });

        if (response.ok) {
            alert(`User role updated to ${newRoleId} successfully.`);
            return true;
        } else {
            alert('Error updating user role.');
            return false;
        }
    } catch (error) {
        console.error('Error updating user role:', error);
        alert('An error occurred while updating user role. Please try again later.');
        return false;
    }
};

/**
 * Displays all users in the user list container.
 * @param {function} renderViewFunction - The function to render the view (imported from router.js).
 * @param {object} routesObject - The routes object (imported from router.js).
 */
export const displayAllUsers = async (renderViewFunction, routesObject) => {
    const users = await getAllUsers(); // Uses the service function
    renderViewFunction(routesObject['users'](users)); // Renders the all users view

    // Add event listeners for role change buttons
    const userListContainer = document.getElementById('user-list-container');
    if (userListContainer) {
        userListContainer.addEventListener('click', async (e) => {
            const target = e.target;
            if (target.classList.contains('btn-change-role')) {
                const userId = target.dataset.id;
                const newRole = target.dataset.role; // This will be 'worker'

                if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
                    const updated = await updateUserRole(userId, newRole);
                    if (updated) {
                        // Re-render the user list to reflect the change
                        // Pass the necessary functions to re-render the view
                        displayAllUsers(renderViewFunction, routesObject);
                    }
                }
            }
        });
    }
};