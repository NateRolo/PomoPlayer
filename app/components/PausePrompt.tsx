"use client";

import { getSessionColors } from "../types/theme";
import { ThemeName } from "../types/theme";

interface PausePromptProps {
    onAction: (action: string) => void
    currentTheme: ThemeName
}

export const PausePrompt: React.FC<PausePromptProps> = ({ onAction, currentTheme }) => {
    const sessionColors = getSessionColors(currentTheme, 'work');
    
    return (
        <div className="modal modal-open">
            <div className={`modal-box ${sessionColors.background}`}>
                <h3 className={`font-bold text-lg ${sessionColors.text}`}>Timer Paused</h3>
                <p className={`py-4 ${sessionColors.text}`}>Would you like to continue your session?</p>
                <div className="modal-action flex justify-between w-full">
                    <button 
                        className={`btn btn-secondary`}
                        onClick={() => onAction('reset')}
                    >
                        Reset Session
                    </button>
                    <button 
                        className={`btn btn-neutral`}
                        onClick={() => onAction('remind')}
                    >
                        Remind me in 2 minutes
                    </button>
                    <button 
                        className={`btn btn-accent flex-1 max-w-[40%]`}
                        onClick={() => onAction('continue')}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

