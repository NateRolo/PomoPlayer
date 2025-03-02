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
    soundsEnabled: boolean
    youtubePlayerVisible: boolean
    onSave: (
        durations: typeof DEFAULT_DURATIONS, 
        youtubeUrl: string,
        sessionsUntilLongBreak: number,
        pausePromptEnabled: boolean,
        pausePromptDelay: number,
        theme: ThemeName,
        soundsEnabled: boolean,
        youtubePlayerVisible: boolean
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
    theme: "dark" as ThemeName,
    soundsEnabled: true,
    youtubePlayerVisible: true
}

export const Settings: React.FC<SettingsProps> = ({ 
    durations, 
    youtubeUrl, 
    sessionsUntilLongBreak,
    pausePromptEnabled,
    pausePromptDelay,
    currentTheme,
    soundsEnabled,
    youtubePlayerVisible,
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
    const [newSoundsEnabled, setNewSoundsEnabled] = useState(soundsEnabled)
    const [newYoutubePlayerVisible, setNewYoutubePlayerVisible] = useState(youtubePlayerVisible)

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
            selectedTheme,
            newSoundsEnabled,
            newYoutubePlayerVisible
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
            setSelectedTheme('dark');
            setNewSoundsEnabled(DEFAULT_SETTINGS.soundsEnabled);
            setNewYoutubePlayerVisible(DEFAULT_SETTINGS.youtubePlayerVisible);

            onSave(
                DEFAULT_SETTINGS.durations,
                DEFAULT_SETTINGS.youtubeUrl,
                DEFAULT_SETTINGS.sessionsUntilLongBreak,
                DEFAULT_SETTINGS.pausePromptEnabled,
                DEFAULT_SETTINGS.pausePromptDelay,
                DEFAULT_SETTINGS.theme,
                DEFAULT_SETTINGS.soundsEnabled,
                DEFAULT_SETTINGS.youtubePlayerVisible
            )
        }
    }

    return (
        <div className="modal modal-open" onClick={(e) => {
            // Close modal when clicking the backdrop (outside the modal box)
            if (e.target === e.currentTarget) {
                onClose();
            }
        }}>
            <div className={`modal-box w-full max-w-3xl h-[500px] md:h-[600px] flex flex-col md:flex-row ${sessionColors.background}`}>
                {/* Left sidebar with tabs */}
                <div className="md:w-44 w-full flex md:flex-col overflow-x-auto md:overflow-x-visible bg-base-200 rounded-t-lg md:rounded-t-none md:rounded-l-lg p-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`whitespace-nowrap md:whitespace-normal flex-shrink-0 md:flex-shrink py-3 px-4 mb-1 rounded-lg text-left ${
                                activeTab === tab.id 
                                    ? `bg-neutral text-neutral-content`
                                    : 'text-base-content hover:bg-base-300'
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main content area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                        {activeTab === 'general' && (
                            <div className="space-y-4">
                                <h3 className={`text-xl font-semibold ${sessionColors.text}`}>
                                    General Settings
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control md:col-span-2">
                                        <label className="label py-1">
                                            <span className={`label-text text-base ${sessionColors.text}`}>Theme</span>
                                        </label>
                                        <select
                                            value={selectedTheme}
                                            onChange={(e) => setSelectedTheme(e.target.value as ThemeName)}
                                            className="select select-bordered w-full py-2"
                                        >
                                            <option value="dark">Dark</option>
                                            <option value="light">Light</option>
                                            <option value="cupcake">Cupcake</option>
                                            <option value="forest">Forest</option>
                                            <option value="bumblebee">Bumblebee</option>
                                            <option value="emerald">Emerald</option>
                                            <option value="corporate">Corporate</option>
                                            <option value="synthwave">Synthwave</option>
                                            <option value="retro">Retro</option>
                                            <option value="cyberpunk">Cyberpunk</option>
                                        </select>
                                    </div>
                                    
                                    <div className="form-control md:col-span-2">
                                        <label className="label cursor-pointer justify-between py-1">
                                            <span className={`label-text text-base ${sessionColors.text}`}>
                                                Show YouTube Player
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={newYoutubePlayerVisible}
                                                onChange={(e) => setNewYoutubePlayerVisible(e.target.checked)}
                                                className="toggle toggle-primary toggle-md bg-base-300 border-2 border-base-content/20"
                                            />
                                        </label>
                                    </div>
                                    
                                    <div className="form-control md:col-span-2">
                                        <label className="label cursor-pointer justify-between py-1">
                                            <span className={`label-text text-base ${sessionColors.text}`}>
                                                Enable Pause Prompts
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={newPausePromptEnabled}
                                                onChange={(e) => setNewPausePromptEnabled(e.target.checked)}
                                                className="toggle toggle-primary toggle-md bg-base-300 border-2 border-base-content/20"
                                            />
                                        </label>
                                    </div>

                                    {newPausePromptEnabled && (
                                        <div className="form-control md:col-span-2">
                                            <label className="label py-1">
                                                <span className={`label-text text-base ${sessionColors.text}`}>
                                                    Show Prompt After (minutes)
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={newPausePromptDelay}
                                                onChange={(e) => setNewPausePromptDelay(Number(e.target.value))}
                                                className="input input-bordered w-full py-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'timers' && (
                            <div className="space-y-4">
                                <h3 className={`text-xl font-semibold ${sessionColors.text}`}>Timer Settings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label py-1">
                                            <span className="label-text text-base">Work Duration (min)</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={workDuration}
                                            onChange={(e) => handleDurationChange("work", e.target.value)}
                                            className="input input-bordered w-full py-2"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label py-1">
                                            <span className="label-text text-base">Short Break (min)</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={shortBreakDuration}
                                            onChange={(e) => handleDurationChange("shortBreak", e.target.value)}
                                            className="input input-bordered w-full py-2"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label py-1">
                                            <span className="label-text text-base">Long Break (min)</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={longBreakDuration}
                                            onChange={(e) => handleDurationChange("longBreak", e.target.value)}
                                            className="input input-bordered w-full py-2"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label py-1">
                                            <span className="label-text text-base">Sessions Until Long Break</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={newSessionsUntilLongBreak}
                                            onChange={(e) => setNewSessionsUntilLongBreak(Number(e.target.value))}
                                            className="input input-bordered w-full py-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'sound' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">Sound Settings</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="form-control">
                                        <label className="label py-1">
                                            <span className="label-text text-base">YouTube URL</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newYoutubeUrl}
                                            onChange={(e) => setNewYoutubeUrl(e.target.value)}
                                            className="input input-bordered w-full py-2"
                                        />
                                    </div> 
                                    <div className="form-control">
                                        <label className="label cursor-pointer justify-between py-1">
                                            <span className={`label-text text-base ${sessionColors.text}`}>
                                                Enable Sounds
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={newSoundsEnabled}
                                                onChange={(e) => setNewSoundsEnabled(e.target.checked)}
                                                className="toggle toggle-primary toggle-md bg-base-300 border-2 border-base-content/20"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'account' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">Account Settings</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <p className="text-sm text-base-content/70">No account settings available yet.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-action px-4 md:px-8 py-4 border-t border-base-300">
                        <div className="w-full flex flex-row items-center gap-2">
                            <button
                                className="btn btn-error btn-md flex-1"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                            <button 
                                className="btn btn-base-200 btn-md flex-1" 
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-primary btn btn-md flex-1"
                                onClick={handleSave}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

