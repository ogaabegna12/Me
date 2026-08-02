// Background Service Worker
console.log('MetaSearch background worker loaded');

// Auto-cleanup old cache weekly
chrome.alarms.create('clearOldCache', { periodInMinutes: 7 * 24 * 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'clearOldCache') {
        clearOldCache();
    }
});

async function clearOldCache() {
    const cache = await chrome.storage.local.get('searchCache') || {};
    const cacheData = cache.searchCache || {};
    const now = Date.now();
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

    Object.keys(cacheData).forEach(key => {
        if (now - cacheData[key].timestamp > ONE_WEEK) {
            delete cacheData[key];
        }
    });

    await chrome.storage.local.set({ searchCache: cacheData });
    console.log('Cache cleanup completed');
}
