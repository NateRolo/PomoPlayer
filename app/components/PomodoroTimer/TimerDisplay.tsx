import type React from "react";

interface TimerDisplayProps {
    timeLeft: number; // Time left in seconds
    formatTime: (seconds: number) => string; // Function to format the time string
    currentThemeColors: { text: string }; // Theme color for the text
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
    timeLeft,
    formatTime,
    currentThemeColors,
}) => {
    return (
        <div className="relative my-2">
            <div className={`text-6xl sm:text-8xl md:text-9xl font-bold tracking-tight ${currentThemeColors.text} whitespace-nowrap`}>
                {formatTime(timeLeft)}
            </div>
        </div>
    );
}; 