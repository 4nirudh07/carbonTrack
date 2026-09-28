const ActivitiesModule = {
    init() {
        this.form = document.getElementById('form-activity');
        this.selectHousehold = document.getElementById('act-household');
        
        this.cardLog = document.getElementById('card-log-activity');
        this.cardAdmin = document.getElementById('card-admin-activities');
        this.btnRefreshAct = document.getElementById('btn-refresh-act');
        this.tableBodyAct = document.querySelector('#table-activities tbody');

        this.bindEvents();
        this.loadHouseholds();
        
        // Listen for household updates
        document.addEventListener('households-updated', () => {
            this.loadHouseholds();
        });

        // Listen for view load
        document.addEventListener('view-activities-loaded', () => {
            this.loadHouseholds();
            if (window.appState && window.appState.role === 'ADMIN') {
                this.loadAllActivities();
            }
        });

        // Handle Role Switch
        document.addEventListener('role-changed', (e) => {
            const role = e.detail;
            if (role === 'ADMIN') {
                this.cardLog.style.display = 'none';
                this.cardAdmin.style.display = 'block';
                this.loadAllActivities();
            } else {
                this.cardLog.style.display = 'block';
                this.cardAdmin.style.display = 'none';
            }
        });
    },

    bindEvents() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.logActivity();
        });

        this.btnRefreshAct.addEventListener('click', () => {
            this.loadAllActivities();
        });
    },

    async loadHouseholds() {
        try {
            const households = await api.get('/households');
            ui.populateSelect('act-household', households, 'id', hh => `${hh.householdName} (${hh.location})`);
        } catch (error) {
            console.error('Failed to load households for activities form', error);
        }
    },

    async logActivity() {
        const householdId = this.selectHousehold.value;
        const btnSubmit = document.getElementById('btn-submit-act');

        const activity = {
            activityDate: document.getElementById('act-date').value,
            commuteMode: document.getElementById('act-mode').value,
            commuteDistanceKm: parseFloat(document.getElementById('act-distance').value),
            electricityUnits: parseFloat(document.getElementById('act-electricity').value),
            wasteGenerated: parseFloat(document.getElementById('act-waste').value)
        };

        try {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Logging...';

            await api.post(`/activity-logs?householdId=${householdId}`, activity);
            
            ui.showToast('Activity logged successfully!', 'success');
            this.form.reset();
            
        } catch (error) {
            ui.showToast(`Failed to log activity: ${error.message}`, 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Log Activity';
        }
    },

    async loadAllActivities() {
        try {
            ui.showLoading('act-loading');
            ui.hideEmpty('act-empty');
            this.tableBodyAct.innerHTML = '';
            
            const activities = await api.get('/activity-logs');
            
            if (activities.length === 0) {
                ui.showEmpty('act-empty');
                ui.hideLoading('act-loading');
                return;
            }

            this.renderActivities(activities);
        } catch (error) {
            ui.showToast('Failed to load activities', 'error');
            ui.showEmpty('act-empty');
        } finally {
            ui.hideLoading('act-loading');
        }
    },

    renderActivities(activities) {
        this.tableBodyAct.innerHTML = '';
        activities.forEach(act => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${act.id}</td>
                <td>${act.household ? act.household.householdName : 'Unknown'}</td>
                <td>${ui.formatDate(act.activityDate)}</td>
                <td>${act.commuteMode}</td>
                <td>${act.commuteDistanceKm} km</td>
                <td>${act.electricityUnits} units</td>
                <td>${act.wasteGenerated} kg</td>
            `;
            this.tableBodyAct.appendChild(tr);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ActivitiesModule.init();
});
