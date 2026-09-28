document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    const pageTitle = document.getElementById('page-title');
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    function switchView(viewId) {
        // Update navigation active state
        navItems.forEach(item => {
            if (item.dataset.view === viewId) {
                item.classList.add('active');
                pageTitle.textContent = item.textContent;
            } else {
                item.classList.remove('active');
            }
        });

        // Show selected view
        views.forEach(view => {
            if (view.id === `view-${viewId}`) {
                view.classList.add('active');
                view.classList.remove('hidden');
            } else {
                view.classList.remove('active');
                view.classList.add('hidden');
            }
        });
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }

        // Trigger view-specific initialization if needed
        const event = new CustomEvent(`view-${viewId}-loaded`);
        document.dispatchEvent(event);
    }

    // Add click listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            switchView(item.dataset.view);
        });
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Role Switcher Logic
    const roleSelect = document.getElementById('current-role');
    
    // Store current role globally
    window.appState = {
        role: roleSelect.value
    };

    roleSelect.addEventListener('change', (e) => {
        window.appState.role = e.target.value;
        const event = new CustomEvent('role-changed', { detail: window.appState.role });
        document.dispatchEvent(event);
        ui.showToast(`Role switched to ${e.target.value}`, 'info');
    });

    // Initial load
    switchView('dashboard');
    document.dispatchEvent(new CustomEvent('role-changed', { detail: window.appState.role }));
});
