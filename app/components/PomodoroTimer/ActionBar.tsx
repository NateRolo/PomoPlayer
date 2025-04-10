import type React from "react";
import { ThemeName } from "../../types/theme"; // Assuming ThemeName is here

// Icons (simple SVGs for example)
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

// New Palette Icon
const PaletteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
         <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
);

interface ActionBarProps {
    onShowSettings: () => void;
    onShowVideoLibrary: () => void;
    currentTheme: ThemeName;
    onToggleTheme: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
    onShowSettings,
    onShowVideoLibrary,
    currentTheme,
    onToggleTheme,
}) => {
    let ThemeIcon: React.FC = SunIcon; // Default to Sun (switch to light)
    let themeTitle = "Switch to Light Mode";

    if (currentTheme === 'light') {
        ThemeIcon = MoonIcon;
        themeTitle = "Switch to Dark Mode";
    } else if (currentTheme === 'dark') {
        ThemeIcon = SunIcon;
        themeTitle = "Switch to Light Mode";
    } else {
        // Theme is neither light nor dark
        ThemeIcon = PaletteIcon; 
        themeTitle = "Switch to Light Mode (Revert Theme)"; // Clarify action
    }

    return (
        // Stack vertically by default, use grid on medium screens
        <div className="w-full max-w-md min-w-[300px] flex flex-col md:grid md:grid-cols-3 gap-2">
            {/* Settings Button */}
            <button
                className="btn btn-neutral hover:btn-info border border-base-content/20 transform transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={onShowSettings}
                title="Settings"
            >
                Settings
            </button>
            {/* Videos Button */}
            <button
                className="btn btn-neutral hover:btn-success border border-base-content/20 transform transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={onShowVideoLibrary}
                title="Videos"
            >
                Videos
            </button>
            {/* Theme Toggle Button */}
            <button
                className="btn btn-neutral hover:btn-warning border border-base-content/20 transform transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={onToggleTheme}
                title={themeTitle}
            >
                <ThemeIcon />
            </button>
        </div>
    );
}; 