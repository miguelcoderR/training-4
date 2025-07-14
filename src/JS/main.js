import '../css/style.css'; 
import { routes, renderView, navigateTo } from './router.js';

// Import functions from services
import { loginUser, registerUser, logoutUser, getCurrentUser } from './services/authService.js';
import { addPet, getPets, getPetById, updatePet, deletePet, hasStays, displayPets as serviceDisplayPets } from './services/petService.js';
import { requestStay, displayStays, displayAllStays, handleStayManagement, getStayById, handleEditStay } from './services/stayService.js';
import { displayAllUsers as serviceDisplayAllUsers } from './services/userService.js';


// --- VIEW HANDLERS AND SPECIFIC ROUTE LOGIC ---
// These functions are defined first to ensure their availability.

const handleLoginRoute = () => {
    renderView(routes['login']());
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#email').value;
            const password = loginForm.querySelector('#password').value;
            const user = await loginUser(email, password); 
            if (user) {
                navigateTo('dashboard');
            }
        });
    }
};

const handleRegisterRoute = () => {
    renderView(routes['register']());
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = registerForm.querySelector('#name').value;
            const email = registerForm.querySelector('#email').value;
            const password = registerForm.querySelector('#password').value;
            const registered = await registerUser({ name, email, password }); 
            if (registered) {
                navigateTo('login');
            }
        });
    }
};

const handleDashboardRoute = (currentUser) => {
    console.log('currentUser received in handleDashboardRoute:', currentUser); 
    renderView(routes['dashboard'](currentUser));
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logoutUser();
            navigateTo('');
        });
    }

    if (currentUser && currentUser.roleId === 'customer') {
        serviceDisplayPets(currentUser);
        displayStays(currentUser); 
    } else if (currentUser && currentUser.roleId === 'worker') {
        serviceDisplayPets(currentUser);
        displayAllStays(navigateTo); 
        handleStayManagement(navigateTo); 
    }
};

const handleAddPetRoute = (currentUser) => {
    renderView(routes['add-pet'](currentUser));
    const addPetForm = document.getElementById('add-pet-form');
    if (!addPetForm) return;

    addPetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPet = {
            name: addPetForm.querySelector('#pet-name').value,
            type: addPetForm.querySelector('#pet-type').value,
            breed: addPetForm.querySelector('#pet-breed').value,
            age: parseInt(addPetForm.querySelector('#pet-age').value),
            description: addPetForm.querySelector('#pet-description').value,
            ownerId: currentUser.id,
        };

        const added = await addPet(newPet);
        if (added) {
            navigateTo('dashboard');
        }
    });
};

const handleRequestStayRoute = async (currentUser) => {
    if (currentUser && currentUser.roleId === 'customer') {
        const pets = await getPets(currentUser.id);
        renderView(routes['request-stay'](currentUser, pets));
        const requestStayForm = document.getElementById('request-stay-form');
        if (!requestStayForm) return;

        requestStayForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const petId = requestStayForm.querySelector('#pet-select').value;
            const startDate = requestStayForm.querySelector('#start-date').value;
            const endDate = requestStayForm.querySelector('#end-date').value;
            const description = requestStayForm.querySelector('#service-description').value;

            const stayData = { petId: parseInt(petId), ownerId: currentUser.id, startDate, endDate, description };
            const requested = await requestStay(stayData);
            if (requested) {
                navigateTo('dashboard');
            }
        });
    } else {
        navigateTo('dashboard');
    }
};

const handlePetRoute = async (path, currentUser) => {
    if (!currentUser) {
        navigateTo('login');
        return;
    }
    
    const pathParts = path.split('/');
    const petId = pathParts[1];
    const editMode = pathParts[2] === 'edit';

    try {
        const pet = await getPetById(petId);
        
        const isWorker = currentUser.roleId === 'worker';
        const isOwner = pet && pet.ownerId === currentUser.id;

        if (pet && pet.id && (isWorker || isOwner)) {
            renderView(routes['pet'](pet, editMode));
            if (editMode && (isWorker || isOwner)) {
                const editPetForm = document.getElementById('edit-pet-form');
                if (editPetForm) {
                    editPetForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const hasAssociatedStays = await hasStays(pet.id);
                        if (hasAssociatedStays) {
                            alert('This pet cannot be edited because it has registered stays.');
                            return;
                        }

                        const updatedPetData = {
                            name: editPetForm.querySelector('#pet-name').value,
                            type: editPetForm.querySelector('#pet-type').value,
                            breed: editPetForm.querySelector('#pet-breed').value,
                            age: parseInt(editPetForm.querySelector('#pet-age').value),
                            description: editPetForm.querySelector('#pet-description').value,
                        };
                        const updated = await updatePet(pet.id, updatedPetData);
                        if (updated) {
                            navigateTo(`pet/${pet.id}`);
                        }
                    });
                }
            } else {
                const deleteBtn = document.getElementById('delete-pet-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', async () => {
                        const hasAssociatedStays = await hasStays(pet.id);
                        if (hasAssociatedStays) {
                            alert('This pet cannot be deleted because it has registered stays.');
                            return;
                        }
                        if (confirm('Are you sure you want to delete this pet?')) {
                            const deleted = await deletePet(pet.id);
                            if (deleted) {
                                navigateTo('dashboard');
                            }
                        }
                    });
                }
            }
        } else {
            renderView(routes['404'](null));
        }
    } catch (error) {
        console.error('Error loading pet:', error);
        renderView(routes['404'](null));
    }
};

const handleDefaultRoute = () => {
    renderView(routes['']());
};

const handleAllUsersRoute = async (currentUser) => {
    if (!currentUser || currentUser.roleId !== 'worker') {
        navigateTo('dashboard');
        return;
    }
    // Pass renderView and routes to the service function for re-rendering
    serviceDisplayAllUsers(renderView, routes); 
};

const handleEditStayRoute = async (path, currentUser) => {
    if (!currentUser || currentUser.roleId !== 'worker') {
        navigateTo('dashboard');
        return;
    }
    
    const stayId = path.split('/')[1];

    try {
        const stay = await getStayById(stayId); 
        
        // Keep fetch logic for pet and owner here temporarily
        // until we have specific functions in petService and userService
        const petResponse = await fetch(`http://localhost:5000/pets/${stay.petId}`);
        const pet = await petResponse.json();
        
        const ownerResponse = await fetch(`http://localhost:5000/users/${stay.ownerId}`);
        const owner = await ownerResponse.json();

        if (stay && stay.id) {
            stay.petName = pet ? pet.name : 'Unknown';
            stay.ownerName = owner ? owner.name : 'Unknown';
            
            renderView(routes['edit-stay'](stay));
            handleEditStay(stay, navigateTo); 
        } else {
            renderView(routes['404'](null));
        }
    } catch (error) {
        console.error('Error loading stay:', error);
        renderView(routes['404'](null));
    }
};


// --- MAIN NAVIGATION CONTROLLER ---
// These functions control the main application navigation.
// They are defined after the route handlers to ensure the functions they call are available.

const handleViewLogic = (path, currentUser) => {
    const pathParts = path.split('/');
    const mainPath = pathParts[0];

    switch (mainPath) {
        case '':
            handleDefaultRoute();
            break;
        case 'login':
            handleLoginRoute();
            break;
        case 'register':
            handleRegisterRoute();
            break;

        case 'users':
            handleAllUsersRoute(currentUser);
            break;     

        case 'stay': 
            if (pathParts[2] === 'edit') {
                handleEditStayRoute(path, currentUser);
            } else {
                renderView(routes['404'](null)); 
            }
            break;

        case 'dashboard':
            handleDashboardRoute(currentUser);
            break;
        case 'add-pet':
            handleAddPetRoute(currentUser);
            break;
        case 'request-stay':
            handleRequestStayRoute(currentUser);
            break;
        case 'pet':
            handlePetRoute(path, currentUser);
            break;
        default:
            renderView(routes['404'](null));
            break;
    }
};

const handleNavigation = () => {
    const path = window.location.hash.slice(1);
    let currentUser = getCurrentUser(); 

    console.log('Loading currentUser from localStorage (after parsing):', currentUser);
    console.log('Current Path:', path);
    console.log('Is currentUser (boolean)?', !!currentUser);

    if ((path.startsWith('dashboard') || path.startsWith('add-pet') || path.startsWith('pet') || path.startsWith('request-stay') || path.startsWith('users') || path.startsWith('stay')) && !currentUser) {
        console.log('Redirecting to landing: Access to protected route without user.');
        navigateTo('');
        return;
    }
    if ((path === 'login' || path === 'register') && currentUser) {
        console.log('Redirecting to dashboard: Attempting to access login/register while logged in.');
        navigateTo('dashboard');
        return;
    }
    
    handleViewLogic(path, currentUser);
};


// --- APPLICATION INITIALIZATION ---
// Event listeners are placed at the end to ensure all functions are defined.
window.addEventListener('hashchange', handleNavigation);
document.addEventListener('DOMContentLoaded', handleNavigation);