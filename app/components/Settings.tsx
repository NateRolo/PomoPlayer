"use client"

import type React from "react"
import { useState } from "react"

interface SettingsProps {
    durations: {
        work: number
        shortBreak: number
        longBreak: number
    }
    youtubeUrl: string
    onSave: (durations: SettingsProps["durations"], youtubeUrl: string) => void
    onClose: () => void
}

export const Settings: React.FC<SettingsProps> = ({ durations, youtubeUrl, onSave, onClose }) => {
    const [newDurations, setNewDurations] = useState(durations)
    const [newYoutubeUrl, setNewYoutubeUrl] = useState(youtubeUrl)

    const handleDurationChange = (key: keyof typeof durations, value: string) => {
        setNewDurations({
            ...newDurations,
            [key]: Number.parseInt(value, 10) * 60,
        })
    }

    const handleSave = () => {
        onSave(newDurations, newYoutubeUrl)
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
                            value={newDurations.work / 60}
                            onChange={(e) => handleDurationChange("work", e.target.value)}
                            className="border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block">Short Break Duration (minutes)</label>
                        <input
                            type="number"
                            value={newDurations.shortBreak / 60}
                            onChange={(e) => handleDurationChange("shortBreak", e.target.value)}
                            className="border rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="block">Long Break Duration (minutes)</label>
                        <input
                            type="number"
                            value={newDurations.longBreak / 60}
                            onChange={(e) => handleDurationChange("longBreak", e.target.value)}
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

