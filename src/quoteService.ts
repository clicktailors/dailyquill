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

class QuoteService {
  private getRandomFallback(): Quote {
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length)
    return fallbackQuotes[randomIndex]
  }

  async fetchFromZenQuotes(): Promise<Quote> {
    try {
      const response = await fetch('https://zenquotes.io/api/random')
      const data = await response.json()
      
      if (data && data.length > 0) {
        return {
          text: data[0].q,
          author: data[0].a,
          source: 'ZenQuotes'
        }
      }
      throw new Error('No quote data received')
    } catch (error) {
      throw error
    }
  }

  async fetchFromQuoteGarden(): Promise<Quote> {
    try {
      // Note: QuoteGarden API might require different endpoint or API key
      // This is a placeholder for future implementation
      const response = await fetch('https://quote-garden.herokuapp.com/api/v3/quotes/random')
      const data = await response.json()
      
      if (data && data.statusCode === 200 && data.data) {
        return {
          text: data.data.quoteText.replace(/[""]/g, ''), // Remove quote marks
          author: data.data.quoteAuthor,
          source: 'Quote Garden'
        }
      }
      throw new Error('No quote data received')
    } catch (error) {
      throw error
    }
  }

  async getRandomQuote(): Promise<Quote> {
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
    return this.getRandomFallback()
  }

  async getTodaysQuote(): Promise<Quote> {
    try {
      // Try to get today's quote from ZenQuotes
      const response = await fetch('https://zenquotes.io/api/today')
      const data = await response.json()
      
      if (data && data.length > 0) {
        return {
          text: data[0].q,
          author: data[0].a,
          source: 'ZenQuotes (Today)'
        }
      }
      throw new Error('No today quote available')
    } catch (error) {
      // Fallback to random quote
      return this.getRandomQuote()
    }
  }
}

export const quoteService = new QuoteService()
