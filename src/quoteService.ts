// Quote service for fetching quotes from the user's enabled sources
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
import { zenQuotesApiBase } from './runtime'
import { sanitizeSources, type QuoteSourceId } from './sources'
import {
	bibleVerses,
	quranVerses,
	gitaVerses,
	dhammapada,
	taoTeChing,
	stoics,
	analects
} from './sources/collections'

// Books the live Bible source draws from, chosen for verses that stand on
// their own (bible-api.com book ids → display names)
const bibleBooks: Record<string, string> = {
	PSA: 'Psalms',
	PRO: 'Proverbs',
	ECC: 'Ecclesiastes',
	ISA: 'Isaiah',
	MAT: 'Matthew',
	JHN: 'John',
	ROM: 'Romans',
	'1CO': '1 Corinthians',
	GAL: 'Galatians',
	EPH: 'Ephesians',
	PHP: 'Philippians',
	COL: 'Colossians',
	HEB: 'Hebrews',
	JAS: 'James',
	'1PE': '1 Peter',
	'1JN': '1 John'
}

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
			const response = await fetch(`${zenQuotesApiBase}/random`)
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

	async fetchFromBible(): Promise<Quote> {
		try {
			if (isDev) console.log('Fetching from bible-api.com...');
			const books = Object.keys(bibleBooks).join(',')
			const response = await fetch(`https://bible-api.com/data/web/random/${books}`)
			if (!response.ok) {
				throw new Error(`Bible request failed: ${response.status} ${response.statusText}`)
			}
			const data = await response.json()
			const verse = data?.random_verse
			const text = String(verse?.text ?? '').replace(/\s+/g, ' ').trim()
			if (!text) throw new Error('No verse data received')

			const bookName = typeof verse.book === 'string' && verse.book
				? verse.book
				: bibleBooks[verse.book_id] ?? verse.book_id
			const quote = {
				text,
				author: `${bookName} ${verse.chapter}:${verse.verse}`,
				source: 'Bible · World English Bible'
			};
			if (isDev) console.log('Bible response:', quote);
			return quote;
		} catch (error) {
			if (isDev) console.warn('Bible fetch failed:', error);
			throw error
		}
	}

	private pickRandom<T>(items: T[]): T {
		return items[Math.floor(Math.random() * items.length)]
	}

	// Fetch a quote from one source. Bundled collections never fail; live
	// sources fall back to a bundled collection of the same kind when possible.
	async fetchFromSource(id: QuoteSourceId): Promise<Quote> {
		switch (id) {
			case 'zenquotes':
				return this.fetchFromZenQuotes()
			case 'bible':
				try {
					return await this.fetchFromBible()
				} catch {
					return this.pickRandom(bibleVerses)
				}
			case 'quran':
				return this.pickRandom(quranVerses)
			case 'gita':
				return this.pickRandom(gitaVerses)
			case 'dhammapada':
				return this.pickRandom(dhammapada)
			case 'taoteching':
				return this.pickRandom(taoTeChing)
			case 'stoics':
				return this.pickRandom(stoics)
			case 'confucius':
				return this.pickRandom(analects)
		}
	}

	private async getEnabledSources(): Promise<QuoteSourceId[]> {
		const settings = await storageService.getSettings()
		return sanitizeSources(settings.enabledSources)
	}

	// Try the enabled sources in random order until one succeeds
	private async fetchFromEnabledSources(sources: QuoteSourceId[]): Promise<Quote> {
		const shuffled = [...sources].sort(() => Math.random() - 0.5)
		for (const id of shuffled) {
			try {
				return await this.fetchFromSource(id)
			} catch (error) {
				continue
			}
		}

		// If all sources fail, return a random fallback quote
		if (isDev) console.log('All sources failed, using fallback quote');
		return this.getRandomFallback()
	}

	async getRandomQuote(): Promise<Quote> {
		if (isDev) console.log('Getting random quote...');
		return this.fetchFromEnabledSources(await this.getEnabledSources())
	}

	async getTodaysQuote(): Promise<Quote> {
		const sources = await this.getEnabledSources()
		// ZenQuotes offers a quote of the day; only use it when it's the sole source
		if (sources.length > 1 || sources[0] !== 'zenquotes') {
			return this.fetchFromEnabledSources(sources)
		}

		try {
			if (isDev) console.log('Getting today\'s quote...');
			// Try to get today's quote from ZenQuotes
			const response = await fetch(`${zenQuotesApiBase}/today`)
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
