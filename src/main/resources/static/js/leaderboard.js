const LeaderboardModule = {
    init() {
        this.btnLoad = document.getElementById('btn-load-lb');
        this.monthInput = document.getElementById('lb-month');
        this.tableBody = document.querySelector('#table-leaderboard tbody');
        
        // Set default month to current
        const now = new Date();
        const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        this.monthInput.value = monthStr;

        this.bindEvents();
    },

    bindEvents() {
        this.btnLoad.addEventListener('click', () => {
            this.loadLeaderboard();
        });
    },

    async loadLeaderboard() {
        const month = this.monthInput.value;
        if (!month) {
            ui.showToast('Please select a month', 'error');
            return;
        }

        try {
            ui.showLoading('lb-loading');
            ui.hideEmpty('lb-empty');
            this.tableBody.innerHTML = '';
            
            const entries = await api.get(`/leaderboard?month=${month}`);
            
            if (entries.length === 0) {
                ui.showEmpty('lb-empty');
                document.getElementById('lb-empty').textContent = 'No leaderboard data found for this month.';
                ui.hideLoading('lb-loading');
                return;
            }

            this.renderLeaderboard(entries);
        } catch (error) {
            ui.showToast(`Failed to load leaderboard: ${error.message}`, 'error');
            ui.showEmpty('lb-empty');
            document.getElementById('lb-empty').textContent = 'Failed to load leaderboard.';
        } finally {
            ui.hideLoading('lb-loading');
        }
    },

    renderLeaderboard(entries) {
        this.tableBody.innerHTML = '';
        entries.forEach(entry => {
            const tr = document.createElement('tr');
            
            // Add a trophy icon for top 3
            let rankDisplay = entry.rank;
            if (entry.rank === 1) rankDisplay = '1st';
            else if (entry.rank === 2) rankDisplay = '2nd';
            else if (entry.rank === 3) rankDisplay = '3rd';
            else rankDisplay = entry.rank + 'th';

            tr.innerHTML = `
                <td><strong>${rankDisplay}</strong></td>
                <td>${entry.householdName}</td>
                <td>
                    <span style="color: ${entry.reductionPercentage > 0 ? 'var(--success-color)' : 'var(--error-color)'}; font-weight: 600;">
                        ${ui.formatNumber(entry.reductionPercentage)}%
                    </span>
                </td>
            `;
            this.tableBody.appendChild(tr);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    LeaderboardModule.init();
});
