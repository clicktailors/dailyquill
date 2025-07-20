import React from 'react';
import { GitHubMarkIcon } from '../Icons';

interface GithubButtonProps {
	href?: string;
	className?: string;
	label?: string;
}

export const GithubButton: React.FC<GithubButtonProps> = ({ 
	href = "https://github.com/clicktailors/dailyquill",
	className = "",
	label = "View on GitHub"
}) => {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={`btn btn-sm gap-2 bg-gray-800 text-white border-gray-800 hover:bg-gray-700 hover:border-gray-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg ${className}`}
			title="View on GitHub"
		>
			{/* Official GitHub mark icon */}
			<GitHubMarkIcon className="flex-shrink-0 w-4 h-4" />
			{label}
		</a>
	);
};
