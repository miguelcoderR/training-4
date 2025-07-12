import '../css/style.css'; 
import { routes, renderView } from './router.js';
import { notFoundView } from './views.js';

// --- VIEW HANDLERS ---

const handleLoginRoute = () => {
    renderView(routes['login']());
    handleLogin();
};

const handleRegisterRoute = () => {
    renderView(routes['register']());
    handleRegister();
};

const handleDashboardRoute = (currentUser) => {
    renderView(routes['dashboard'](currentUser));
    handleDashboard(currentUser);
};

const handleAddPetRoute = (currentUser) => {
    renderView(routes['add-pet'](currentUser));
    handleAddPet(currentUser);
};

const handleRequestStayRoute = async (currentUser) => {
    if (currentUser && currentUser.roleId === 'customer') {
        const pets = await getPetsByOwnerId(currentUser.id);
        renderView(routes['request-stay'](currentUser, pets));
        handleRequestStay(currentUser);
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
        const response = await fetch(`http://localhost:5000/pets/${petId}`);
        const pet = await response.json();
        
        // Check if the pet exists and if the current user has permissions
        const isWorker = currentUser.roleId === 'worker';
        const isOwner = pet.ownerId === currentUser.id;

        if (pet && pet.id && (isWorker || isOwner)) {
            renderView(routes['pet'](pet, editMode));
            if (editMode && (isWorker || isOwner)) {
                handleEditPet(pet, currentUser);
            } else {
                handleDeletePet(pet.id, currentUser);
            }
        } else {
            // If the user does not have permissions or the pet does not exist, show a 404
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

// --- ADDED FUNCTION: Logic to display all users ---
const handleAllUsersRoute = async (currentUser) => {
    if (!currentUser || currentUser.roleId !== 'worker') {
        navigateTo('dashboard');
        return;
    }
    await displayAllUsers();
};


// --- APPLICATION LOGIC FUNCTIONS ---

const handleLogin = () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#email').value;
            const password = loginForm.querySelector('#password').value;
            try {
                const response = await fetch(`http://localhost:5000/users?email=${email}&contrasena=${password}`);
                const [user] = await response.json();
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    alert('Login successful.');
                    navigateTo('dashboard');
                } else {
                    alert('Incorrect credentials.');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }
};

const handleRegister = () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = registerForm.querySelector('#nombre').value;
            const email = registerForm.querySelector('#email').value;
            const password = registerForm.querySelector('#password').value;
            const newUser = {
                name,
                email,
                password,
                roleId: "customer",
            };
            try {
                const response = await fetch('http://localhost:5000/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });
                if (response.ok) {
                    alert('Registration successful. You can now log in.');
                    navigateTo('login');
                } else {
                    alert('Registration failed.');
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }
};

const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigateTo('');
};

const handleDashboard = (user) => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    if (user.roleId === 'customer') {
        displayPets(user);
        displayStays(user);
    } else if (user.roleId === 'worker') {
        displayPets(user);
        displayAllStays();
        handleStayManagement();
    }
};

const handleAddPet = (user) => {
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
            ownerId: user.id,
        };

        try {
            const response = await fetch('http://localhost:5000/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPet),
            });

            if (response.ok) {
                alert('Pet added successfully.');
                navigateTo('dashboard');
            } else {
                alert('Error adding pet.');
            }
        } catch (error) {
            console.error('Error adding pet:', error);
            alert('An error occurred. Please try again later.');
        }
    });
};

const getPetsByOwnerId = async (ownerId) => {
    const response = await fetch(`http://localhost:5000/pets?ownerId=${ownerId}`);
    return response.json();
};

const handleRequestStay = (user) => {
    const requestStayForm = document.getElementById('request-stay-form');
    if (!requestStayForm) return;

    requestStayForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const petId = requestStayForm.querySelector('#pet-select').value;
        const startDate = requestStayForm.querySelector('#start-date').value;
        const endDate = requestStayForm.querySelector('#end-date').value;
        const description = requestStayForm.querySelector('#service-description').value;

        // --- Logic to calculate the total value ---
        const dailyRate = 40000; // Fixed daily rate
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the check-in day
        const totalValue = diffDays * dailyRate;

        const newStay = {
            petId: parseInt(petId),
            ownerId: user.id,
            startDate,
            endDate,
            description,
            status: 'pending',
            dailyRate,
            totalValue,
        };

        try {
            const response = await fetch('http://localhost:5000/stays', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStay),
            });

            if (response.ok) {
                alert('Stay request sent successfully.');
                navigateTo('dashboard');
            } else {
                alert('Error sending request.');
            }
        } catch (error) {
            console.error('Error sending request:', error);
            alert('An error occurred. Please try again later.');
            console.log(error);
        }
    });
};

const handleEditPet = (pet, user) => {
    const editPetForm = document.getElementById('edit-pet-form');
    if (!editPetForm) return;

    if (user.roleId !== 'worker' && pet.ownerId !== user.id) {
        return; 
    }

    editPetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if the pet has associated stays
        try {
            const staysResponse = await fetch(`http://localhost:5000/stays?petId=${pet.id}`);
            const petStays = await staysResponse.json();

            if (petStays.length > 0) {
                alert('This pet cannot be edited because it has registered stays.');
                return; // Stops execution if there are stays
            }
        } catch (error) {
            console.error('Error verifying stays:', error);
            alert('An error occurred while verifying stays.');
            return;
        }

        const updatedPet = {
            name: editPetForm.querySelector('#pet-name').value,
            type: editPetForm.querySelector('#pet-type').value,
            breed: editPetForm.querySelector('#pet-breed').value,
            age: parseInt(editPetForm.querySelector('#pet-age').value),
            description: editPetForm.querySelector('#pet-description').value,
        };

        try {
            const response = await fetch(`http://localhost:5000/pets/${pet.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPet),
            });

            if (response.ok) {
                alert('Pet updated successfully.');
                navigateTo(`pet/${pet.id}`);
            } else {
                alert('Error updating the pet.');
            }
        } catch (error) {
            console.error('Error updating the pet:', error);
            alert('An error occurred. Please try again later.');
        }
    });
};

const handleDeletePet = (petId, user) => {
    const deleteBtn = document.getElementById('delete-pet-btn');
    if (!deleteBtn) return;
    
    deleteBtn.addEventListener('click', async () => {
        try {
            // Get the pet to verify the owner before deleting
            const petResponse = await fetch(`http://localhost:5000/pets/${petId}`);
            const pet = await petResponse.json();
            
            if (user.roleId !== 'worker' && pet.ownerId !== user.id) {
                alert('You do not have permission to delete this pet.');
                return;
            }

            // Check if the pet has associated stays
            const staysResponse = await fetch(`http://localhost:5000/stays?petId=${petId}`);
            const petStays = await staysResponse.json();

            if (petStays.length > 0) {
                alert('This pet cannot be deleted because it has registered stays.');
                return; // Stops execution if there are stays
            }

            if (confirm('Are you sure you want to delete this pet?')) {
                const response = await fetch(`http://localhost:5000/pets/${petId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Pet deleted successfully.');
                    navigateTo('dashboard');
                } else {
                    alert('Error deleting the pet.');
                }
            }
        } catch (error) {
            console.error('Error deleting the pet:', error);
            alert('An error occurred. Please try again later.');
        }
    });
};

const displayPets = async (user) => {
    const petContent = document.getElementById('pet-list-container');
    if (!petContent) return;
    try {
        const response = await fetch('http://localhost:5000/pets');
        const pets = await response.json();
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

const displayStays = async (user) => {
    const staysContent = document.getElementById('stays-list-container');
    if (!staysContent) return;

    try {
        const staysResponse = await fetch(`http://localhost:5000/stays?ownerId=${user.id}`);
        const stays = await staysResponse.json();

        const petsResponse = await fetch('http://localhost:5000/pets');
        const pets = await petsResponse.json();
        
        const stayListHtml = stays.map(stay => {
            const pet = pets.find(p => p.id === stay.petId);
            const petName = pet ? pet.name : 'Pet not found';
            
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

const displayAllStays = async () => {
    const staysContent = document.getElementById('stays-list-container');
    if (!staysContent) return;

    try {
        const staysResponse = await fetch('http://localhost:5000/stays');
        const stays = await staysResponse.json();

        const petsResponse = await fetch('http://localhost:5000/pets');
        const pets = await petsResponse.json();
        
        const usersResponse = await fetch('http://localhost:5000/users');
        const users = await usersResponse.json();
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const stayListHtml = stays.map(stay => {
            const pet = pets.find(p => p.id === stay.petId);
            const owner = users.find(u => u.id === stay.ownerId);
            const petName = pet ? pet.name : 'Pet not found';
            const ownerName = owner ? owner.name : 'Owner not found';
            
            // Format the total value to currency
            const formattedTotal = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            }).format(stay.totalValue);

            // Determines which buttons to show based on the stay status and user role
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

const handleStayManagement = () => {
    const staysContainer = document.getElementById('stays-list-container');
    if (!staysContainer) return;

    staysContainer.addEventListener('click', async (e) => {
        const target = e.target;
        const stayId = target.dataset.id;
        const action = target.dataset.action;

        if (target.classList.contains('btn-confirm') || target.classList.contains('btn-reject')) {
            const newStatus = target.classList.contains('btn-confirm') ? 'confirmed' : 'rejected';
            try {
                const response = await fetch(`http://localhost:5000/stays/${stayId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus }),
                });
                if (response.ok) {
                    alert(`Stay request ${newStatus === 'confirmed' ? 'confirmed' : 'rejected'} successfully.`);
                    displayAllStays();
                } else {
                    alert('Error updating the stay status.');
                }
            } catch (error) {
                console.error('Error managing the stay:', error);
                alert('An error occurred. Please try again later.');
            }
        } else if (action === 'delete') {
            if (confirm('Are you sure you want to delete this stay?')) {
                try {
                    const response = await fetch(`http://localhost:5000/stays/${stayId}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        alert('Stay deleted successfully.');
                        displayAllStays();
                    } else {
                        alert('Error deleting the stay.');
                    }
                } catch (error) {
                    console.error('Error deleting the stay:', error);
                    alert('An error occurred. Please try again later.');
                }
            }
        }
    });
};

const navigateTo = (path) => {
    window.location.hash = path;
};

// --- MAIN NAVIGATION CONTROLLER ---
const handleNavigation = () => {
    const path = window.location.hash.slice(1);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if ((path.startsWith('dashboard') || path.startsWith('add-pet') || path.startsWith('pet') || path.startsWith('request-stay')) && !currentUser) {
        navigateTo('');
        return;
    }
    if ((path === 'login' || path === 'register') && currentUser) {
        navigateTo('dashboard');
        return;
    }
    
    handleViewLogic(path, currentUser);
};

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

const displayAllUsers = async () => {
    try {
        const response = await fetch('http://localhost:5000/users');
        const users = await response.json();
        renderView(routes['users'](users));
    } catch (error) {
        console.error('Error loading users:', error);
        renderView(routes['404'](null));
    }
};

const handleEditStayRoute = async (path, currentUser) => {
    if (!currentUser || currentUser.roleId !== 'worker') {
        navigateTo('dashboard');
        return;
    }
    
    const stayId = path.split('/')[1];

    try {
        const stayResponse = await fetch(`http://localhost:5000/stays/${stayId}`);
        const stay = await stayResponse.json();
        
        const petResponse = await fetch(`http://localhost:5000/pets/${stay.petId}`);
        const pet = await petResponse.json();
        
        const ownerResponse = await fetch(`http://localhost:5000/users/${stay.ownerId}`);
        const owner = await ownerResponse.json();

        if (stay && stay.id) {
            // Add the owner's and pet's names to the stay object
            stay.petName = pet ? pet.name : 'Unknown';
            stay.ownerName = owner ? owner.name : 'Unknown';
            
            renderView(routes['edit-stay'](stay));
            handleEditStay(stay);
        } else {
            renderView(routes['404'](null));
        }
    } catch (error) {
        console.error('Error loading stay:', error);
        renderView(routes['404'](null));
    }
};


const handleEditStay = (stay) => {
    const editStayForm = document.getElementById('edit-stay-form');
    if (!editStayForm) return;

    editStayForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const description = document.getElementById('service-description').value;
        
        const updatedStay = {
            ...stay,
            startDate,
            endDate,
            description
        };

        try {
            const response = await fetch(`http://localhost:5000/stays/${stay.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedStay),
            });

            if (response.ok) {
                alert('Stay updated successfully.');
                navigateTo('dashboard');
            } else {
                alert('An error occurred while updating the stay. Please try again.');
            }
        } catch (error) {
            console.error('Error updating the stay:', error);
            alert('An error occurred. Please check the console.');
        }
    });
};

// --- APPLICATION INITIALIZATION ---
window.addEventListener('hashchange', handleNavigation);
document.addEventListener('DOMContentLoaded', handleNavigation);