import type React from "react"

interface PausePromptProps {
    onAction: (action: string) => void
}

export const PausePrompt: React.FC<PausePromptProps> = ({ onAction }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Timer Paused</h2>
                <p className="mb-4">What would you like to do?</p>
                <div className="space-y-2">
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => onAction("resume")}
                    >
                        Resume
                    </button>
                    <button
                        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => onAction("end")}
                    >
                        End Session
                    </button>
                    <button
                        className="w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => onAction("extend")}
                    >
                        Extend Pause (+5 mins)
                    </button>
                    <button
                        className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => onAction("reprompt")}
                    >
                        Reprompt in 2 minutes
                    </button>
                </div>
            </div>
        </div>
    )
}

