export default function ThemeSwitch({
	themes,
	selectedTheme,
	onThemeChange,
}: {
	themes: string[];
	selectedTheme: string;
	onThemeChange: (theme: string) => void;
}) {
	const handleThemeChange = (theme: string) => {
		onThemeChange(theme);
	};

	return (
			<div className="join join-vertical">
				{themes.map((theme) => (
					<input
						key={theme}
						type="radio"
						name="theme-buttons"
						className="theme-controller join-item"
						aria-label={theme}
						value={theme}
						checked={selectedTheme === theme}
						onChange={(e) => handleThemeChange(e.target.value)}
					/>
				))}
			</div>
	);
}
