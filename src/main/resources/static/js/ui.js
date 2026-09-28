const ui = {
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Remove after animation completes (3s)
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    },

    showLoading(elementId) {
        document.getElementById(elementId).classList.remove('hidden');
    },

    hideLoading(elementId) {
        document.getElementById(elementId).classList.add('hidden');
    },

    showEmpty(elementId) {
        document.getElementById(elementId).classList.remove('hidden');
    },

    hideEmpty(elementId) {
        document.getElementById(elementId).classList.add('hidden');
    },

    populateSelect(selectId, data, valueKey, textKey, defaultText = 'Select an option') {
        const select = document.getElementById(selectId);
        if (!select) return;

        select.innerHTML = `<option value="">${defaultText}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueKey];
            option.textContent = typeof textKey === 'function' ? textKey(item) : item[textKey];
            select.appendChild(option);
        });
    },

    formatNumber(num) {
        if (num === null || num === undefined) return '0.0';
        return Number(num).toFixed(1);
    },
    
    formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
};
