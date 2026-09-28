const HouseholdsModule = {
    init() {
        this.form = document.getElementById('form-household');
        this.tableBody = document.querySelector('#table-households tbody');
        this.btnRefresh = document.getElementById('btn-refresh-hh');
        
        this.bindEvents();
        this.loadHouseholds();
        
        // Listen for view load to refresh data if needed
        document.addEventListener('view-households-loaded', () => {
            this.loadHouseholds();
        });
    },

    bindEvents() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.createHousehold();
        });

        this.btnRefresh.addEventListener('click', () => {
            this.loadHouseholds();
        });
    },

    async createHousehold() {
        const nameInput = document.getElementById('hh-name');
        const locationInput = document.getElementById('hh-location');
        const btnSubmit = document.getElementById('btn-submit-hh');

        const household = {
            householdName: nameInput.value,
            location: locationInput.value
        };

        try {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Registering...';

            await api.post('/households', household);
            
            ui.showToast('Household registered successfully!', 'success');
            this.form.reset();
            this.loadHouseholds();
            
            // Dispatch event for other modules to know households updated
            document.dispatchEvent(new CustomEvent('households-updated'));
            
        } catch (error) {
            ui.showToast(`Failed to register household: ${error.message}`, 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Register';
        }
    },

    async loadHouseholds() {
        try {
            ui.showLoading('hh-loading');
            ui.hideEmpty('hh-empty');
            this.tableBody.innerHTML = '';
            
            const households = await api.get('/households');
            
            if (households.length === 0) {
                ui.showEmpty('hh-empty');
                ui.hideLoading('hh-loading');
                return;
            }

            this.renderHouseholds(households);
        } catch (error) {
            ui.showToast('Failed to load households', 'error');
            ui.showEmpty('hh-empty');
        } finally {
            ui.hideLoading('hh-loading');
        }
    },

    renderHouseholds(households) {
        this.tableBody.innerHTML = '';
        households.forEach(hh => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${hh.id}</td>
                <td>${hh.householdName}</td>
                <td>${hh.location}</td>
            `;
            this.tableBody.appendChild(tr);
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    HouseholdsModule.init();
});
