"use client"

import type React from "react"
import { useState } from "react"
import { DEFAULT_DURATIONS } from "./PomodoroTimer"
import { themes, Theme } from '../types/theme'

interface SettingsProps {
    durations: typeof DEFAULT_DURATIONS
    youtubeUrl: string
    sessionsUntilLongBreak: number
    pausePromptEnabled: boolean
    pausePromptDelay: number
    currentTheme: string
    onSave: (
        durations: typeof DEFAULT_DURATIONS, 
        youtubeUrl: string,
        sessionsUntilLongBreak: number,
        pausePromptEnabled: boolean,
        pausePromptDelay: number,
        theme: string
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
    theme: "default"
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
    const [selectedTheme, setSelectedTheme] = useState(currentTheme)

    // Get current theme colors
    const currentThemeColors = themes[selectedTheme] || themes.default;

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
            setSelectedTheme('default');

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-[800px] h-[600px] flex">
                
                <div className="w-48 border-r bg-gray-50 rounded-l-lg">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`w-full text-left px-4 py-3 ${
                                activeTab === tab.id 
                                    ? `bg-white border-l-4 ${currentThemeColors.work.text} font-medium` 
                                    : 'text-gray-600 hover:bg-gray-100'
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
                                <h3 className="text-lg font-semibold">General Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Theme
                                        </label>
                                        <select
                                            value={selectedTheme}
                                            onChange={(e) => setSelectedTheme(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            {Object.entries(themes).map(([key, theme]) => (
                                                <option key={key} value={key}>
                                                    {theme.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">
                                            Enable Pause Prompts
                                        </label>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newPausePromptEnabled}
                                                onChange={(e) => setNewPausePromptEnabled(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                        </label>
                                    </div>
                                    
                                    {newPausePromptEnabled && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Show Prompt After (minutes)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={newPausePromptDelay}
                                                onChange={(e) => setNewPausePromptDelay(Number(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'timers' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Timer Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Work Duration</label>
                                        <input
                                            type="number"
                                            value={workDuration}
                                            onChange={(e) => handleDurationChange("work", e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Short Break Duration</label>
                                        <input
                                            type="number"
                                            value={shortBreakDuration}
                                            onChange={(e) => handleDurationChange("shortBreak", e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Long Break Duration</label>
                                        <input
                                            type="number"
                                            value={longBreakDuration}
                                            onChange={(e) => handleDurationChange("longBreak", e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Sessions Until Long Break</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={newSessionsUntilLongBreak}
                                            onChange={(e) => setNewSessionsUntilLongBreak(Number(e.target.value))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

                    <div className="border-t p-4 flex justify-end space-x-4">
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-auto"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <button 
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300" 
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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

