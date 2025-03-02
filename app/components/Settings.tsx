"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DEFAULT_DURATIONS } from "./PomodoroTimer"
import { ThemeName, getSessionColors } from '../types/theme'
import { createPortal } from 'react-dom'
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
    isPremium: boolean
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
    onPurchasePremium?: () => void;
    onShowAuthModal?: () => void;
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
    isPremium,
    onSave, 
    onClose,
    onPurchasePremium,
    onShowAuthModal
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
    const [showResetConfirmation, setShowResetConfirmation] = useState(false)
    const [isBrowser, setIsBrowser] = useState(false)
    const { user } = useAuth()

    // Get current theme colors
    const sessionColors = getSessionColors(selectedTheme, 'work')

    useEffect(() => {
        setIsBrowser(true)
    }, [])

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
        setShowResetConfirmation(true)
    }

    const confirmReset = () => {
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
        
        setShowResetConfirmation(false)
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
                                className={`tab tab-sm md:tab-md transition-all duration-200 ${
                                    activeTab === tab.id ? 'tab-active' : ''
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                            </a>
                    ))}
                </div>

                {/* Main content area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold">
                                    General Settings
                                </h3>
                                
                                <div className="card bg-base-200">
                                    <div className="card-body p-4 gap-2">
                                        <h2 className="card-title text-base">Theme</h2>
                                        <select
                                            value={selectedTheme}
                                            onChange={(e) => setSelectedTheme(e.target.value as ThemeName)}
                                            className="select select-bordered w-full"
                                        >
                                            <optgroup label="Free Themes">
                                                <option value="dark">Dark</option>
                                            <option value="light">Light</option>
                                            <option value="cupcake">Cupcake</option>
                                            <option value="forest">Forest</option>
                                            </optgroup>
                                            
                                            <optgroup label="Premium Themes" disabled={!user}>
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
                                            </optgroup>
                                        </select>
                                        
                                        {!user && (
                                            <div className="flex items-center gap-2 text-info mt-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                <span className="text-xs">Upgrade to access all premium themes</span>
                                            </div>
                                        )}
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
                                                max="60"
                                                value={workDuration}
                                                onChange={(e) => handleDurationChange('work', e.target.value)}
                                                className="input input-bordered w-full"
                                            />
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
                                                onChange={(e) => handleDurationChange('shortBreak', e.target.value)}
                                            className="input input-bordered w-full"
                        />
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
                                                onChange={(e) => handleDurationChange('longBreak', e.target.value)}
                                            className="input input-bordered w-full"
                        />
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
                                                onChange={(e) => setNewSessionsUntilLongBreak(parseInt(e.target.value))}
                                            className="input input-bordered w-full"
                        />
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
                                                    onChange={(e) => setNewPausePromptDelay(parseInt(e.target.value))}
                                            className="input input-bordered w-full"
                        />
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
                            onChange={(e) => setNewYoutubeUrl(e.target.value)}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                className="input input-bordered w-full"
                        />
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
                                        
                                        <div className="card bg-base-200">
                                            <div className="card-body p-4">
                                                <h2 className="card-title text-base">Premium Themes</h2>
                                                {isPremium ? (
                                                    <div className="alert alert-success">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        <span>You have access to all premium themes</span>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <p>Unlock all 30 premium themes for a one-time payment of $2 CAD</p>
                                                        <button 
                                                            className="btn btn-primary btn-sm"
                                                            onClick={onPurchasePremium}
                                                        >
                                                            Upgrade Now
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="card bg-base-200">
                                        <div className="card-body p-4">
                                            <p>Sign in to access account features and premium themes</p>
                                            <button 
                                                className="btn btn-primary btn-sm mt-2"
                                                onClick={onShowAuthModal}
                                            >
                                                Sign In
                                            </button>
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

            {/* Reset Confirmation Modal */}
            {showResetConfirmation && (
                isBrowser && createPortal(
                    <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <div className={`modal-box ${sessionColors.background} max-w-md mx-auto relative`} onClick={(e) => e.stopPropagation()}>
                            <h3 className={`font-bold text-lg ${sessionColors.text}`}>Reset Settings</h3>
                            <p className={`py-4 ${sessionColors.text}`}>Are you sure you want to reset all settings to default values?</p>
                            <div className="modal-action flex justify-between w-full">
                        <button
                                    className="btn btn-neutral"
                                    onClick={() => setShowResetConfirmation(false)}
                        >
                        Cancel
                    </button>
                        <button 
                                    className="btn btn-error flex-1 max-w-[40%]"
                                    onClick={confirmReset}
                        >
                                    Reset All Settings
                        </button>
                    </div>
                </div>
                    </div>,
                    document.body
                )
            )}
        </>
    )
}

