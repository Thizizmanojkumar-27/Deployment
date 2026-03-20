document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const loginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');
    const tableBody = document.getElementById('contactTableBody');
    const emptyState = document.getElementById('emptyState');

    const API_BASE = 'http://localhost:8080/api';

    // Check if user is already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
        showDashboard();
    }

    // Login Form Submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
        loginError.style.display = 'none';

        try {
            const response = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('adminToken', data.token);
                showDashboard();
            } else {
                loginError.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            loginError.textContent = 'Server connection failed.';
            loginError.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        loginSection.style.display = 'flex';
        dashboardSection.style.display = 'none';
        loginForm.reset();
    });

    // Show Dashboard & Fetch Data
    async function showDashboard() {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        
        await fetchContacts();
    }

    // Fetch and render Contact Submissions
    async function fetchContacts() {
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE}/contact/messages`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                // Token invalid or expired
                logoutBtn.click();
                return;
            }

            if (!response.ok) throw new Error('Failed to load data');

            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            emptyState.textContent = 'Error loading inquiries from server.';
            emptyState.style.display = 'block';
        }
    }

    // Render data into table
    function renderTable(contacts) {
        tableBody.innerHTML = '';

        if (!contacts || contacts.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        contacts.forEach(contact => {
            const tr = document.createElement('tr');
            
            // Simple sanitization
            const escapeHTML = (str) => {
                const div = document.createElement('div');
                div.textContent = str;
                return div.innerHTML;
            };

            tr.innerHTML = `
                <td>${escapeHTML(contact.id || '')}</td>
                <td><strong>${escapeHTML(contact.name || '')}</strong></td>
                <td><a href="mailto:${escapeHTML(contact.email || '')}">${escapeHTML(contact.email || '')}</a></td>
                <td>${escapeHTML(contact.phone || '')}</td>
                <td>${escapeHTML(contact.projectDescription || '')}</td>
            `;
            tableBody.appendChild(tr);
        });
    }
});
