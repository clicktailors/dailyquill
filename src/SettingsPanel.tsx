import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	colorThemes,
	baseHueMap,
	quoteFonts,
	uiFonts,
	semanticColorThemes,
	daisyThemeCategories,
} from "./colors";
import DayNightSwitch from "./components/DayNightSwitch";

interface SettingsPanelProps {
	isOpen: boolean;
	onClose: () => void;
	selectedTheme: string;
	onThemeChange: (theme: string) => void;
	selectedSaturation: number;
	onSaturationChange: (saturation: number) => void;
	selectedLightness: number;
	onLightnessChange: (lightness: number) => void;
	dynamicPrimary: string;
	selectedSemanticTheme: string;
	onSemanticThemeChange: (theme: string) => void;
	id?: string;
	selectedThemeMode: "system" | "light" | "dark";
	onThemeModeChange: () => void;
	lightnessMin: number;
	lightnessMax: number;
	saturationMin: number;
	saturationMax: number;
	selectedQuoteFont: string;
	onQuoteFontChange: (font: string) => void;
	selectedUIFont: string;
	onUIFontChange: (font: string) => void;
	selectedLightTheme: string;
	selectedDarkTheme: string;
	onLightThemeChange: (theme: string) => void;
	onDarkThemeChange: (theme: string) => void;
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
	selectedSemanticTheme,
	onSemanticThemeChange,
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
	onUIFontChange,
	selectedLightTheme,
	selectedDarkTheme,
	onLightThemeChange,
	onDarkThemeChange,
}) => {
	// Shared style constants
	const styles = {
		sectionTitle: "label text-md font-semibold mb-2",
		sectionContainer: "form-control gap-4",
		buttonContainer: "grid grid-cols-3 gap-0 rounded-lg overflow-hidden border border-base-300",
		selectedButton: "btn btn-sm btn-primary rounded-none border-0",
		unselectedButton: "btn btn-sm btn-soft rounded-none border-0",
		divider: "divider my-2",
		radioContainer: "flex gap-4 flex-wrap w-full",
		radioLabel: "flex items-center gap-2 cursor-pointer"
	};
	// Focus management
	React.useEffect(() => {
		if (isOpen) {
			const closeBtn = document.querySelector(
				".settings-panel .close-btn"
			) as HTMLButtonElement;
			if (closeBtn) {
				closeBtn.focus();
			}
		}
	}, [isOpen]);

	React.useEffect(() => {
		if (!isOpen) return;
		const panel = document.querySelector(".settings-panel") as HTMLElement;
		const focusableElements = panel?.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		) as NodeListOf<HTMLElement>;
		if (!focusableElements.length) return;
		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];
		const handleTabKey = (e: KeyboardEvent) => {
			if (e.key === "Tab") {
				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement.focus();
					}
				} else {
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement.focus();
					}
				}
			}
		};
		document.addEventListener("keydown", handleTabKey);
		return () => document.removeEventListener("keydown", handleTabKey);
	}, [isOpen]);

	// Animation variants for the settings panel
	const panelVariants = {
		hidden: {
			x: "-100%"
		},
		visible: {
			x: 0
		}
	};

	const themeMode =
		selectedThemeMode === "light"
			? "Light"
			: selectedThemeMode === "dark"
			? "Dark"
				: "System";

	const Sliders = () => { 
		return (
			<div className="flex flex-col gap-2">
								<div className="form-control gap-2">
					<label
						htmlFor="saturation-slider"
						className="label text-lg font-semibold"
					>
						Saturation:{" "}
						<span className="font-mono">{selectedSaturation}%</span>
					</label>
					<input
						type="range"
						id="saturation-slider"
						min={saturationMin}
						max={saturationMax}
						value={selectedSaturation}
						onChange={(e) =>
							onSaturationChange(Number(e.target.value))
						}
						className="range range-primary"
						aria-label="Saturation"
					/>
				</div>
				<div className="form-control gap-2">
					<label
						htmlFor="lightness-slider"
						className="label text-lg font-semibold"
					>
						Lightness:{" "}
						<span className="font-mono">{selectedLightness}%</span>
					</label>
					<input
						type="range"
						id="lightness-slider"
						min={lightnessMin}
						max={lightnessMax}
						value={selectedLightness}
						onChange={(e) =>
							onLightnessChange(Number(e.target.value))
						}
						className="range range-primary"
						aria-label="Lightness"
					/>
				</div>
			</div>
		)
	}
	

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					id={id}
					className="settings-panel fixed top-0 left-0 h-full max-w-[400px] w-full z-[1002] bg-base-200 noise shadow-2xl flex flex-col"
					role="dialog"
					aria-modal="true"
					aria-labelledby="settings-title"
					aria-describedby="settings-description"
					variants={panelVariants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					transition={{
						duration: 0.3,
						ease: "easeInOut"
					}}
				>
			<div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-100 flex-shrink-0">
				<h3 id="settings-title" className="text-2xl font-bold">
					Settings
				</h3>
				<div className="flex items-center gap-2">
					<DayNightSwitch
						selectedThemeMode={selectedThemeMode}
						onThemeModeChange={onThemeModeChange}
					/>
					<button
						className="close-btn btn btn-ghost btn-circle"
						onClick={onClose}
						aria-label="Close settings"
					>
						<span className="text-xl">✕</span>
					</button>
				</div>
			</div>
			<div
				className="settings-content p-6 flex flex-col gap-6 overflow-y-auto flex-1 min-h-0"
				id="settings-description"
			>
				<div className={styles.sectionContainer}>
					<label className={styles.sectionTitle}>
						Theme
					</label>
					<div className={styles.buttonContainer}>
						{(() => {
							const isDarkMode =
								selectedThemeMode === "dark" ||
								(selectedThemeMode === "system" &&
									window.matchMedia(
										"(prefers-color-scheme: dark)"
									).matches);
							const currentCategory = isDarkMode
								? daisyThemeCategories.dark
								: daisyThemeCategories.light;
							const selectedTheme = isDarkMode
								? selectedDarkTheme
								: selectedLightTheme;
							const onThemeChange = isDarkMode
								? onDarkThemeChange
								: onLightThemeChange;

							return currentCategory.themes.map((theme) => (
								<button
									key={theme.id}
									className={
										selectedTheme === theme.id
											? styles.selectedButton
											: styles.unselectedButton
									}
									onClick={() => onThemeChange(theme.id)}
								>
									{theme.name}
								</button>
							));
						})()}
					</div>
				</div>
				<div className={styles.divider} />
				<div className={styles.sectionContainer}>
					<label className={styles.sectionTitle}>Fonts</label>
					<div className={styles.buttonContainer}>
						{Object.entries(quoteFonts).map(([key, font]) => (
							<button
								key={key}
								className={
									selectedQuoteFont === key
										? styles.selectedButton
										: styles.unselectedButton
								}
								onClick={() => onQuoteFontChange(key)}
								style={{ fontFamily: font.family }}
							>
								{font.name}
							</button>
						))}
					</div>
				</div>
				<div className={styles.divider} />
				<div className={styles.sectionContainer}>
					<label className={styles.sectionTitle}>
						Color
					</label>
					<div className={styles.radioContainer}>
						{Object.entries(semanticColorThemes).map(
							([key, theme]) => {
								const isActive = selectedSemanticTheme === key;
								let radioClass = "radio";
								
								// Use the semantic color for the radio button
								switch (key) {
									case 'primary':
										radioClass += " radio-primary";
										break;
									case 'secondary':
										radioClass += " radio-secondary";
										break;
									case 'accent':
										radioClass += " radio-accent";
										break;
									case 'neutral':
										radioClass += " radio-neutral";
										break;
									default:
										radioClass += " radio-primary";
								}
								
								return (
									<label
										key={key}
										className={styles.radioLabel}
									>
										<input
											type="radio"
											name="semantic-theme"
											className={radioClass}
											checked={isActive}
											onChange={() => onSemanticThemeChange(key)}
										/>

									</label>
								);
							}
						)}
					</div>
				</div>
				{/* <div className="divider my-0" /> */}
				{/* <Sliders /> */}
			</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
