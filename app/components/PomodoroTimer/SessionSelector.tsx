import type React from "react";
import type { SessionType } from "../../hooks/usePomodoroTimer"; // Adjust path as needed

interface SessionSelectorProps {
    currentSessionType: SessionType;
    onChangeSessionType: (newSessionType: SessionType) => void;
}

export const SessionSelector: React.FC<SessionSelectorProps> = ({
    currentSessionType,
    onChangeSessionType,
}) => {
    return (
        <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-2 min-w-[300px]">
            <button
                className={`btn w-full border border-base-content/20 ${currentSessionType === "work" ? "btn-primary" : "btn-ghost hover:btn-primary"}`}
                onClick={() => onChangeSessionType("work")}>
                Focus
            </button>
            <button
                className={`btn w-full border border-base-content/20 ${currentSessionType === "shortBreak" ? "btn-primary" : "btn-ghost hover:btn-primary"}`}
                onClick={() => onChangeSessionType("shortBreak")}>
                Break
            </button>
            <button
                className={`btn w-full border border-base-content/20 ${currentSessionType === "longBreak" ? "btn-primary" : "btn-ghost hover:btn-primary"}`}
                onClick={() => onChangeSessionType("longBreak")}>
                Long Break
            </button>
        </div>
    );
}; 