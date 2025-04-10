import type React from "react";

interface TimerControlsProps {
    isActive: boolean;
    onToggleTimer: () => void;
    onResetTimer: () => void;
    onSkipSession: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
    isActive,
    onToggleTimer,
    onResetTimer,
    onSkipSession,
}) => {
    return (
        <div className="w-full flex flex-col gap-2 max-w-md min-w-[300px]">
            <button
                className="btn btn-accent w-full transform transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={onToggleTimer}>
                {isActive ? "Pause" : "Start"}
            </button>

            <div className="grid grid-cols-2 gap-2">
                <button
                    className="btn btn-neutral hover:btn-secondary transform transition-all duration-200 hover:scale-105 active:scale-95"
                    onClick={onResetTimer}>
                    Reset Timer
                </button>
                <button
                    className="btn btn-neutral hover:btn-warning transform transition-all duration-200 hover:scale-105 active:scale-95"
                    onClick={onSkipSession}>
                    Skip Session
                </button>
            </div>
        </div>
    );
}; 