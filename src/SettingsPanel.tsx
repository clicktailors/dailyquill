import React, { useEffect, useState } from 'react'
import { colorThemes, baseHueMap, quoteFonts, uiFonts } from './colors'

interface ColorTheme {
	name: string
	light: {
		primary: string
		secondary: string
	}
	dark: {
		primary: string
		secondary: string
	}
}

interface SettingsPanelProps {
	isOpen: boolean
	onClose: () => void
	selectedTheme: string
	onThemeChange: (theme: string) => void
	selectedSaturation: number
	onSaturationChange: (saturation: number) => void
	selectedLightness: number
	onLightnessChange: (lightness: number) => void
	dynamicPrimary: string
	id?: string
	selectedThemeMode: 'system' | 'light' | 'dark'
	onThemeModeChange: () => void
	lightnessMin: number
	lightnessMax: number
	saturationMin: number
	saturationMax: number
	selectedQuoteFont: string
	onQuoteFontChange: (font: string) => void
	selectedUIFont: string
	onUIFontChange: (font: string) => void
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
	isOpen,
	onClose,
	selectedTheme,
	onThemeChange,
	selectedSaturation,
	onSaturationChange,
	selectedLightness,
	onLightnessChange,
	dynamicPrimary,
	id,
	selectedThemeMode,
	onThemeModeChange,
	lightnessMin,
	lightnessMax,
	saturationMin,
	saturationMax,
	selectedQuoteFont,
	onQuoteFontChange,
	selectedUIFont,
	onUIFontChange
}) => {
	// Focus management
	React.useEffect(() => {
		if (isOpen) {
			const closeBtn = document.querySelector('.settings-panel .close-btn') as HTMLButtonElement
			if (closeBtn) {
				closeBtn.focus()
			}
		}
	}, [isOpen])

	React.useEffect(() => {
		if (!isOpen) return
		const panel = document.querySelector('.settings-panel') as HTMLElement
		const focusableElements = panel?.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		) as NodeListOf<HTMLElement>
		if (!focusableElements.length) return
		const firstElement = focusableElements[0]
		const lastElement = focusableElements[focusableElements.length - 1]
		const handleTabKey = (e: KeyboardEvent) => {
			if (e.key === 'Tab') {
				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault()
						lastElement.focus()
					}
				} else {
					if (document.activeElement === lastElement) {
						e.preventDefault()
						firstElement.focus()
					}
				}
			}
		}
		document.addEventListener('keydown', handleTabKey)
		return () => document.removeEventListener('keydown', handleTabKey)
	}, [isOpen])

	const [shouldBeOpen, setShouldBeOpen] = useState(false);
	useEffect(() => {
		if (isOpen) {
			requestAnimationFrame(() => setShouldBeOpen(true));
		} else {
			setShouldBeOpen(false);
		}
	}, [isOpen]);

	return (
		<div 
			id={id}
			className={`settings-panel fixed top-0 left-0 h-full max-w-[400px] w-full z-[1000] bg-base-200 shadow-2xl transition-all duration-300 ease-in-out ${shouldBeOpen ? 'open left-0' : '-left-[400px]'}`}
			role="dialog"
			aria-modal="true"
			aria-labelledby="settings-title"
			aria-describedby="settings-description"
		>
			<div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-100 rounded-t-xl">
				<h3 id="settings-title" className="text-2xl font-bold">Settings</h3>
				<button 
					className="close-btn btn btn-ghost btn-circle"
					onClick={onClose}
					aria-label="Close settings"
				>
					✕
				</button>
			</div>
			<div className="settings-content p-6 flex flex-col gap-8 overflow-y-auto" id="settings-description">
				<div className="form-control gap-2">
					<label className="label text-lg font-semibold">Theme Mode</label>
					<div className="flex gap-2">
						<button
							className={`btn btn-sm ${selectedThemeMode === 'system' ? 'btn-primary' : 'btn-outline'}`}
							onClick={onThemeModeChange}
						>
							{selectedThemeMode.charAt(0).toUpperCase() + selectedThemeMode.slice(1)}
						</button>
					</div>
				</div>
				<div className="divider my-0" />
				<div className="form-control gap-2">
					<label className="label text-lg font-semibold">Fonts</label>
					<div className="flex gap-2 flex-wrap">
						{Object.entries(quoteFonts).map(([key, font]) => (
							<button
								key={key}
								className={`btn btn-sm ${selectedQuoteFont === key ? 'btn-primary' : 'btn-outline'}`}
								onClick={() => onQuoteFontChange(key)}
								style={{ fontFamily: font.family }}
							>
								{font.name}
							</button>
						))}
					</div>
				</div>
				<div className="divider my-0" />
				<div className="form-control gap-2">
					<label className="label text-lg font-semibold">Color Theme</label>
					<div className="flex gap-2 flex-wrap w-full">
						{Object.entries(colorThemes).map(([key, theme]) => {
							const previewHue = baseHueMap[key];
							const previewPrimary = key === selectedTheme
								? dynamicPrimary
								: `hsl(${previewHue}, ${selectedSaturation}%, ${selectedLightness}%)`;
							const isActive = selectedTheme === key;
							return (
								<button
									key={key}
									className={`btn btn-xs flex flex-col justify-center items-center gap-2 min-w-[80px] min-h-[56px] ${isActive ? 'btn-primary shadow-lg' : 'btn-outline'}`}
									onClick={() => onThemeChange(key)}
								>
									<div 
										className="w-10 h-6 rounded border border-base-300 mb-1"
										style={{
											background: `linear-gradient(135deg, ${theme.light.primary} 0 50%, ${theme.dark.primary} 50% 100%)`,
										}}
									/>
									<span className="text-xs font-medium leading-tight mt-0.5">{theme.name}</span>
								</button>
							);
						})}
					</div>
				</div>
				<div className="form-control gap-2">
					<label htmlFor="saturation-slider" className="label text-lg font-semibold">
						Saturation: <span className="font-mono">{selectedSaturation}%</span>
					</label>
					<input
						type="range"
						id="saturation-slider"
						min={saturationMin}
						max={saturationMax}
						value={selectedSaturation}
						onChange={(e) => onSaturationChange(Number(e.target.value))}
						className="range range-primary"
						aria-label="Saturation"
					/>
				</div>
				<div className="form-control gap-2">
					<label htmlFor="lightness-slider" className="label text-lg font-semibold">
						Lightness: <span className="font-mono">{selectedLightness}%</span>
					</label>
					<input
						type="range"
						id="lightness-slider"
						min={lightnessMin}
						max={lightnessMax}
						value={selectedLightness}
						onChange={(e) => onLightnessChange(Number(e.target.value))}
						className="range range-primary"
						aria-label="Lightness"
					/>
				</div>
			</div>
		</div>
	)
} 