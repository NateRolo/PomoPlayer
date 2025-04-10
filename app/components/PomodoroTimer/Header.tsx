import type React from "react";
import type { SessionType } from "../../hooks/usePomodoroTimer"; // Adjust path as needed

interface HeaderProps {
    sessionType: SessionType;
    sessionCount: number;
    sessionsUntilLongBreak: number;
    // Pass theme colors directly for now, or consider passing theme name 
    // and deriving colors within this component or via context
    currentThemeColors: { text: string }; 
}

export const Header: React.FC<HeaderProps> = ({
    sessionType,
    sessionCount,
    sessionsUntilLongBreak,
    currentThemeColors,
}) => {
    const getSessionText = () => {
        switch (sessionType) {
            case "work":
                return `Focus Session ${sessionCount + 1}/${sessionsUntilLongBreak}`;
            case "shortBreak":
                return "Short Break";
            case "longBreak":
                return "Long Break";
            default:
                return ""; // Should not happen
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <h1 className={`text-4xl font-bold bg-clip-text bg-gradient-to-r ${currentThemeColors.text} whitespace-nowrap`}>
                PomoPlayer
            </h1>
            <div className={`text-l font-medium opacity-80 ${currentThemeColors.text} whitespace-nowrap`}>
                {getSessionText()}
            </div>
        </div>
    );
}; 