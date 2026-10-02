// Registry of the quote sources a user can choose from in Settings.
export type QuoteSourceId =
	| 'zenquotes'
	| 'bible'
	| 'quran'
	| 'gita'
	| 'dhammapada'
	| 'taoteching'
	| 'stoics'
	| 'confucius'

export type QuoteSourceCategory = 'inspiration' | 'scripture' | 'philosophy'

export interface QuoteSourceInfo {
	id: QuoteSourceId
	name: string
	description: string
	category: QuoteSourceCategory
}

export const quoteSourceCategories: Record<QuoteSourceCategory, string> = {
	inspiration: 'Inspiration',
	scripture: 'Scripture & Sacred Texts',
	philosophy: 'Ancient Philosophy',
}

export const quoteSources: QuoteSourceInfo[] = [
	{ id: 'zenquotes', name: 'ZenQuotes', description: 'Inspirational quotes from famous people', category: 'inspiration' },
	{ id: 'bible', name: 'Bible', description: 'Verses from the World English Bible', category: 'scripture' },
	{ id: 'quran', name: "Qur'an", description: 'Verses in English translation', category: 'scripture' },
	{ id: 'gita', name: 'Bhagavad Gita', description: 'Hindu scripture on duty and devotion', category: 'scripture' },
	{ id: 'dhammapada', name: 'Dhammapada', description: 'Sayings of the Buddha', category: 'scripture' },
	{ id: 'taoteching', name: 'Tao Te Ching', description: 'Lao Tzu on the Way', category: 'philosophy' },
	{ id: 'stoics', name: 'Stoics', description: 'Marcus Aurelius, Seneca and Epictetus', category: 'philosophy' },
	{ id: 'confucius', name: 'Analects', description: 'Sayings of Confucius', category: 'philosophy' },
]

export const defaultEnabledSources: QuoteSourceId[] = ['zenquotes']

const knownSourceIds = new Set<string>(quoteSources.map((s) => s.id))

// Drop unknown ids (e.g. from an older or newer version) and never return an
// empty selection.
export function sanitizeSources(sources: unknown): QuoteSourceId[] {
	if (!Array.isArray(sources)) return [...defaultEnabledSources]
	const valid = sources.filter(
		(s): s is QuoteSourceId => typeof s === 'string' && knownSourceIds.has(s)
	)
	return valid.length > 0 ? Array.from(new Set(valid)) : [...defaultEnabledSources]
}
