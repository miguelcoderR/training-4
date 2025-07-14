// src/js/services/authService.js

/**
 * Handles user login.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object|null>} - The user object if login is successful, otherwise null.
 */
export const loginUser = async (email, password) => {
    try {
        // Performs the authentication request to the server
        const response = await fetch(`http://localhost:5000/users?email=${email}&password=${password}`); 
        const [user] = await response.json(); // Expects an array and takes the first element

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user)); // Stores the user in localStorage
            alert('Login successful.');
            return user;
        } else {
            alert('Incorrect credentials.');
            return null;
        }
    } catch (error) {
        console.error('Authentication error:', error);
        alert('An error occurred. Please try again later.');
        return null;
    }
};

/**
 * Handles the registration of a new user.
 * @param {object} userData - Object with name, email, and password of the new user.
 * @returns {Promise<boolean>} - True if registration is successful, otherwise false.
 */
export const registerUser = async (userData) => {
    try {
        // Performs the POST request to register the new user
        const response = await fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData, roleId: "customer" }), // Assigns the default role
        });

        if (response.ok) {
            alert('Registration successful. You can now log in.');
            return true;
        } else {
            alert('Registration failed.');
            return false;
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred. Please try again later.');
        return false;
    }
};

/**
 * Logs out the current user.
 */
export const logoutUser = () => {
    localStorage.removeItem('currentUser'); // Removes the user from localStorage
    alert('Logged out successfully.'); // Confirmation message
};

/**
 * Gets the current user from local storage.
 * @returns {object|null} - The user object if it exists, otherwise null.
 */
export const getCurrentUser = () => {
    const storedUser = localStorage.getItem('currentUser');
    try {
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
        console.error('Error parsing currentUser from localStorage:', e);
        localStorage.removeItem('currentUser'); // Clear corrupted data
        return null;
    }
};

