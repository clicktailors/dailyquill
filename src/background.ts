// Background service worker for Chrome extension
// This file will handle background tasks like caching quotes, setting up alarms, etc.

import { quoteService } from './quoteService'
import { storageService } from './storageService'

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
	}
})

// Background script loaded successfully
