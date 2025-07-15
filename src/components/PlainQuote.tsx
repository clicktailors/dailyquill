import { semanticColorThemes } from "../colors";
import { Quote } from "../quoteService";

interface PlainQuoteProps {
	quote: Quote | null;
	loading: boolean;
	selectedSemanticTheme: string;
	selectedQuoteFont: string;
}

export default function PlainQuote({ quote, loading, selectedSemanticTheme, selectedQuoteFont }: PlainQuoteProps) {
	return (
		<div className="w-full max-w-2xl mx-auto">
			<div className="flex flex-col items-center">
				{loading ? (
					<div className="flex flex-col items-center gap-4 py-16">
						<span className="loading loading-spinner loading-lg text-primary"></span>
						<span className="text-base opacity-70" style={{ fontFamily: `var(--quote-font)` }}>Loading today's inspiration...</span>
					</div>
				) : quote ? (
					<>
						<blockquote
							className={`text-center font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-8 relative ${
								selectedQuoteFont === 'monospace' 
									? 'text-2xl md:text-3xl lg:text-4xl' 
									: 'italic'
							}`}
							style={{ fontFamily: `var(--quote-font)` }}
						>
							<span className="opacity-30 text-5xl align-top mr-1 select-none">"</span>
							{quote.text}
							<span className="opacity-30 text-5xl align-bottom ml-1 select-none">"</span>
						</blockquote>
						<cite
							className={`block text-lg md:text-xl font-semibold mt-2 mb-1 ${
								semanticColorThemes[selectedSemanticTheme as keyof typeof semanticColorThemes]?.className || 'text-primary'
							}`}
							style={{ fontFamily: `var(--quote-font)` }}
						>
							{quote.author}
						</cite>
						{quote.source && (
							<div className="text-sm opacity-30 mb-2" style={{ fontFamily: `var(--quote-font)` }}>
								{quote.source}
							</div>
						)}
					</>
				) : null}
			</div>
		</div>
	);
}