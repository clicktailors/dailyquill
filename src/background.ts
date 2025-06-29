// Background service worker for Chrome extension
// This file will handle background tasks like caching quotes, setting up alarms, etc.

chrome.runtime.onInstalled.addListener(() => {
  // Set up daily alarm for quote updates
  chrome.alarms.create('dailyQuote', {
    delayInMinutes: 0,
    periodInMinutes: 24 * 60 // 24 hours
  })
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyQuote') {
    // Future: Could implement background quote fetching and caching here
  }
})

// Handle extension icon click
chrome.action.onClicked.addListener((_tab) => {
  // The popup will handle the UI, this is just for potential future features
})

export {}
