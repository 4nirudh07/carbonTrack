const DashboardModule = {
    init() {
        this.selectHousehold = document.getElementById('dashboard-household');
        this.monthInput = document.getElementById('dashboard-month');
        this.btnLoad = document.getElementById('btn-load-dashboard');
        this.contentArea = document.getElementById('dashboard-content');
        
        // Set default month
        const now = new Date();
        const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        this.monthInput.value = monthStr;

        this.bindEvents();
        this.loadHouseholds();

        document.addEventListener('households-updated', () => {
            this.loadHouseholds();
        });
    },

    bindEvents() {
        this.btnLoad.addEventListener('click', () => {
            this.loadDashboardData();
        });
    },

    async loadHouseholds() {
        try {
            const households = await api.get('/households');
            ui.populateSelect('dashboard-household', households, 'id', hh => hh.householdName, 'Select Household');
        } catch (error) {
            console.error('Failed to load households for dashboard', error);
        }
    },

    async loadDashboardData() {
        const householdId = this.selectHousehold.value;
        const month = this.monthInput.value;

        if (!householdId || !month) {
            ui.showToast('Please select a household and month', 'error');
            return;
        }

        try {
            ui.showLoading('dashboard-loading');
            ui.hideEmpty('dashboard-empty');
            this.contentArea.classList.add('hidden');

            // Fetch Carbon Footprint
            let footprint = 0;
            try {
                footprint = await api.get(`/carbon/monthly/${householdId}?month=${month}`);
            } catch (err) {
                console.log("No footprint data found or error", err);
            }
            
            // Fetch Leaderboard for ranking
            let ranking = '-';
            let reduction = 'N/A';
            try {
                const leaderboard = await api.get(`/leaderboard?month=${month}`);
                const entry = leaderboard.find(e => e.householdId == householdId);
                if (entry) {
                    ranking = `#${entry.rank}`;
                    reduction = `${ui.formatNumber(entry.reductionPercentage)}%`;
                }
            } catch(err) {
                console.log("No leaderboard data", err);
            }

            // Update UI
            document.getElementById('dash-footprint').textContent = ui.formatNumber(footprint);
            
            // Update active challenges (since there's no specific API for a single household's participations in the given controller, we'll leave it as N/A or try to infer)
            document.getElementById('dash-challenges').textContent = reduction; // Display reduction percentage instead of N/A
            document.getElementById('dash-ranking').textContent = ranking;

            this.contentArea.classList.remove('hidden');

        } catch (error) {
            ui.showToast(`Failed to load dashboard: ${error.message}`, 'error');
            ui.showEmpty('dashboard-empty');
        } finally {
            ui.hideLoading('dashboard-loading');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    DashboardModule.init();
});
