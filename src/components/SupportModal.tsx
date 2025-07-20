import React, { useState } from "react";
import { HeartIcon } from "./Icons";
import { motion } from "framer-motion";
import Buttons from "./buttons/Buttons";

type ButtonVariant = "buyMeACoffee" | "clicktailors" | "github";

interface SupportModalProps {
	className?: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({
	className = "",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isHover, setIsHover] = useState(false);
	const supportLinks = [
		{
			variant: "buyMeACoffee",
			label: "Buy Me a Coffee",
			// href: "https://www.buymeacoffee.com/tatiacodes",
			href: "https://square.link/u/9zMRTcXV",
		},
		{
			variant: "github",
			label: "View on GitHub",
			href: "https://github.com/clicktailors/dailyquill",
		},
		{
			variant: "clicktailors",
			label: "I Need a Website!",
			href: "https://clicktailors.com",
		},
	];

	const feedbackLink = "https://forms.gle/t52WcmHZYyYfkdiy8";

	const supportText = [
		"Support me by buying me a coffee, or by checking out my GitHub repository. Themes and UI for this project were built using TailwindCSS and DaisyUI.",
		"Also, if you need a website, I can help you with that!",
	];

	return (
		<>
			{/* Heart Icon Button with Smooth Expand */}
			<button
				className={`group btn btn-sm rounded-full overflow-hidden transition-all duration-300 ease-in-out w-10 hover:w-32 ${className}`}
				onClick={() => setIsOpen(true)}
				title="Support"
				onMouseEnter={() => setIsHover(true)}
				onMouseLeave={() => setIsHover(false)}
			>
				{/* Text that appears on hover - always rendered for smooth transitions */}
				<motion.span
					initial={{ x: 10, opacity: 1 }}
					animate={{ x: isHover ? 0 : 43, opacity: isHover ? 1 : 1 }}
					transition={{ duration: 0.2 }}
					className={`text-sm font-medium whitespace-nowrap flex flex-row items-center gap-2`}
				>
					{/* Heart Icon - Always Visible */}
					<HeartIcon className="text-secondary" />
					<span className={`${isHover ? "opacity-100" : "opacity-0"}`}>
						Support Me
					</span>
				</motion.span>
			</button>

			{/* DaisyUI Modal */}
			{isOpen && (
				<div className="modal modal-open">
					<div className="modal-box max-w-sm">
						{/* Header with close button */}
						<div className="flex justify-between items-center mb-4">
							<h3 className="font-bold text-lg">
								Support & Credits
							</h3>
							<button
								className="btn btn-sm btn-circle"
								onClick={() => setIsOpen(false)}
							>
								<span className="text-xl">✕</span>
							</button>
						</div>

						<div className="divider"></div>
						{/* Description text */}
						<div className="text-sm text-gray-500 text-center mb-6 flex flex-col gap-2 items-center">
							{supportText.map((text, index) => (
								<p key={index} className="text-sm text-gray-500 text-center">{text}</p>
							))}
						</div>

						<div className="divider"></div>

						<div className="flex flex-col items-center gap-4">
							{/* Map through supportLinks and render a button for each link */}
							{supportLinks.map((link) => (
								<Buttons key={link.variant} variant={link.variant as ButtonVariant} href={link.href} label={link.label} />
							))}
						</div>

						<div className="divider"></div>
						<div className="text-sm text-gray-500 text-center mb-6 flex flex-col gap-2 items-center">
							<p className="text-sm text-gray-500 text-center">
								Have feedback or suggestions?
							</p>
							<Buttons variant="feedback" href={feedbackLink} label="Submit Feedback" />
						</div>

					</div>
					{/* Modal backdrop */}
					<div
						className="modal-backdrop"
						onClick={() => setIsOpen(false)}
					></div>
				</div>
			)}
		</>
	);
};
