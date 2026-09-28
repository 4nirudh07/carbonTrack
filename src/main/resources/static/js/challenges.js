const ChallengesModule = {
    init() {
        this.form = document.getElementById('form-challenge');
        this.tableBody = document.querySelector('#table-challenges tbody');
        this.btnRefresh = document.getElementById('btn-refresh-ch');
        
        // Join Modal elements
        this.modal = document.getElementById('modal-join-challenge');
        this.formJoin = document.getElementById('form-join-challenge');
        this.btnCancelJoin = document.getElementById('btn-cancel-join');
        
        // Admin elements
        this.colCreate = document.getElementById('col-create-challenge');
        this.cardAdminPart = document.getElementById('card-admin-participations');
        this.btnRefreshPart = document.getElementById('btn-refresh-part');
        this.tableBodyPart = document.querySelector('#table-participations tbody');

        this.bindEvents();
        this.loadChallenges();
        
        document.addEventListener('view-challenges-loaded', () => {
            this.loadChallenges();
            if (window.appState && window.appState.role === 'ADMIN') {
                this.loadParticipations();
            }
        });

        document.addEventListener('role-changed', (e) => {
            const role = e.detail;
            if (role === 'ADMIN') {
                this.colCreate.style.display = 'block';
                this.cardAdminPart.style.display = 'block';
                this.loadParticipations();
            } else {
                this.colCreate.style.display = 'none';
                this.cardAdminPart.style.display = 'none';
            }
        });
    },

    bindEvents() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.createChallenge();
        });

        this.btnRefresh.addEventListener('click', () => {
            this.loadChallenges();
        });

        this.btnCancelJoin.addEventListener('click', () => {
            this.closeJoinModal();
        });

        this.formJoin.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.joinChallenge();
        });

        this.btnRefreshPart.addEventListener('click', () => {
            this.loadParticipations();
        });
    },

    async createChallenge() {
        const btnSubmit = document.getElementById('btn-submit-ch');

        const challenge = {
            challengeName: document.getElementById('ch-name').value,
            targetReductionPercentage: parseFloat(document.getElementById('ch-target').value),
            startDate: document.getElementById('ch-start').value,
            endDate: document.getElementById('ch-end').value
        };

        try {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Creating...';

            await api.post('/challenges', challenge);
            
            ui.showToast('Challenge created successfully!', 'success');
            this.form.reset();
            this.loadChallenges();
            
        } catch (error) {
            ui.showToast(`Failed to create challenge: ${error.message}`, 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Create Challenge';
        }
    },

    async loadChallenges() {
        try {
            ui.showLoading('ch-loading');
            ui.hideEmpty('ch-empty');
            this.tableBody.innerHTML = '';
            
            const challenges = await api.get('/challenges');
            
            if (challenges.length === 0) {
                ui.showEmpty('ch-empty');
                ui.hideLoading('ch-loading');
                return;
            }

            this.renderChallenges(challenges);
        } catch (error) {
            ui.showToast('Failed to load challenges', 'error');
            ui.showEmpty('ch-empty');
        } finally {
            ui.hideLoading('ch-loading');
        }
    },

    renderChallenges(challenges) {
        this.tableBody.innerHTML = '';
        challenges.forEach(ch => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${ch.challengeName}</strong></td>
                <td>${ch.targetReductionPercentage}%</td>
                <td>${ui.formatDate(ch.startDate)} - ${ui.formatDate(ch.endDate)}</td>
                <td>
                    <button class="btn btn-primary btn-sm btn-join" 
                        data-id="${ch.id}" 
                        data-name="${ch.challengeName}">Join</button>
                </td>
            `;
            this.tableBody.appendChild(tr);
        });

        // Add event listeners to join buttons
        document.querySelectorAll('.btn-join').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const name = e.target.dataset.name;
                this.openJoinModal(id, name);
            });
        });
    },

    async openJoinModal(challengeId, challengeName) {
        document.getElementById('join-ch-id').value = challengeId;
        document.getElementById('join-ch-name').textContent = `Joining: ${challengeName}`;
        
        // Load households for select
        try {
            const households = await api.get('/households');
            ui.populateSelect('join-hh-id', households, 'id', hh => `${hh.householdName} (${hh.location})`);
        } catch (error) {
            ui.showToast('Failed to load households', 'error');
            return;
        }

        this.modal.classList.remove('hidden');
    },

    closeJoinModal() {
        this.modal.classList.add('hidden');
        this.formJoin.reset();
    },

    async joinChallenge() {
        const householdId = document.getElementById('join-hh-id').value;
        const challengeId = document.getElementById('join-ch-id').value;
        const month = document.getElementById('join-month').value;
        const btnSubmit = document.getElementById('btn-confirm-join');

        try {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Joining...';

            // Participation endpoint expects POST /participations?householdId=1&challengeId=1&month=2023-10
            await api.postForm(`/participations?householdId=${householdId}&challengeId=${challengeId}&month=${month}`);
            
            ui.showToast('Successfully joined the challenge!', 'success');
            this.closeJoinModal();
            
        } catch (error) {
            ui.showToast(`Failed to join challenge: ${error.message}`, 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Join Challenge';
        }
    },

    async loadParticipations() {
        try {
            ui.showLoading('part-loading');
            ui.hideEmpty('part-empty');
            this.tableBodyPart.innerHTML = '';
            
            const parts = await api.get('/participations');
            
            if (parts.length === 0) {
                ui.showEmpty('part-empty');
                ui.hideLoading('part-loading');
                return;
            }

            this.renderParticipations(parts);
        } catch (error) {
            ui.showToast('Failed to load participations', 'error');
            ui.showEmpty('part-empty');
        } finally {
            ui.hideLoading('part-loading');
        }
    },

    renderParticipations(parts) {
        this.tableBodyPart.innerHTML = '';
        parts.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.household ? p.household.householdName : 'Unknown'}</td>
                <td>${p.challenge ? p.challenge.challengeName : 'Unknown'}</td>
                <td>${ui.formatNumber(p.baselineFootprint)} kg</td>
                <td>${ui.formatNumber(p.currentFootprint)} kg</td>
                <td>
                    <span style="color: ${p.reductionPercentage > 0 ? 'var(--success-color)' : 'var(--error-color)'}; font-weight: 600;">
                        ${ui.formatNumber(p.reductionPercentage)}%
                    </span>
                </td>
            `;
            this.tableBodyPart.appendChild(tr);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ChallengesModule.init();
});
