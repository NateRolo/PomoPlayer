"use client"

import type React from "react"
import { useState } from "react"
import { DEFAULT_DURATIONS } from "./PomodoroTimer"

interface SettingsProps {
    durations: typeof DEFAULT_DURATIONS
    youtubeUrl: string
    sessionsUntilLongBreak: number
    onSave: (
        durations: typeof DEFAULT_DURATIONS, 
        youtubeUrl: string,
        sessionsUntilLongBreak: number
    ) => void
    onClose: () => void
}

export const Settings: React.FC<SettingsProps> = ({ 
    durations, 
    youtubeUrl, 
    sessionsUntilLongBreak,
    onSave, 
    onClose 
}) => {
    const [workDuration, setWorkDuration] = useState(Math.floor(durations.work / 60))
    const [shortBreakDuration, setShortBreakDuration] = useState(Math.floor(durations.shortBreak / 60))
    const [longBreakDuration, setLongBreakDuration] = useState(Math.floor(durations.longBreak / 60))
    const [newYoutubeUrl, setNewYoutubeUrl] = useState(youtubeUrl)
    const [newSessionsUntilLongBreak, setNewSessionsUntilLongBreak] = useState(sessionsUntilLongBreak)

    const handleDurationChange = (key: keyof typeof durations, value: string) => {
        setWorkDuration(Number.parseInt(value, 10))
        setShortBreakDuration(Number.parseInt(value, 10))
        setLongBreakDuration(Number.parseInt(value, 10))
    }

  

    const handleSave = () => {
        onSave(
            {
                work: workDuration * 60,
                shortBreak: shortBreakDuration * 60,
                longBreak: longBreakDuration * 60,
            },
            newYoutubeUrl,
            newSessionsUntilLongBreak
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block">Work Duration (minutes)</label>
                        <input
                            type="number"
                            value={workDuration}
                            onChange={(e) => handleDurationChange("work", e.target.value)}
                            className="border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block">Short Break Duration (minutes)</label>
                        <input
                            type="number"
                            value={shortBreakDuration}
                            onChange={(e) => handleDurationChange("shortBreak", e.target.value)}
                            className="border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block">Long Break Duration (minutes)</label>
                        <input
                            type="number"
                            value={longBreakDuration}
                            onChange={(e) => handleDurationChange("longBreak", e.target.value)}
                            className="border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block">Sessions Until Long Break</label>
                        <input
                            type="number"
                            min="1"
                            value={newSessionsUntilLongBreak}
                            onChange={(e) => setNewSessionsUntilLongBreak(Number(e.target.value))}
                            className="border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block">YouTube URL</label>
                        <input
                            type="text"
                            value={newYoutubeUrl}
                            onChange={(e) => setNewYoutubeUrl(e.target.value)}
                            className="border rounded p-2 w-full"
                        />
                    </div> 
                </div>
                <div className="mt-6 space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSave}>
                        Save
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

