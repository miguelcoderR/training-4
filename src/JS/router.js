// src/JS/router.js

// Imports views from their new modular files
import { landingView, loginView, registerView } from './views/authViews.js';
import { dashboardView } from './views/dashboardViews.js';
import { addPetView, petDetailsView } from './views/petViews.js';
import { requestStayView, editStayView } from './views/stayViews.js';
import { allUsersView } from './views/userViews.js';
import { notFoundView } from './views/notFoundView.js'; // Imports the 404 view from its new file

// The 'routes' object maps URL hashes to their corresponding view functions.
export const routes = {
    '': landingView,
    'login': loginView,
    'register': registerView,
    'dashboard': dashboardView,
    'add-pet': addPetView,
    'pet': petDetailsView,
    'request-stay': requestStayView,
    'users': allUsersView,
    'edit-stay': editStayView,
    '404': notFoundView, // Ensures this route is mapped
};

// Renders a specific view by inserting its HTML into the main app container.
export const renderView = (view) => {
    document.getElementById('app').innerHTML = view;
};

// Navigates to a new route by updating the URL hash.
export const navigateTo = (path) => {
    window.location.hash = path;
};