import { motion, PanInfo, useAnimation } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { semanticColorThemes } from '../colors';

interface Quote {
	text: string;
	author: string;
	source?: string;
}

interface SwipeQuoteProps {
	quote: Quote | null;
	loading: boolean;
	onRefresh: () => void;
	selectedSemanticTheme: string;
	selectedQuoteFont: string;
}

export default function SwipeQuote({ 
	quote, 
	loading, 
	onRefresh, 
	selectedSemanticTheme,
	selectedQuoteFont
}: SwipeQuoteProps) {
	const controls = useAnimation();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [dragProgress, setDragProgress] = useState(0);
	const [wheelProgress, setWheelProgress] = useState(0);
	const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleDrag = (event: any, info: PanInfo) => {
		const { offset } = info;
		const progress = Math.min(Math.abs(offset.y) / 100, 1);
		setDragProgress(progress);
	};

	const handleWheel = (event: WheelEvent) => {
		// Only handle vertical scrolling down
		if (event.deltaY > 0) {
			event.preventDefault();
			
			// Accumulate wheel delta for progress tracking
			const newProgress = Math.min(wheelProgress + Math.abs(event.deltaY) / 300, 1);
			setWheelProgress(newProgress);

			// Clear existing timeout
			if (wheelTimeoutRef.current) {
				clearTimeout(wheelTimeoutRef.current);
			}

			// If we've scrolled enough, trigger refresh
			if (newProgress >= 1) {
				triggerRefresh();
			} else {
				// Reset progress after a delay if not enough scrolling
				wheelTimeoutRef.current = setTimeout(() => {
					setWheelProgress(0);
				}, 500);
			}
		}
	};

	const triggerRefresh = async () => {
		// Haptic feedback (if supported)
		if (navigator.vibrate) {
			navigator.vibrate(50);
		}
		
		// Reset progress
		setWheelProgress(0);
		setDragProgress(0);
		
		// Trigger refresh animation
		setIsRefreshing(true);
		
		// Animate quote sliding up and fading out
		await controls.start({
			y: -50,
			opacity: 0,
			scale: 0.95,
			transition: { duration: 0.3, ease: "easeInOut" }
		});
		
		// Trigger the refresh (should be instant with prefetching)
		await onRefresh();
		
		// Reset position and fade in new quote
		await controls.start({
			y: 50,
			opacity: 0,
			scale: 1,
			transition: { duration: 0 }
		});
		
		await controls.start({
			y: 0,
			opacity: 1,
			scale: 1,
			transition: { duration: 0.4, ease: "easeOut" }
		});
		
		setIsRefreshing(false);
	};

	const handleDragEnd = async (event: any, info: PanInfo) => {
		setDragProgress(0);
		const { offset, velocity } = info;
		
		// Swipe up threshold - either drag up 100px or swipe with velocity > 500
		const swipeThreshold = -100;
		const velocityThreshold = -500;
		
		if (offset.y < swipeThreshold || velocity.y < velocityThreshold) {
			await triggerRefresh();
		} else {
			// Return to original position
			await controls.start({
				y: 0,
				opacity: 1,
				scale: 1,
				transition: { duration: 0.3, ease: "easeOut" }
			});
		}
	};

	const dragConstraints = {
		top: -150,
		bottom: 50,
		left: 0,
		right: 0
	};

	// Add wheel event listener for trackpad scrolling
	useEffect(() => {
		const element = document.querySelector('.swipe-quote-container');
		if (element) {
			element.addEventListener('wheel', handleWheel, { passive: false });
			
			return () => {
				element.removeEventListener('wheel', handleWheel);
			};
		}
	}, [wheelProgress]);

	// Cleanup wheel timeout on unmount
	useEffect(() => {
		return () => {
			if (wheelTimeoutRef.current) {
				clearTimeout(wheelTimeoutRef.current);
			}
		};
	}, []);

	if (loading && !isRefreshing) {
		return (
			<motion.div 
				className="flex flex-col items-center gap-4 py-16"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<span className="loading loading-spinner loading-lg text-primary"></span>
				<span className="text-base opacity-70" style={{ fontFamily: `var(--quote-font)` }}>Loading today's inspiration...</span>
			</motion.div>
		);
	}

	if (!quote) return null;

	const totalProgress = Math.max(dragProgress, wheelProgress);

	return (
		<div className="relative w-full max-w-2xl mx-auto swipe-quote-container">
			{/* Swipe indicator */}
			<motion.div 
				className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs opacity-30 pointer-events-none"
				initial={{ opacity: 0 }}
				animate={{ opacity: totalProgress > 0 ? 0 : 0.3 }}
				transition={{ delay: 2, duration: 1 }}
			>
				Swipe up or scroll down for new quote
			</motion.div>

			{/* Progress indicator */}
			{totalProgress > 0 && (
				<motion.div 
					className="absolute -top-6 left-1/2 transform -translate-x-1/2 pointer-events-none"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<div className="flex items-center gap-2">
						<div className="w-16 h-1 bg-base-300 rounded-full overflow-hidden">
							<motion.div 
								className="h-full bg-primary rounded-full"
								initial={{ width: 0 }}
								animate={{ width: `${totalProgress * 100}%` }}
								transition={{ duration: 0.1 }}
							/>
						</div>
						<span className="text-xs opacity-70">
							{totalProgress >= 1 ? 'Release to refresh' : wheelProgress > 0 ? 'Keep scrolling' : 'Pull up'}
						</span>
					</div>
				</motion.div>
			)}

			<motion.div
				drag="y"
				dragConstraints={dragConstraints}
				dragElastic={0.2}
				onDrag={handleDrag}
				onDragEnd={handleDragEnd}
				animate={controls}
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="cursor-grab active:cursor-grabbing select-none"
				whileDrag={{ 
					scale: 0.95,
					transition: { duration: 0.1 }
				}}
			>
				<div className="flex flex-col items-center">
					<motion.blockquote
						className={`text-center font-serif leading-tight mb-8 relative ${
							selectedQuoteFont === 'monospace' 
								? 'monospace-font' 
								: 'italic'
						}`}
						style={{ fontFamily: `var(--quote-font)` }}
						whileDrag={{ 
							filter: "blur(1px)",
							transition: { duration: 0.1 }
						}}
					>
						<span className="opacity-30 text-5xl align-top select-none">"</span>
						{quote.text}
						<span className="opacity-30 text-5xl align-bottom select-none">"</span>
					</motion.blockquote>
					
					<motion.cite
						className={`block text-lg md:text-xl font-semibold mt-2 mb-1 ${semanticColorThemes[selectedSemanticTheme as keyof typeof semanticColorThemes]?.className || 'text-primary'}`}
						style={{ fontFamily: `var(--quote-font)` }}
						whileDrag={{ 
							filter: "blur(1px)",
							transition: { duration: 0.1 }
						}}
					>
						{quote.author}
					</motion.cite>
					
					{quote.source && (
						<motion.div 
							className="text-sm opacity-30 mb-2" 
							style={{ fontFamily: `var(--quote-font)` }}
							whileDrag={{ 
								filter: "blur(1px)",
								transition: { duration: 0.1 }
							}}
						>
							{quote.source}
						</motion.div>
					)}
				</div>
			</motion.div>

			{/* Refresh loading indicator */}
			{isRefreshing && (
				<motion.div
					className="absolute inset-0 flex items-center justify-center pointer-events-none"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<div className="flex flex-col items-center gap-2">
						<span className="loading loading-spinner loading-md text-primary"></span>
						<span className="text-sm opacity-70" style={{ fontFamily: `var(--quote-font)` }}>Refreshing...</span>
					</div>
				</motion.div>
			)}
		</div>
	);
} 