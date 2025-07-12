import {
    landingView,      
    loginView,
    registerView,
    dashboardView,
    notFoundView,
    addPetView,
    petDetailsView,   
    requestStayView,
    allUsersView,     
    editStayView
} from './views.js';

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
    '404': notFoundView,
};

// Renders a specific view by inserting its HTML into the main app container.
export const renderView = (view) => {
    document.getElementById('app').innerHTML = view;
};

// Navigates to a new route by updating the URL hash.
export const navigateTo = (path) => {
    window.location.hash = path;
};