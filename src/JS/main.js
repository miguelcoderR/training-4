// src/js/main.js

import '../css/style.css'; 
import { routes, renderView } from './router.js';
import { dashboardView, notFoundView, landingView, loginView, registerView } from './views.js';

// --- FUNCIONES DE LÓGICA DE LA APLICACIÓN ---

// Función para manejar el inicio de sesión
const handleLogin = () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#email').value;
            const contrasena = loginForm.querySelector('#password').value;
            try {
                const response = await fetch(`http://localhost:5000/users?email=${email}&contrasena=${contrasena}`);
                const [user] = await response.json();
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    alert('Inicio de sesión exitoso.');
                    navigateTo('dashboard');
                } else {
                    alert('Credenciales incorrectas.');
                }
            } catch (error) {
                console.error('Error en la autenticación:', error);
                alert('Ocurrió un error. Inténtalo más tarde.');
            }
        });
    }
};

const handleRegister = () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = registerForm.querySelector('#nombre').value;
            const email = registerForm.querySelector('#email').value;
            const contrasena = registerForm.querySelector('#password').value;
            const newUser = {
                nombre,
                email,
                contrasena,
                rolId: "customer",
            };
            try {
                const response = await fetch('http://localhost:5000/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });
                if (response.ok) {
                    alert('Registro exitoso. Ahora puedes iniciar sesión.');
                    navigateTo('login');
                } else {
                    alert('El registro falló.');
                }
            } catch (error) {
                console.error('Error en el registro:', error);
                alert('Ocurrió un error. Inténtalo más tarde.');
            }
        });
    }
};

const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigateTo('');
};

const handleDashboard = () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
};

const navigateTo = (path) => {
    window.location.hash = path;
};

const handleNavigation = () => {
    const path = window.location.hash.slice(1);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (path === 'dashboard' && !currentUser) {
        navigateTo('');
        return;
    }
    if ((path === 'login' || path === 'register') && currentUser) {
        navigateTo('dashboard');
        return;
    }

    let viewContent;
    if (path === 'dashboard' && currentUser) {
        viewContent = dashboardView(currentUser);
        renderView(viewContent);
        handleDashboard();
    } else {
        viewContent = routes[path] || notFoundView;
        renderView(viewContent);
        if (path === 'login') {
            handleLogin();
        } else if (path === 'register') {
            handleRegister();
        }
    }
};

window.addEventListener('hashchange', handleNavigation);

document.addEventListener('DOMContentLoaded', handleNavigation);