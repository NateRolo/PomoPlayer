"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DEFAULT_DURATIONS } from "./PomodoroTimer"
import { ThemeName, getSessionColors } from '../types/theme'
import { useAuth } from '../components/contexts/AuthContext'

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
    onClose,
}) => {
    const [activeTab, setActiveTab] = useState('timers')
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
    const [isBrowser, setIsBrowser] = useState(false)
    const [workDurationError, setWorkDurationError] = useState<string | null>(null)
    const [shortBreakDurationError, setShortBreakDurationError] = useState<string | null>(null)
    const [longBreakDurationError, setLongBreakDurationError] = useState<string | null>(null)
    const [pausePromptDelayError, setPausePromptDelayError] = useState<string | null>(null)
    const [workSessionError, setWorkSessionError] = useState<string | null>(null)
    const [youtubeUrlError, setYoutubeUrlError] = useState<string | null>(null)
    const { user } = useAuth()

    // Get current theme colors
    const sessionColors = getSessionColors(selectedTheme, 'work')

    useEffect(() => {
        setIsBrowser(true)
    }, [])

    const handleWorkDurationChange = (value: string) => {
        const numValue = parseInt(value, 10);
        
        // Validate work duration
        if (isNaN(numValue)) {
            setWorkDurationError("Please enter a valid number");
        } else if (numValue < 1) {
            setWorkDurationError("Minimum duration is 1 minute");
        } else if (numValue > 180) { // 3 hours in minutes
            setWorkDurationError("Maximum duration is 3 hours");
        } else {
            setWorkDurationError(null);
        }
        
        setWorkDuration(numValue);
    }

    const handleShortBreakDurationChange = (value: string) => {
        const numValue = parseInt(value, 10);
        
        // Validate short break duration
        if (isNaN(numValue)) {
            setShortBreakDurationError("Please enter a valid number");
        } else if (numValue < 1) {
            setShortBreakDurationError("Minimum duration is 1 minute");
        } else if (numValue > 30) {
            setShortBreakDurationError("Maximum duration is 30 minutes");
        } else {
            setShortBreakDurationError(null);
        }
        
        setShortBreakDuration(numValue);
    }

    const handleLongBreakDurationChange = (value: string) => {
        const numValue = parseInt(value, 10);
        
        // Validate long break duration
        if (isNaN(numValue)) {
            setLongBreakDurationError("Please enter a valid number");
        } else if (numValue < 1) {
            setLongBreakDurationError("Minimum duration is 1 minute");
        } else if (numValue > 60) {
            setLongBreakDurationError("Maximum duration is 60 minutes");
        } else {
            setLongBreakDurationError(null);
        }
        
        setLongBreakDuration(numValue);
    }

    const handlePausePromptDelayChange = (value: string) => {
        const numValue = parseInt(value, 10);
        
        // Validate the pause prompt delay
        if (isNaN(numValue)) {
            setPausePromptDelayError("Please enter a valid number");
        } else if (numValue < 1) {
            setPausePromptDelayError("Minimum delay is 1 minute");
        } else if (numValue > 10) {
            setPausePromptDelayError("Maximum delay is 10 minutes");
        } else {
            setPausePromptDelayError(null);
        }
        
        setNewPausePromptDelay(numValue);
    }

    const handleWorkSessionChange = (value: string) => {
        const numValue = parseInt(value, 10);
        
        // Validate work sessions until long break
        if (isNaN(numValue)) {
            setWorkSessionError("Please enter a valid number");
        } else if (numValue < 1) {
            setWorkSessionError("Minimum sessions is 1");
        } else if (numValue > 10) {
            setWorkSessionError("Maximum sessions is 10");
        } else {
            setWorkSessionError(null);
        }
        
        setNewSessionsUntilLongBreak(numValue);
    }

    const handleYoutubeUrlChange = (value: string) => {
        // Set the new URL
        setNewYoutubeUrl(value);
        
        // Validate YouTube URL
        if (!value) {
            // Empty URL is allowed (will use default)
            setYoutubeUrlError(null);
            return;
        }
        
        // Check if it's a valid YouTube URL
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        if (!youtubeRegex.test(value)) {
            setYoutubeUrlError("Please enter a valid YouTube URL");
            return;
        }
        
        // Check if it contains a video ID
        const videoIdRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = value.match(videoIdRegex);
        
        if (!match) {
            setYoutubeUrlError("Please enter a valid YouTube video URL");
            return;
        }
        
        // Valid YouTube URL with video ID
        setYoutubeUrlError(null);
    }

    const validateDuration = (value: number) => {
        // Check if value is null or undefined
        if (value === null || value === undefined) {
            return {
                isValid: false,
                errorMessage: "Duration cannot be empty"
            };
        }
        
        if (isNaN(value)) {
            return {
                isValid: false,
                errorMessage: "Duration must be a number"
            };
        }
        
        const durationInSeconds = value * 60;
        
        if (durationInSeconds < 60) {
            return {
                isValid: false,
                errorMessage: "Duration must be at least 1 minute"
            };
        }
        
        if (durationInSeconds > 10800) {
            return {
                isValid: false,
                errorMessage: "Duration must be less than 3 hours"
            };
        }
        
        return {
            isValid: true,
            errorMessage: null
        };
    }

    const tabs = [
        { id: 'timers', label: 'Timers' },
        { id: 'display', label: 'Display' },
        { id: 'sound', label: 'Sound' },
        { id: 'account', label: 'Account' },
    ]

    const handleSave = () => {
        // Check for any validation errors
        if (workDurationError || shortBreakDurationError || longBreakDurationError || 
            pausePromptDelayError || workSessionError || youtubeUrlError) {
            // If there are any validation errors, show an alert and prevent saving
            alert("Please fix all errors before saving.");
            return;
        }
        
        // Additional validation using validateDuration function
        const workValidation = validateDuration(workDuration);
        const shortBreakValidation = validateDuration(shortBreakDuration);
        const longBreakValidation = validateDuration(longBreakDuration);
        const pausePromptValidation = validateDuration(newPausePromptDelay);
        
        // Check if any validation failed
        if (!workValidation.isValid) {
            setWorkDurationError(workValidation.errorMessage);
            return;
        }
        
        if (!shortBreakValidation.isValid) {
            setShortBreakDurationError(shortBreakValidation.errorMessage);
            return;
        }
        
        if (!longBreakValidation.isValid) {
            setLongBreakDurationError(longBreakValidation.errorMessage);
            return;
        }
        
        if (!pausePromptValidation.isValid) {
            setPausePromptDelayError(pausePromptValidation.errorMessage);
            return;
        }
        
        // Validate work sessions
        if (newSessionsUntilLongBreak < 1 || newSessionsUntilLongBreak > 10 || isNaN(newSessionsUntilLongBreak)) {
            setWorkSessionError("Work sessions must be between 1 and 10");
            return;
        }
        
        // Validate YouTube URL if not empty
        if (newYoutubeUrl) {
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
            if (!youtubeRegex.test(newYoutubeUrl)) {
                setYoutubeUrlError("Please enter a valid YouTube URL");
                return;
            }
            
            const videoIdRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            if (!videoIdRegex.test(newYoutubeUrl)) {
                setYoutubeUrlError("Please enter a valid YouTube video URL");
                return;
            }
        }
        
        // If all validations pass, save the settings
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
        // Use window.confirm instead of custom modal
        const confirmed = window.confirm("Are you sure you want to reset all settings to default values?");
        
        if (confirmed) {
            // If confirmed, reset all settings
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
        <>
            <div className="modal modal-open modal-bottom sm:modal-middle" onClick={(e) => {
                // Close modal when clicking the backdrop (outside the modal box)
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}>
                <div className="modal-box w-full max-w-none h-full sm:max-w-3xl sm:h-[600px] p-0 flex flex-col overflow-hidden">
                    {/* Tabs at the top */}
                    <div className="tabs tabs-boxed bg-base-200 rounded-t-lg p-2 gap-1">
                        {tabs.map((tab) => (
                            <a
                                key={tab.id}
                                className={`tab tab-sm md:tab-md transition-all duration-200 ${activeTab === tab.id ? 'tab-active' : ''
                                    }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </a>
                        ))}
                    </div>

                    {/* Main content area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6">
                        {activeTab === 'display' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold">
                                    Display Settings
                                </h3>

                                <div className="card bg-base-200">
                                    <div className="card-body p-4 gap-2">
                                        <h2 className="card-title text-base">Theme</h2>
                                        <select
                                            value={selectedTheme}
                                            onChange={(e) => setSelectedTheme(e.target.value as ThemeName)}
                                            className="select select-bordered w-full"
                                        >
                                            <optgroup label="Themes">
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
                                                <option value="valentine">Valentine</option>
                                                <option value="halloween">Halloween</option>
                                                <option value="garden">Garden</option>
                                                <option value="aqua">Aqua</option>
                                                <option value="lofi">Lofi</option>
                                                <option value="pastel">Pastel</option>
                                                <option value="fantasy">Fantasy</option>
                                                <option value="wireframe">Wireframe</option>
                                                <option value="black">Black</option>
                                                <option value="luxury">Luxury</option>
                                                <option value="dracula">Dracula</option>
                                                <option value="cmyk">CMYK</option>
                                                <option value="autumn">Autumn</option>
                                                <option value="business">Business</option>
                                                <option value="acid">Acid</option>
                                                <option value="lemonade">Lemonade</option>
                                                <option value="night">Night</option>
                                                <option value="coffee">Coffee</option>
                                                <option value="winter">Winter</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                </div>

                                <div className="card bg-base-200">
                                    <div className="card-body p-4">
                                        <h2 className="card-title text-base">Display Options</h2>
                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-between">
                                                <span className="label-text">Show YouTube Player</span>
                                                <input
                                                    type="checkbox"
                                                    checked={newYoutubePlayerVisible}
                                                    onChange={(e) => setNewYoutubePlayerVisible(e.target.checked)}
                                                    className="toggle toggle-primary"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'timers' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold">
                                    Timer Settings
                                </h3>

                                <div className="card bg-base-200">
                                    <div className="card-body p-4">
                                        <h2 className="card-title text-base">Session Durations</h2>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Work Duration (minutes)</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="180"
                                                value={workDuration}
                                                onChange={(e) => handleWorkDurationChange(e.target.value)}
                                                className={`input input-bordered w-full ${workDurationError ? 'input-error' : ''}`}
                                            />
                                            {workDurationError && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">{workDurationError}</span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Short Break Duration (minutes)</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="30"
                                                value={shortBreakDuration}
                                                onChange={(e) => handleShortBreakDurationChange(e.target.value)}
                                                className={`input input-bordered w-full ${shortBreakDurationError ? 'input-error' : ''}`}
                                            />
                                            {shortBreakDurationError && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">{shortBreakDurationError}</span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Long Break Duration (minutes)</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="60"
                                                value={longBreakDuration}
                                                onChange={(e) => handleLongBreakDurationChange(e.target.value)}
                                                className={`input input-bordered w-full ${longBreakDurationError ? 'input-error' : ''}`}
                                            />
                                            {longBreakDurationError && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">{longBreakDurationError}</span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-base-200">
                                    <div className="card-body p-4">
                                        <h2 className="card-title text-base">Session Cycle</h2>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Work Sessions Until Long Break</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={newSessionsUntilLongBreak}
                                                onChange={(e) => handleWorkSessionChange(e.target.value)}
                                                className={`input input-bordered w-full ${workSessionError ? 'input-error' : ''}`}
                                            />
                                            {workSessionError && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">{workSessionError}</span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-base-200">
                                    <div className="card-body p-4">
                                        <h2 className="card-title text-base">Pause Prompts</h2>

                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-between">
                                                <span className="label-text">Enable Pause Prompts</span>
                                                <input
                                                    type="checkbox"
                                                    checked={newPausePromptEnabled}
                                                    onChange={(e) => setNewPausePromptEnabled(e.target.checked)}
                                                    className="toggle toggle-primary"
                                                />
                                            </label>
                                        </div>

                                        {newPausePromptEnabled && (
                                            <div className="form-control mt-2">
                                                <label className="label">
                                                    <span className="label-text">Prompt Delay (minutes)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={newPausePromptDelay}
                                                    onChange={(e) => handlePausePromptDelayChange(e.target.value)}
                                                    className={`input input-bordered w-full ${pausePromptDelayError ? 'input-error' : ''}`}
                                                />
                                                {pausePromptDelayError && (
                                                    <label className="label">
                                                        <span className="label-text-alt text-error">{pausePromptDelayError}</span>
                                                    </label>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'sound' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold">
                                    Sound Settings
                                </h3>

                                <div className="card bg-base-200">
                                    <div className="card-body p-4">
                                        <h2 className="card-title text-base">Sound Options</h2>

                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-between">
                                                <span className="label-text">Enable Sounds</span>
                                                <input
                                                    type="checkbox"
                                                    checked={newSoundsEnabled}
                                                    onChange={(e) => setNewSoundsEnabled(e.target.checked)}
                                                    className="toggle toggle-primary"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-base-200">
                                    <div className="card-body p-4">
                                        <h2 className="card-title text-base">YouTube URL</h2>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">YouTube Video URL</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={newYoutubeUrl}
                                                onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                                                
                                                className={`input input-bordered w-full ${youtubeUrlError ? 'input-error' : ''}`}
                                            />
                                            {youtubeUrlError && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">{youtubeUrlError}</span>
                                                </label>
                                            )}
                                            <label className="label">
                                                <span className="label-text-alt">Enter a YouTube URL for background music</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold">
                                    Account Settings
                                </h3>

                                {user ? (
                                    <div className="space-y-6">
                                        <div className="card bg-base-200">
                                            <div className="card-body p-4">
                                                <div className="flex items-center gap-4">
                                                    {user.user_metadata?.avatar_url ? (
                                                        <div className="avatar">
                                                            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                                <img
                                                                    src={user.user_metadata.avatar_url}
                                                                    alt={user.user_metadata?.full_name || "User"}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="avatar placeholder">
                                                            <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                                                                <span className="text-xl">
                                                                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-lg">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                                                        <p className="text-sm opacity-70">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="card bg-base-200">
                                        <div className="card-body p-4">
                                            <p>Sign in to access account features</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer with action buttons */}
                    <div className="modal-action justify-between border-t border-base-300 p-4 bg-base-100">
                        <button className="btn btn-outline btn-sm md:btn-md" onClick={handleReset}>Reset</button>
                        <div className="flex gap-2">
                            <button className="btn btn-sm md:btn-md" onClick={onClose}>Cancel</button>
                            <button className="btn btn-primary btn-sm md:btn-md" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

