// src/js/views/userViews.js

// --- User Views ---

/**
 * View to display all users (for workers).
 * @param {Array<object>} users - Array of user objects.
 * @returns {string} HTML for the list of all users.
 */
export const allUsersView = (users) => {
    const userListHtml = users.map(user => {
        let actionsHtml = '';
        // Only show the 'Convert to Worker' button for customer roles
        if (user.roleId === 'customer') {
            actionsHtml = `
                <button class="btn btn-secondary btn-change-role" data-id="${user.id}" data-role="worker">
                    Convert to Worker
                </button>
            `;
        }
        return `
            <div class="user-card">
                <h4>${user.name}</h4>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.roleId}</p>
                <div class="user-actions">
                    ${actionsHtml}
                </div>
            </div>
        `;
    }).join('');

    return `
        <section class="all-users-view">
            <h2>All Users</h2>
            <p>Here you can view all users registered in the system.</p>
            <a href="#dashboard" class="btn btn-secondary">Go Back to Dashboard</a>
            <div id="user-list-container" class="user-list-container">
                ${userListHtml || '<p>No users registered.</p>'}
            </div>
        </section>
    `;
};
