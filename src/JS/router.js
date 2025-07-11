// src/js/router.js

import { landingView, loginView, registerView, notFoundView, dashboardView } from './views.js';

export const routes = {
  '': landingView,
  'login': loginView,
  'register': registerView,
  'dashboard': dashboardView,
  '404': notFoundView,
};

const root = document.getElementById('root');

export const renderView = (htmlContent) => {
  root.innerHTML = htmlContent;
};