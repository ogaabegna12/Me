// Settings Page Script
const DEFAULT_SETTINGS = {
    apiUrl: 'http://localhost:3000',
    resultsPerPage: 8,
    cacheTime: 1,
    enableCookies: true,
    enableHistory: true
};

const apiUrlInput = document.getElementById('apiUrl');
const resultsPerPageSelect = document.getElementById('resultsPerPage');
const cacheTimeInput = document.getElementById('cacheTime');
const enableCookiesCheckbox = document.getElementById('enableCookies');
const enableHistoryCheckbox = document.getElementById('enableHistory');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const clearCacheBtn = document.getElementById('clearCacheBtn');
const statusMessage = document.getElementById('statusMessage');

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupEventListeners();
});

function setupEventListeners() {
    saveBtn.addEventListener('click', saveSettings);
    resetBtn.addEventListener('click', resetSettings);
    clearCacheBtn.addEventListener('click', clearCache);
}

async function loadSettings() {
    const result = await chrome.storage.sync.get('userSettings');
    const settings = result.userSettings || DEFAULT_SETTINGS;

    apiUrlInput.value = settings.apiUrl;
    resultsPerPageSelect.value = settings.resultsPerPage;
    cacheTimeInput.value = settings.cacheTime;
    enableCookiesCheckbox.checked = settings.enableCookies;
    enableHistoryCheckbox.checked = settings.enableHistory;
}

async function saveSettings() {
    const settings = {
        apiUrl: apiUrlInput.value.trim(),
        resultsPerPage: parseInt(resultsPerPageSelect.value),
        cacheTime: parseInt(cacheTimeInput.value),
        enableCookies: enableCookiesCheckbox.checked,
        enableHistory: enableHistoryCheckbox.checked
    };

    if (!settings.apiUrl) {
        showStatus('API URL cannot be empty', 'error');
        return;
    }

    try {
        new URL(settings.apiUrl);
    } catch (e) {
        showStatus('Invalid API URL format', 'error');
        return;
    }

    await chrome.storage.sync.set({ userSettings: settings });
    await chrome.storage.local.set({ userSettings: settings });
    showStatus('✓ Settings saved successfully!', 'success');
}

async function resetSettings() {
    if (confirm('Reset all settings to default?')) {
        await chrome.storage.sync.set({ userSettings: DEFAULT_SETTINGS });
        await chrome.storage.local.set({ userSettings: DEFAULT_SETTINGS });
        await loadSettings();
        showStatus('Settings reset to default', 'success');
    }
}

async function clearCache() {
    if (confirm('Clear all cached search results?')) {
        await chrome.storage.local.set({ searchCache: {} });
        showStatus('✓ Cache cleared successfully!', 'success');
    }
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    setTimeout(() => {
        statusMessage.className = 'status-message';
    }, 3000);
}
