// MetaSearch Popup Logic
const CONFIG = {
    API_BASE: 'http://localhost:3000', // Default - user can change in settings
    CACHE_DURATION: 3600, // 1 hour
    MAX_RESULTS: 8
};

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const settingsBtn = document.getElementById('settingsBtn');
const historyBtn = document.getElementById('historyBtn');
const clearBtn = document.getElementById('clearBtn');

let searchTimeout;
let currentQuery = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    checkAPIStatus();
    setupEventListeners();
});

function setupEventListeners() {
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        currentQuery = e.target.value.trim();
        
        if (currentQuery.length > 1) {
            showLoading();
            searchTimeout = setTimeout(() => performSearch(), 300);
        } else {
            resultsContainer.innerHTML = '<div class="empty-state">Start typing to search...</div>';
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            performSearch();
        }
    });

    settingsBtn.addEventListener('click', openSettings);
    historyBtn.addEventListener('click', openHistory);
    clearBtn.addEventListener('click', clearAllData);
}

// Load settings from Chrome storage
async function loadSettings() {
    const settings = await chrome.storage.sync.get('userSettings');
    if (settings.userSettings && settings.userSettings.apiUrl) {
        CONFIG.API_BASE = settings.userSettings.apiUrl;
    }
}

// Search function
async function performSearch() {
    if (!currentQuery) return;

    try {
        const cached = await getCachedResult(currentQuery);
        if (cached) {
            displayResults(cached.results, true);
            return;
        }

        showLoading();

        const response = await fetch(`${CONFIG.API_BASE}/api/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: currentQuery,
                timestamp: new Date().toISOString(),
                userId: await getUserId()
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        await cacheResult(currentQuery, data.results);
        await saveSearchToHistory(currentQuery);
        displayResults(data.results);
        setAPIStatus(true);

    } catch (error) {
        console.error('Search error:', error);
        displayError(`Search failed: ${error.message}`);
        setAPIStatus(false);
    }
}

function displayResults(results, isCached = false) {
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = '<div class="empty-state">No results found</div>';
        return;
    }

    const limited = results.slice(0, CONFIG.MAX_RESULTS);
    const html = limited.map(result => `
        <div class="result-item" data-url="${result.url || '#'}">
            <div class="result-title">${escapeHtml(result.title)}</div>
            <div class="result-snippet">${escapeHtml(result.snippet || '')}</div>
        </div>
    `).join('');

    resultsContainer.innerHTML = html;

    document.querySelectorAll('.result-item').forEach(item => {
        item.addEventListener('click', () => {
            const url = item.dataset.url;
            if (url && url !== '#') {
                chrome.tabs.create({ url });
            }
        });
    });
}

function displayError(message) {
    resultsContainer.innerHTML = `<div class="empty-state" style="color: #ef4444;">${escapeHtml(message)}</div>`;
}

function showLoading() {
    resultsContainer.innerHTML = '<div class="loading"><div class="spinner"></div> Searching...</div>';
}

// Cache functions
async function cacheResult(query, results) {
    const cache = await chrome.storage.local.get('searchCache') || {};
    const cacheData = cache.searchCache || {};
    cacheData[query] = { results, timestamp: Date.now() };
    await chrome.storage.local.set({ searchCache: cacheData });
}

async function getCachedResult(query) {
    const cache = await chrome.storage.local.get('searchCache') || {};
    const cacheData = cache.searchCache || {};
    
    if (cacheData[query]) {
        const cached = cacheData[query];
        const age = (Date.now() - cached.timestamp) / 1000;
        if (age < CONFIG.CACHE_DURATION) {
            return cached;
        }
    }
    return null;
}

// History functions
async function saveSearchToHistory(query) {
    const history = await chrome.storage.local.get('searchHistory') || {};
    let searches = history.searchHistory || [];
    searches = [query, ...searches.filter(s => s !== query)].slice(0, 50);
    await chrome.storage.local.set({ searchHistory: searches });
    
    // Save cookie
    await chrome.cookies.set({
        url: 'http://localhost',
        name: 'last_search_query',
        value: query,
        expirationDate: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
    });
}

async function openHistory() {
    const history = await chrome.storage.local.get('searchHistory');
    const searches = history.searchHistory || [];
    
    if (searches.length === 0) {
        resultsContainer.innerHTML = '<div class="empty-state">No search history</div>';
        return;
    }

    const html = searches.map(q => `
        <div class="result-item" style="cursor: pointer;" onclick="
            document.getElementById('searchInput').value='${escapeHtml(q)}';
            document.getElementById('searchInput').dispatchEvent(new Event('input'));
        ">
            <div class="result-title">🕐 ${escapeHtml(q)}</div>
        </div>
    `).join('');

    resultsContainer.innerHTML = html;
}

async function clearAllData() {
    if (confirm('Clear all data (history, cache, cookies)?')) {
        await chrome.storage.local.set({ searchHistory: [], searchCache: {} });
        await chrome.cookies.remove({ url: 'http://localhost', name: 'last_search_query' });
        resultsContainer.innerHTML = '<div class="empty-state">All data cleared</div>';
    }
}

// Settings
function openSettings() {
    chrome.runtime.openOptionsPage();
}

// User ID
async function getUserId() {
    const data = await chrome.storage.local.get('userId');
    if (!data.userId) {
        const id = generateUUID();
        await chrome.storage.local.set({ userId: id });
        return id;
    }
    return data.userId;
}

// API status
async function checkAPIStatus() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/health`);
        setAPIStatus(response.ok);
    } catch {
        setAPIStatus(false);
    }
}

function setAPIStatus(online) {
    statusDot.className = online ? 'status-dot' : 'status-dot offline';
    statusText.textContent = online ? 'Connected' : 'Offline';
}

// Utilities
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Periodic checks
setInterval(checkAPIStatus, 30000);
