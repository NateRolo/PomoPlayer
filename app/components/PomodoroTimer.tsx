"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import YouTube from "react-youtube"
import { Settings } from "./Settings"
import { PausePrompt } from "./PausePrompt"
import type { YouTubePlayer } from 'react-youtube'
import { getSessionColors, ThemeName } from '../types/theme'
import { AuthModal } from "./AuthModal"

type SessionType = "work" | "shortBreak" | "longBreak"

export const DEFAULT_DURATIONS = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
}

const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/watch?v=jfKfPfyJRdk"

export const PomodoroTimer: React.FC = () => {
    const [sessionType, setSessionType] = useState<SessionType>("work")
    const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATIONS.work)
    const [isActive, setIsActive] = useState(false)
    const [sessionCount, setSessionCount] = useState(0)
    const [showSettings, setShowSettings] = useState(false)
    const [showPausePrompt, setShowPausePrompt] = useState(false)
    const [youtubeUrl, setYoutubeUrl] = useState(DEFAULT_YOUTUBE_URL)
    const [player, setPlayer] = useState<YouTubePlayer | null>(null)
    const [durations, setDurations] = useState(DEFAULT_DURATIONS)
    const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4)
    const [pausePromptEnabled, setPausePromptEnabled] = useState(true)
    const [pausePromptDelay, setPausePromptDelay] = useState(2)
    const [currentTheme, setCurrentTheme] = useState('dark')
    const [soundsEnabled, setSoundsEnabled] = useState(true)
    const [youtubePlayerVisible, setYoutubePlayerVisible] = useState(true)
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [mockSession, setMockSession] = useState<null | { user: { name: string, email: string, image?: string, isPremium: boolean } }>(null);


    const handleSessionComplete = useCallback(() => {
        const newSessionCount = sessionCount + 1
        setSessionCount(newSessionCount)
        localStorage.setItem("sessionCount", newSessionCount.toString())
        localStorage.setItem("sessionDate", new Date().toDateString())

        let nextSessionType: SessionType
        if (sessionType === "work") {
            nextSessionType = newSessionCount > sessionsUntilLongBreak + 1 ? "longBreak" : "shortBreak";
        } else {
            nextSessionType = "work";
        }

        setSessionType(nextSessionType)
        setTimeLeft(durations[nextSessionType])
        playSound();
        if (sessionCount > sessionsUntilLongBreak + 1) {
            setSessionCount(0);
        }
    }, [sessionCount, sessionType, durations, sessionsUntilLongBreak])

    useEffect(() => {
        // Load all stored settings
        const storedDurations = localStorage.getItem("pomodoroDurations")
        if (storedDurations) {
            setDurations(JSON.parse(storedDurations))
        }

        const storedYoutubeUrl = localStorage.getItem("youtubeUrl")
        if (storedYoutubeUrl) {
            setYoutubeUrl(storedYoutubeUrl)
        }

        const storedPausePromptEnabled = localStorage.getItem("pausePromptEnabled")
        const storedPausePromptDelay = localStorage.getItem("pausePromptDelay")
        const storedSoundsEnabled = localStorage.getItem("soundsEnabled")
        const storedYoutubePlayerVisible = localStorage.getItem("youtubePlayerVisible")

        if (storedPausePromptEnabled !== null) {
            setPausePromptEnabled(JSON.parse(storedPausePromptEnabled))
        }
        if (storedPausePromptDelay !== null) {
            setPausePromptDelay(JSON.parse(storedPausePromptDelay))
        }
        if (storedSoundsEnabled !== null) {
            setSoundsEnabled(JSON.parse(storedSoundsEnabled))
        }
        if (storedYoutubePlayerVisible !== null) {
            setYoutubePlayerVisible(JSON.parse(storedYoutubePlayerVisible))
        }

        // Load and set theme
        const storedTheme = localStorage.getItem("theme") as ThemeName || "dark";
        setCurrentTheme(storedTheme);
        document.documentElement.setAttribute("data-theme", storedTheme);
    }, []); // Run once on mount

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            handleSessionComplete()
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, timeLeft, handleSessionComplete])

    useEffect(() => {
        let pauseTimeout: NodeJS.Timeout | null = null
        if (pausePromptEnabled && !isActive && timeLeft < durations[sessionType]) {
            pauseTimeout = setTimeout(
                () => {
                    setShowPausePrompt(true)
                    playSound2();
                },
                pausePromptDelay * 60 * 1000,
            )
        }
        return () => {
            if (pauseTimeout) clearTimeout(pauseTimeout)
        }
    }, [isActive, timeLeft, durations, sessionType, pausePromptEnabled, pausePromptDelay])

    const toggleTimer = () => {
        setIsActive(!isActive)
        if (player && isActive) {
            player.pauseVideo();
        } else if (player && !isActive) {
            player.playVideo();
        }
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(durations[sessionType])
        if (player) player.pauseVideo()
    }

    const skipSession = () => {
        handleSessionComplete()
    }

    const playSound = () => {
        if (soundsEnabled) {
            const audio = new Audio("/sounds/notification.mp3")
            void audio.play()
        }
    }

    const playSound2 = () => {
        if (soundsEnabled) {
            const audio = new Audio("/sounds/pausePrompt.mp3")
            void audio.play()
        }
    }

    const onPlayerReady = (event: { target: YouTubePlayer }) => {
        setPlayer(event.target)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleSettingsChange = (
        newDurations: typeof DEFAULT_DURATIONS,
        newYoutubeUrl: string,
        newSessionsUntilLongBreak: number,
        newPausePromptEnabled: boolean,
        newPausePromptDelay: number,
        newTheme: ThemeName,
        newSoundsEnabled: boolean,
        newYoutubePlayerVisible: boolean
    ) => {
        // Add debug log
        console.log("Setting theme to:", newTheme);

        // Check if current session duration has changed
        const currentDurationChanged = durations[sessionType] !== newDurations[sessionType];

        // Update all settings
        setDurations(newDurations)
        setYoutubeUrl(newYoutubeUrl)
        setSessionsUntilLongBreak(newSessionsUntilLongBreak)
        setPausePromptEnabled(newPausePromptEnabled)
        setPausePromptDelay(newPausePromptDelay)
        setCurrentTheme(newTheme)
        setSoundsEnabled(newSoundsEnabled)
        setYoutubePlayerVisible(newYoutubePlayerVisible)
        document.documentElement.setAttribute("data-theme", newTheme)

        // Save all settings to localStorage
        localStorage.setItem("pomodoroDurations", JSON.stringify(newDurations))
        localStorage.setItem("youtubeUrl", newYoutubeUrl)
        localStorage.setItem("sessionsUntilLongBreak", newSessionsUntilLongBreak.toString())
        localStorage.setItem("pausePromptEnabled", JSON.stringify(newPausePromptEnabled))
        localStorage.setItem("pausePromptDelay", JSON.stringify(newPausePromptDelay))
        localStorage.setItem("theme", newTheme)
        localStorage.setItem("soundsEnabled", JSON.stringify(newSoundsEnabled))
        localStorage.setItem("youtubePlayerVisible", JSON.stringify(newYoutubePlayerVisible))

        // Only reset timer if current session duration changed
        if (currentDurationChanged) {
            setTimeLeft(newDurations[sessionType])
        }

        setShowSettings(false)
    }

    const handlePausePromptAction = (action: string) => {
        switch (action) {
            case "resume":
                toggleTimer()
                break
            case "end":
                resetTimer()
                break
            case "extend":
                setTimeLeft((prevTime) => prevTime + 5 * 60)
                break
            case "reprompt":
                setTimeLeft((prevTime) => prevTime + 2 * 60)
                break
        }
        setShowPausePrompt(false)
    }

    // New function to handle session type change
    const changeSessionType = (newSessionType: SessionType) => {
        // Only change if it's a different session type
        if (newSessionType !== sessionType) {
            setSessionType(newSessionType)
            setTimeLeft(durations[newSessionType])
            setIsActive(false)
            if (player) player.pauseVideo()
        }
    }

    const mockLogin = (name: string, email: string) => {
        setMockSession({
            user: {
                name,
                email,
                isPremium: false
            }
        });
        setShowAuthModal(false);
    };

    const mockLogout = () => {
        setMockSession(null);
    };
    
    const currentThemeColors = getSessionColors(currentTheme as ThemeName, sessionType);

    
    const handlePurchasePremium = () => {
        
        console.log("Purchase premium clicked");
        
        setTimeout(() => {
            setMockSession(prev => prev ? {
                ...prev,
                user: {
                    ...prev.user,
                    isPremium: true
                }
            } : null);
            
            // Show a success message
            alert("Premium purchase successful! You now have access to all themes.");
        }, 2000);
    };

    return (
        <>
            <div className={`min-h-screen flex flex-col items-center justify-center p-4 pt-16 transition-all duration-700 
                ${currentThemeColors.background}`}>
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                    <h1 className={`text-4xl font-bold mb-2 bg-clip-text bg-gradient-to-r 
                        ${currentThemeColors.text}`}>
                        PomoPlayer
                    </h1>
                    <div className={`text-l font-medium mb-4 opacity-80 ${currentThemeColors.text}`}>
                        {sessionType === "work"
                            ? `Work Session ${Math.floor(sessionCount / 2) + 1}/${sessionsUntilLongBreak}`
                            : sessionType === "shortBreak"
                                ? "Short Break"
                                : "Long Break"}
                    </div>


                    <div className="absolute top-4 right-4">
                        {mockSession ? (
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    {mockSession.user.image ? (
                                        <div className="w-10 rounded-full">
                                            <img src={mockSession.user.image} alt={mockSession.user.name || "User"} />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content">
                                            {mockSession.user.name?.charAt(0) || mockSession.user.email?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </label>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><a onClick={() => setShowSettings(true)}>Settings</a></li>
                                    <li><a onClick={mockLogout}>Sign Out</a></li>
                                </ul>
                            </div>
                        ) : (
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setShowAuthModal(true)}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                    {/* Session type selector buttons */}
                    <div className="w-full flex flex-wrap justify-center gap-3 mb-10">
                        <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-2">
                            <button
                                className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200
                                    ${sessionType === "work" 
                                        ? "bg-primary text-primary-content hover:bg-primary-focus" 
                                        : "bg-base-200 text-base-content hover:bg-primary-focus"}`}
                                onClick={() => changeSessionType("work")}>
                                Work
                            </button>
                            <button
                                className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200
                                    ${sessionType === "shortBreak" 
                                        ? "bg-primary text-primary-content hover:bg-primary-focus" 
                                        : "bg-base-300 text-base-content hover:bg-primary hover:text-primary-content"}`}
                                onClick={() => changeSessionType("shortBreak")}>
                                Break
                            </button>
                            <button
                                className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200
                                    ${sessionType === "longBreak" 
                                        ? "bg-primary text-primary-content hover:bg-primary-focus" 
                                        : "bg-base-300 text-base-content hover:bg-primary hover:text-primary-content"}`}
                                onClick={() => changeSessionType("longBreak")}>
                                Long Break
                            </button>
                        </div>
                    </div>

                    <div className="relative mb-12">
                        <div className={`text-8xl md:text-9xl font-bold tracking-tight 
                            ${currentThemeColors.text}`}>
                            {formatTime(timeLeft)}
                        </div>
                        <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 flex space-x-2 text-sm opacity-60">
                        </div>
                    </div>

                    <div className="w-full flex flex-wrap justify-center gap-3 mb-10">
                        <button
                            className="w-full max-w-md mx-auto transform transition-all duration-200 px-9 py-4 rounded-lg font-semibold mb-2 bg-accent text-accent-content hover:bg-accent-focus hover:scale-105 active:scale-95"
                            onClick={toggleTimer}>
                            {isActive ? "Pause" : "Start"}
                        </button>

                        <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-2">
                            <button
                                className="w-full px-4 py-2 rounded-lg font-medium bg-neutral text-neutral-content shadow-sm border transform transition-all duration-200 hover:scale-105 active:scale-95
                                hover:bg-error hover:text-error-content hover:border-error"
                                onClick={resetTimer}>
                                Reset
                            </button>

                            <button
                                className="w-full px-4 py-2 rounded-lg font-medium bg-neutral text-neutral-content shadow-sm border transform transition-all duration-200 hover:scale-105 active:scale-95
                                hover:bg-warning hover:text-warning-content hover:border-warning"
                                onClick={skipSession}>
                                Skip
                            </button>

                            <button
                                className="w-full px-4 py-2 rounded-lg font-medium bg-neutral text-neutral-content shadow-sm border transform transition-all duration-200 hover:scale-105 active:scale-95
                                hover:bg-info hover:text-info-content hover:border-info"
                                onClick={() => setShowSettings(true)}>
                                Settings
                            </button>
                        </div>
                    </div>

                    <div className="w-full max-w-2xl rounded-t-xl overflow-hidden">
                        {youtubePlayerVisible && (
                            <YouTube
                                videoId={youtubeUrl.split("v=")[1]}
                                opts={{
                                    height: "100%",
                                    width: "100%",
                                    playerVars: {
                                        autoplay: isActive ? 1 : 0,
                                    },
                                }}
                                onReady={onPlayerReady}
                                className="w-full aspect-video"
                            />
                        )}
                    </div>
                </div>

                {showSettings && (
                    <Settings
                        durations={durations}
                        youtubeUrl={youtubeUrl}
                        sessionsUntilLongBreak={sessionsUntilLongBreak}
                        pausePromptEnabled={pausePromptEnabled}
                        pausePromptDelay={pausePromptDelay}
                        currentTheme={currentTheme as ThemeName}
                        soundsEnabled={soundsEnabled}
                        youtubePlayerVisible={youtubePlayerVisible}
                        mockSession={mockSession}
                        onPurchasePremium={handlePurchasePremium}
                        onSave={handleSettingsChange}
                        onClose={() => setShowSettings(false)}
                    />
                )}
                {showPausePrompt && <PausePrompt onAction={handlePausePromptAction} />}
                {showAuthModal && (
                    <AuthModal
                        onClose={() => setShowAuthModal(false)}
                        // For frontend development, add a mock login function
                        onLogin={mockLogin}
                    />
                )}
            </div>
        </>
    )
}

