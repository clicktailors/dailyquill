import React from 'react';

interface ClickTailorsLinkProps {
	className?: string;
}

export const ClickTailorsLink: React.FC<ClickTailorsLinkProps> = ({ 
	className = "" 
}) => {
	return (
		<div className={`text-sm opacity-70 ${className}`}>
			Built with ❤️ by{" "}
			<a
				href="https://clicktailors.com"
				target="_blank"
				rel="noopener noreferrer"
				className="link link-content link-hover font-medium"
			>
				ClickTailors
			</a>
		</div>
	);
};
