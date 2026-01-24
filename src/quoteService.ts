// Quote service for fetching quotes from various APIs
export interface Quote {
	text: string
	author: string
	source?: string
}

// Fallback quotes in case API fails
const fallbackQuotes: Quote[] = [
	{
		text: "The only way to do great work is to love what you do.",
		author: "Steve Jobs",
		source: "Built-in"
	},
	{
		text: "Innovation distinguishes between a leader and a follower.",
		author: "Steve Jobs", 
		source: "Built-in"
	},
	{
		text: "The future belongs to those who believe in the beauty of their dreams.",
		author: "Eleanor Roosevelt",
		source: "Built-in"
	},
	{
		text: "It is during our darkest moments that we must focus to see the light.",
		author: "Aristotle",
		source: "Built-in"
	},
	{
		text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
		author: "Winston Churchill",
		source: "Built-in"
	}
]

// Development mode detection
const isDev = import.meta.env.DEV || (typeof window !== 'undefined' && window.location.hostname === 'localhost');

import { storageService } from './storageService'

class QuoteService {
	private getRandomFallback(): Quote {
		const randomIndex = Math.floor(Math.random() * fallbackQuotes.length)
		return fallbackQuotes[randomIndex]
	}

	// Check if a quote text/author looks like an API error message
	private isErrorResponse(text: string, author: string): boolean {
		const combined = `${text} ${author}`.toLowerCase()
		const errorPatterns = [
			'too many requests',
			'rate limit',
			'auth key',
			'unlimited access',
			'api error',
			'zenquotes.io'  // Author is "ZenQuotes.io" for error messages
		]
		return errorPatterns.some(pattern => combined.includes(pattern))
	}

	async fetchFromZenQuotes(): Promise<Quote> {
		try {
			if (isDev) console.log('Fetching from ZenQuotes...');
			const response = await fetch('https://zenquotes.io/api/random')
			if (!response.ok) {
				throw new Error(`ZenQuotes request failed: ${response.status} ${response.statusText}`)
			}
			const data = await response.json()
			
			if (data && data.length > 0) {
				const quoteText = String(data[0]?.q ?? '')
				const quoteAuthor = String(data[0]?.a ?? '')
				
				// ZenQuotes returns error messages as "quotes" with HTTP 200
				// Example: { q: "Too many requests. Obtain an auth key...", a: "ZenQuotes.io" }
				if (this.isErrorResponse(quoteText, quoteAuthor)) {
					throw new Error(`ZenQuotes returned error as quote: ${quoteText.substring(0, 50)}`)
				}
				
				const quote = {
					text: quoteText,
					author: quoteAuthor,
					source: 'ZenQuotes'
				};
				if (isDev) console.log('ZenQuotes response:', quote);
				return quote;
			}
			throw new Error('No quote data received')
		} catch (error) {
			if (isDev) console.warn('ZenQuotes fetch failed:', error);
			throw error
		}
	}

	async fetchFromQuoteGarden(): Promise<Quote> {
		try {
			if (isDev) console.log('Fetching from QuoteGarden...');
			// Note: QuoteGarden API might require different endpoint or API key
			// This is a placeholder for future implementation
			const response = await fetch('https://quote-garden.herokuapp.com/api/v3/quotes/random')
			if (!response.ok) {
				throw new Error(`QuoteGarden request failed: ${response.status} ${response.statusText}`)
			}
			const data = await response.json()
			
			if (data && data.statusCode === 200 && data.data) {
				const quote = {
					text: data.data.quoteText.replace(/[""]/g, ''), // Remove quote marks
					author: data.data.quoteAuthor,
					source: 'Quote Garden'
				};
				if (isDev) console.log('QuoteGarden response:', quote);
				return quote;
			}
			throw new Error('No quote data received')
		} catch (error) {
			if (isDev) console.warn('QuoteGarden fetch failed:', error);
			throw error
		}
	}

	async getRandomQuote(): Promise<Quote> {
		if (isDev) console.log('Getting random quote...');
		// Try multiple APIs in sequence
		const apis = [
			() => this.fetchFromZenQuotes(),
			() => this.fetchFromQuoteGarden()
		]

		for (const api of apis) {
			try {
				return await api()
			} catch (error) {
				continue
			}
		}

		// If all APIs fail, return a random fallback quote
		if (isDev) console.log('All APIs failed, using fallback quote');
		return this.getRandomFallback()
	}

	async getTodaysQuote(): Promise<Quote> {
		try {
			if (isDev) console.log('Getting today\'s quote...');
			// Try to get today's quote from ZenQuotes
			const response = await fetch('https://zenquotes.io/api/today')
			if (!response.ok) {
				throw new Error(`ZenQuotes today request failed: ${response.status} ${response.statusText}`)
			}
			const data = await response.json()
			
			if (data && data.length > 0) {
				const quoteText = String(data[0]?.q ?? '')
				const quoteAuthor = String(data[0]?.a ?? '')
				
				// ZenQuotes returns error messages as "quotes" with HTTP 200
				if (this.isErrorResponse(quoteText, quoteAuthor)) {
					throw new Error(`ZenQuotes today returned error as quote: ${quoteText.substring(0, 50)}`)
				}
				
				const quote = {
					text: quoteText,
					author: quoteAuthor,
					source: 'ZenQuotes (Today)'
				};
				if (isDev) console.log('Today\'s quote response:', quote);
				return quote;
			}
			throw new Error('No today quote available')
		} catch (error) {
			if (isDev) console.warn('Today\'s quote fetch failed, falling back to random:', error);
			// Fallback to random quote
			return this.getRandomQuote()
		}
	}

	async prefetchNextQuote(): Promise<void> {
		try {
			if (isDev) console.log('Prefetching next quote...');
			const nextQuote = await this.getRandomQuote();
			await storageService.cachePrefetchedQuote({ ...nextQuote, source: nextQuote.source ?? 'Unknown' });
			if (isDev) console.log('Next quote prefetched:', nextQuote);
		} catch (error) {
			if (isDev) console.warn('Prefetch failed:', error);
		}
	}
}

export const quoteService = new QuoteService()
