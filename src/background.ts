// Background service worker for Chrome extension
// This file will handle background tasks like caching quotes, setting up alarms, etc.

import { quoteService } from './quoteService'
import { storageService } from './storageService'

let enabled = true;

// On startup, set the icon and tooltip to match the current state
chrome.storage.local.get(['dqEnabled'], (result) => {
	enabled = result.dqEnabled !== false; // default to true
	const iconPath = enabled
		? {
			"16": "icons/icon16.png",
			"32": "icons/icon32.png",
			"48": "icons/icon48.png",
			"128": "icons/icon128.png"
		}
		: {
			"16": "icons/icon16_gray.png",
			"32": "icons/icon32_gray.png",
			"48": "icons/icon48_gray.png",
			"128": "icons/icon128_gray.png"
		};
	chrome.action.setIcon({ path: iconPath });
	chrome.action.setTitle({
		title: enabled ? "Click to hide quote" : "Click to show quote"
	});
});

chrome.action.onClicked.addListener(async () => {
	enabled = !enabled;
	const iconPath = enabled
		? {
			"16": "icons/icon16.png",
			"32": "icons/icon32.png",
			"48": "icons/icon48.png",
			"128": "icons/icon128.png"
		}
		: {
			"16": "icons/icon16_gray.png",
			"32": "icons/icon32_gray.png",
			"48": "icons/icon48_gray.png",
			"128": "icons/icon128_gray.png"
		};
	chrome.action.setIcon({ path: iconPath });
	chrome.action.setTitle({
		title: enabled ? "Click to hide quote" : "Click to show quote"
	});
	chrome.storage.local.set({ dqEnabled: enabled });
});

chrome.runtime.onInstalled.addListener(async () => {
	// Set up daily alarm for quote updates
	chrome.alarms.create('dailyQuote', {
		delayInMinutes: 0,
		periodInMinutes: 24 * 60 // 24 hours
	})

	// Fetch and cache initial quote on install
	const quote = await quoteService.getTodaysQuote()
	await storageService.cacheQuote({
		text: quote.text,
		author: quote.author,
		source: quote.source || 'Unknown'
	})
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
	if (alarm.name === 'dailyQuote') {
		const quote = await quoteService.getTodaysQuote()
		await storageService.cacheQuote({
			text: quote.text,
			author: quote.author,
			source: quote.source || 'Unknown'
		})
		
		// Also prefetch the next quote for instant refresh
		await quoteService.prefetchNextQuote()
	}
})

// Background script loaded successfully
