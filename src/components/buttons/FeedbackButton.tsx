import React from "react";

interface FeedbackButtonProps {
	href?: string;
	className?: string;
	label?: string;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
	href = "https://forms.gle/9zMRTcXV",
	className = "",
	label = "Submit Feedback",
}) => {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={`btn btn-sm gap-2 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg ${className}`}
			title="Feedback"
		>
			{label}
		</a>
	);
};
