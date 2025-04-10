import type React from "react";

interface ActionBarProps {
    onShowSettings: () => void;
    onShowVideoLibrary: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
    onShowSettings,
    onShowVideoLibrary,
}) => {
    return (
        <div className="w-full max-w-md min-w-[300px] grid grid-cols-2 gap-2">
            <button
                className="btn btn-neutral hover:btn-info transform transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={onShowSettings}>
                Settings
            </button>
            <button
                className="btn btn-neutral hover:btn-success transform transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={onShowVideoLibrary}>
                Videos
            </button>
        </div>
    );
}; 