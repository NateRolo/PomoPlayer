"use client"

import type React from "react"
import { useState } from "react"
import { DEFAULT_DURATIONS } from "./PomodoroTimer"
import { ThemeName, getSessionColors } from '../types/theme'

interface SettingsProps {
    durations: typeof DEFAULT_DURATIONS
    youtubeUrl: string
    sessionsUntilLongBreak: number
    pausePromptEnabled: boolean
    pausePromptDelay: number
    currentTheme: ThemeName
    onSave: (
        durations: typeof DEFAULT_DURATIONS, 
        youtubeUrl: string,
        sessionsUntilLongBreak: number,
        pausePromptEnabled: boolean,
        pausePromptDelay: number,
        theme: ThemeName
    ) => void
    onClose: () => void
}

const DEFAULT_SETTINGS = {
    durations: {
        work: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
    },
    sessionsUntilLongBreak: 4,
    youtubeUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    pausePromptEnabled: true,
    pausePromptDelay: 2,
    theme: "light" as ThemeName
}

export const Settings: React.FC<SettingsProps> = ({ 
    durations, 
    youtubeUrl, 
    sessionsUntilLongBreak,
    pausePromptEnabled,
    pausePromptDelay,
    currentTheme,
    onSave, 
    onClose 
}) => {
    const [activeTab, setActiveTab] = useState('general')
    const [workDuration, setWorkDuration] = useState(Math.floor(durations.work / 60))
    const [shortBreakDuration, setShortBreakDuration] = useState(Math.floor(durations.shortBreak / 60))
    const [longBreakDuration, setLongBreakDuration] = useState(Math.floor(durations.longBreak / 60))
    const [newYoutubeUrl, setNewYoutubeUrl] = useState(youtubeUrl)
    const [newSessionsUntilLongBreak, setNewSessionsUntilLongBreak] = useState(sessionsUntilLongBreak)
    const [newPausePromptEnabled, setNewPausePromptEnabled] = useState(pausePromptEnabled)
    const [newPausePromptDelay, setNewPausePromptDelay] = useState(pausePromptDelay)
    const [selectedTheme, setSelectedTheme] = useState<ThemeName>(currentTheme as ThemeName)

    // Get current theme colors
    const sessionColors = getSessionColors(selectedTheme, 'work')

    const handleDurationChange = (key: keyof typeof durations, value: string) => {
        const numValue = Number.parseInt(value, 10)
        switch (key) {
            case 'work':
                setWorkDuration(numValue)
                break
            case 'shortBreak':
                setShortBreakDuration(numValue)
                break
            case 'longBreak':
                setLongBreakDuration(numValue)
                break
        }
    }

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'timers', label: 'Timers' },
        { id: 'sound', label: 'Sound' },
        { id: 'account', label: 'Account' },
    ]

    const handleSave = () => {
        onSave(
            {
                work: workDuration * 60,
                shortBreak: shortBreakDuration * 60,
                longBreak: longBreakDuration * 60,
            },
            newYoutubeUrl,
            newSessionsUntilLongBreak,
            newPausePromptEnabled,
            newPausePromptDelay,
            selectedTheme
        )
    }

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all settings to default values?')) {
            setWorkDuration(Math.floor(DEFAULT_SETTINGS.durations.work / 60));
            setShortBreakDuration(Math.floor(DEFAULT_SETTINGS.durations.shortBreak / 60));
            setLongBreakDuration(Math.floor(DEFAULT_SETTINGS.durations.longBreak / 60));
            setNewSessionsUntilLongBreak(DEFAULT_SETTINGS.sessionsUntilLongBreak);
            setNewYoutubeUrl(DEFAULT_SETTINGS.youtubeUrl);
            setNewPausePromptEnabled(DEFAULT_SETTINGS.pausePromptEnabled);
            setNewPausePromptDelay(DEFAULT_SETTINGS.pausePromptDelay);
            setSelectedTheme('light');

            onSave(
                DEFAULT_SETTINGS.durations,
                DEFAULT_SETTINGS.youtubeUrl,
                DEFAULT_SETTINGS.sessionsUntilLongBreak,
                DEFAULT_SETTINGS.pausePromptEnabled,
                DEFAULT_SETTINGS.pausePromptDelay,
                DEFAULT_SETTINGS.theme
            )
        }
    }

    return (
        <div className="modal modal-open">
            <div className={`modal-box w-[800px] h-[600px] flex ${sessionColors.background}`}>
                {/* Left sidebar with tabs */}
                <div className="menu bg-base-200 w-48 rounded-l-lg">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`menu-item ${
                                activeTab === tab.id 
                                    ? `${sessionColors.button.background} ${sessionColors.text}`
                                    : 'text-base-content hover:bg-base-300'
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main content area */}
                <div className="flex-1 flex flex-col h-full">
                    <div className="flex-1 p-6 overflow-y-auto">
                        {activeTab === 'general' && (
                            <div className="space-y-4">
                                <h3 className={`text-lg font-semibold ${sessionColors.text}`}>
                                    General Settings
                                </h3>
                                <div className="space-y-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className={`label-text ${sessionColors.text}`}>Theme</span>
                                        </label>
                                        <select
                                            value={selectedTheme}
                                            onChange={(e) => setSelectedTheme(e.target.value as ThemeName)}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="light">Light</option>
                                            <option value="dark">Dark</option>
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <span className={`label-text ${sessionColors.text}`}>
                                                Enable Pause Prompts
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={newPausePromptEnabled}
                                                onChange={(e) => setNewPausePromptEnabled(e.target.checked)}
                                                className="toggle toggle-primary"
                                            />
                                        </label>
                                    </div>
                                    
                                    {newPausePromptEnabled && (
                                        <div className="form-control">
                                            <label className="label">
                                                <span className={`label-text ${sessionColors.text}`}>
                                                    Show Prompt After (minutes)
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={newPausePromptDelay}
                                                onChange={(e) => setNewPausePromptDelay(Number(e.target.value))}
                                                className="input input-bordered w-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'timers' && (
                            <div className="space-y-4">
                                <h3 className={`text-lg font-semibold ${sessionColors.text}`}>Timer Settings</h3>
                                <div className="space-y-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Work Duration</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={workDuration}
                                            onChange={(e) => handleDurationChange("work", e.target.value)}
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Short Break Duration</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={shortBreakDuration}
                                            onChange={(e) => handleDurationChange("shortBreak", e.target.value)}
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Long Break Duration</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={longBreakDuration}
                                            onChange={(e) => handleDurationChange("longBreak", e.target.value)}
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Sessions Until Long Break</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={newSessionsUntilLongBreak}
                                            onChange={(e) => setNewSessionsUntilLongBreak(Number(e.target.value))}
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'sound' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Sound Settings</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
                                    <input
                                        type="text"
                                        value={newYoutubeUrl}
                                        onChange={(e) => setNewYoutubeUrl(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'account' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Account Settings</h3>
                                {/* Add account settings here */}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-action px-6 py-4 bg-base-200">
                        <button
                            className="btn btn-error mr-auto"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <button 
                            className="btn btn-ghost" 
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            className={`btn ${sessionColors.button.background}`}
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

