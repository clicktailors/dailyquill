import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	quoteFonts,
	uiFonts,
	semanticColorThemes,
	daisyThemeCategories,
} from "./colors";
import DayNightSwitch from "./components/DayNightSwitch";
import { MoonIcon, SunIcon } from "./components/Icons";

interface SettingsPanelProps {
	isOpen: boolean;
	onClose: () => void;
	selectedSemanticTheme: string;
	onSemanticThemeChange: (theme: string) => void;
	id?: string;
	selectedThemeMode: "system" | "light" | "dark";
	onThemeModeChange: () => void;
	selectedQuoteFont: string;
	onQuoteFontChange: (font: string) => void;
	selectedUIFont: string;
	onUIFontChange: (font: string) => void;
	selectedLightTheme: string;
	selectedDarkTheme: string;
	onLightThemeChange: (theme: string) => void;
	onDarkThemeChange: (theme: string) => void;
	backgroundLightness: number;
	onBackgroundLightnessChange: (lightness: number) => void;
	lightnessMin: number;
	lightnessMax: number;
	fontSize: number;
	onFontSizeChange: (size: number) => void;
	fontSizeSteps: {
		name: string;
		regular: { base: string; md: string; lg: string };
		monospace: { base: string; md: string; lg: string };
	}[];
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
	isOpen,
	onClose,
	selectedSemanticTheme,
	onSemanticThemeChange,
	id,
	selectedThemeMode,
	onThemeModeChange,
	selectedQuoteFont,
	onQuoteFontChange,
	selectedUIFont,
	onUIFontChange,
	selectedLightTheme,
	selectedDarkTheme,
	onLightThemeChange,
	onDarkThemeChange,
	backgroundLightness,
	onBackgroundLightnessChange,
	lightnessMin,
	lightnessMax,
	fontSize,
	onFontSizeChange,
	fontSizeSteps,
}) => {
	// Shared style constants
	const styles = {
		sectionTitle: "label text-md font-semibold mb-2",
		sectionContainer: "form-control gap-4",
		buttonContainer:
			"grid grid-cols-3 gap-0 rounded-lg overflow-hidden border border-base-300",
		selectedButton: "btn btn-sm btn-primary rounded-none border-0",
		unselectedButton: "btn btn-sm btn-soft rounded-none border-0",
		divider: "divider my-2",
		radioContainer: "flex gap-4 flex-wrap w-full",
		radioLabel: "flex items-center gap-2 cursor-pointer",
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
			x: "-100%",
		},
		visible: {
			x: 0,
		},
	};

	const themeMode =
		selectedThemeMode === "light"
			? "Light"
			: selectedThemeMode === "dark"
			? "Dark"
			: "System";

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
						ease: "easeInOut",
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
							<label className={styles.sectionTitle}>Theme</label>
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

									return currentCategory.themes.map(
										(theme) => (
											<button
												key={theme.id}
												className={
													selectedTheme === theme.id
														? styles.selectedButton
														: styles.unselectedButton
												}
												onClick={() =>
													onThemeChange(theme.id)
												}
											>
												{theme.name}
											</button>
										)
									);
								})()}
							</div>
							<div className="mt-4">
								<label className="sr-only">
									Background Brightness
								</label>
								<div className="flex items-center gap-4">
									<span className="opacity-70" title="Dark">
										{/* Moon icon */}
										<MoonIcon />
									</span>
									<input
										type="range"
										min={lightnessMin}
										max={lightnessMax}
										value={backgroundLightness}
										onChange={(e) =>
											onBackgroundLightnessChange(
												Number(e.target.value)
											)
										}
										className="range range-primary flex-1"
										aria-label="Background brightness"
									/>
									<span className="opacity-70" title="Light">
										{/* Sun icon */}
										<SunIcon />
									</span>
								</div>
								<div className="text-center text-xs opacity-60 mt-1">
									{backgroundLightness}%
								</div>
							</div>
						</div>
						<div className={styles.divider} />
						<div className={styles.sectionContainer}>
							<label className={styles.sectionTitle}>Fonts</label>
							<div className={styles.buttonContainer}>
								{Object.entries(quoteFonts).map(
									([key, font]) => (
										<button
											key={key}
											className={
												selectedQuoteFont === key
													? styles.selectedButton
													: styles.unselectedButton
											}
											onClick={() =>
												onQuoteFontChange(key)
											}
											style={{ fontFamily: font.family }}
										>
											{font.name}
										</button>
									)
								)}
							</div>
							<div className="mt-4">
								<label className="sr-only">Font Size</label>
								<div className="flex items-center gap-4">
									<span
										className="text-sm opacity-70 font-bold"
										title="Small"
									>
										Aa
									</span>
									<input
										type="range"
										min={0}
										max={fontSizeSteps.length - 1}
										step={1}
										value={fontSize}
										onChange={(e) =>
											onFontSizeChange(
												Number(e.target.value)
											)
										}
										className="range range-primary flex-1"
										aria-label="Font size"
									/>
									<span
										className="text-xl opacity-70 font-bold"
										title="Large"
									>
										Aa
									</span>
								</div>
								<div className="text-center text-xs opacity-60 mt-1">
									{fontSizeSteps[fontSize]?.name}
								</div>
							</div>
						</div>
						<div className={styles.divider} />
						<div className={styles.sectionContainer}>
							<label className={styles.sectionTitle}>Color</label>
							<div className={styles.radioContainer}>
								{Object.entries(semanticColorThemes).map(
									([key]) => {
										const isActive =
											selectedSemanticTheme === key;
										let radioClass = "radio";

										// Use the semantic color for the radio button
										switch (key) {
											case "primary":
												radioClass += " radio-primary";
												break;
											case "secondary":
												radioClass +=
													" radio-secondary";
												break;
											case "accent":
												radioClass += " radio-accent";
												break;
											case "neutral":
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
													onChange={() =>
														onSemanticThemeChange(
															key
														)
													}
												/>
											</label>
										);
									}
								)}
							</div>
						</div>
					</div>

					{/* Footer Credits */}
					<div className="px-6 py-4 border-t border-base-300 flex-shrink-0">
						<div className="flex justify-center items-center gap-3">
							<div className="text-sm opacity-70">
								Built with ❤️ by{" "}
								<a
									href="https://clicktailors.com"
									target="_blank"
									rel="noopener noreferrer"
									className="link link-accent link-hover font-medium"
								>
									ClickTailors
								</a>
							</div>
							{/* <div className="text-sm opacity-70">
								<a
									href="https://buymeacoffee.com/clicktailors"
									target="_blank"
									rel="noopener noreferrer"
									className="btn btn-xs btn-outline btn-accent gap-2"
								>
									<span>☕</span>
									Buy me a coffee
								</a>
							</div> */}
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
