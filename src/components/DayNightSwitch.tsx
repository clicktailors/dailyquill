import { SunIcon, MoonIcon, SystemIcon } from './Icons';

interface ThemeModeSwitchProps {
	selectedThemeMode: 'system' | 'light' | 'dark';
	onThemeModeChange: () => void;
}

export default function DayNightSwitch({ selectedThemeMode, onThemeModeChange }: ThemeModeSwitchProps) {
	const getIcon = () => {
		switch (selectedThemeMode) {
			case 'light':
				return <SunIcon />;
			case 'dark':
				return <MoonIcon />;
			case 'system':
				return <SystemIcon />;
			default:
				return null;
		}
	};

	const getTooltip = () => {
		switch (selectedThemeMode) {
			case 'light':
				return 'Switch to Dark Mode';
			case 'dark':
				return 'Switch to System Mode';
			case 'system':
				return 'Switch to Light Mode';
			default:
				return '';
		}
	};

	return (
		<button 
			className="btn btn-ghost btn-circle transition-all duration-200 hover:bg-base-300"
			onClick={onThemeModeChange}
			title={getTooltip()}
			aria-label={getTooltip()}
		>
			{getIcon()}
		</button>
	);
}
