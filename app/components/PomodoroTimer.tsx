"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import YouTube from "react-youtube"
import { Settings } from "./Settings"
import { PausePrompt } from "./PausePrompt"
import type { YouTubePlayer } from 'react-youtube'
import { getSessionColors, ThemeName } from '../types/theme'
import { AuthModal } from "./AuthModal"
import { VideoLibrary } from "./VideoLibrary"
import { useAuth } from '../components/contexts/AuthContext'
import { useUserSettings } from '../hooks/useUserSettings'

type SessionType = "work" | "shortBreak" | "longBreak"

export const DEFAULT_DURATIONS = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
}

// WHEN USER LOGS OUT THE PAGE SHOULD CHANGE TO DEFAULT THEME
// when user sets work sessions above 6 it doesn't function as intended
// include user setting that sets dark mode during runtime 

const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/watch?v=jfKfPfyJRdk"

export const PomodoroTimer: React.FC = () => {
    const { user, signOut, isPremium, setPremiumStatus } = useAuth()
    const { settings, saveSettings, loading: settingsLoading } = useUserSettings()
    const [sessionType, setSessionType] = useState<SessionType>("work")
    const [timeLeft, setTimeLeft] = useState(settings.durations.work)
    const [isActive, setIsActive] = useState(false)
    const [sessionCount, setSessionCount] = useState(0)
    const [showSettings, setShowSettings] = useState(false)
    const [showPausePrompt, setShowPausePrompt] = useState(false)
    const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl)
    const [player, setPlayer] = useState<YouTubePlayer | null>(null)
    const [durations, setDurations] = useState(settings.durations)
    const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(settings.sessionsUntilLongBreak)
    const [pausePromptEnabled, setPausePromptEnabled] = useState(settings.pausePromptEnabled)
    const [pausePromptDelay, setPausePromptDelay] = useState(settings.pausePromptDelay)
    const [currentTheme, setCurrentTheme] = useState('dark')
    const [soundsEnabled, setSoundsEnabled] = useState(settings.soundsEnabled)
    const [youtubePlayerVisible, setYoutubePlayerVisible] = useState(settings.youtubePlayerVisible)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [showVideoLibrary, setShowVideoLibrary] = useState(false)

    const handleSessionComplete = useCallback(() => {
        let nextSessionType: SessionType;
        let newSessionCount = sessionCount;
        
        if (sessionType === "work") {
            // Increment work session count
            newSessionCount = sessionCount + 1;
            
            // Check if we've completed the required number of work sessions for a long break
            if (newSessionCount >= sessionsUntilLongBreak) {
                nextSessionType = "longBreak";
            } else {
                nextSessionType = "shortBreak";
            }
        } else if (sessionType === "longBreak") {
            // After a long break, reset the session count and start a new work session
            newSessionCount = 0;
            nextSessionType = "work";
        } else {
            // After a short break, start a new work session
            // Don't increment the count here as it should only increment after work sessions
            nextSessionType = "work";
        }
        
        // Update state
        setSessionCount(newSessionCount);
        setSessionType(nextSessionType);
        setTimeLeft(durations[nextSessionType]);
        playSound();
        setIsActive(false);
        if(player) player.pauseVideo();
    }, [sessionCount, sessionType, durations, sessionsUntilLongBreak, isActive, player])

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

    const handleAuthModalClose = () => {
        setShowAuthModal(false);
    };
    
    const handleSignOut = async () => {
        await signOut();
    };
    
    const handlePurchasePremium = async () => {
        console.log("Purchase premium clicked");
        
        setTimeout(async () => {
            await setPremiumStatus(true);
            
            // Show a success message
            alert("Premium purchase successful! You now have access to all themes.");
        }, 2000);
    };

    const currentThemeColors = getSessionColors(currentTheme as ThemeName, sessionType);

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
                            ? `Work Session ${sessionCount + 1}/${sessionsUntilLongBreak}`
                            : sessionType === "shortBreak"
                                ? "Short Break"
                                : "Long Break"}
                    </div>

                    <div className="absolute top-4 right-4">
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    {user.user_metadata?.avatar_url ? (
                                        <div className="w-10 rounded-full">
                                            <img src={user.user_metadata.avatar_url} alt={user.user_metadata?.full_name || "User"} />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary grid place-items-center text-primary-content font-medium text-lg">
                                            <span className="inline-block transform translate-y-0">
                                                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                                            </span>
                                        </div>
                                    )}
                                </label>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><a onClick={() => setShowSettings(true)}>Settings</a></li>
                                    <li><a onClick={signOut}>Sign Out</a></li>
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
                                className={`btn w-full ${sessionType === "work" 
                                    ? "btn-primary" 
                                    : "btn-ghost hover:btn-primary"}`}
                                onClick={() => changeSessionType("work")}>
                                Work
                            </button>
                            <button
                                className={`btn w-full ${sessionType === "shortBreak"
                                    ? "btn-primary"
                                    : "btn-ghost hover:btn-primary"}`} 
                                onClick={() => changeSessionType("shortBreak")}>
                                Break
                            </button>
                            <button
                                className={`btn w-full ${sessionType === "longBreak"
                                    ? "btn-primary"
                                    : "btn-ghost hover:btn-primary"}`}
                                onClick={() => changeSessionType("longBreak")}>
                                Long Break
                            </button>
                        </div>
                    </div>

                    <div className="relative mb-10">
                        <div className={`text-8xl md:text-9xl font-bold tracking-tight 
                            ${currentThemeColors.text}`}>
                            {formatTime(timeLeft)}
                        </div>
                        <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 flex space-x-2 text-sm opacity-60">
                        </div>
                    </div>

                    <div className="w-full flex flex-wrap justify-center gap-3 mb-10">
                        <button
                            className="btn btn-accent w-full max-w-md mx-auto mb-2 py-4 transform transition-all duration-200 hover:scale-105 active:scale-95"
                            onClick={toggleTimer}>
                            {isActive ? "Pause" : "Start"}
                        </button>

                        <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-2">
                            <button
                                className="btn btn-neutral w-full hover:btn-secondary transform transition-all duration-200 hover:scale-105 active:scale-95"
                                onClick={resetTimer}>
                                Reset Timer
                            </button>

                            <button
                                className="btn btn-neutral w-full hover:btn-warning transform transition-all duration-200 hover:scale-105 active:scale-95"
                                onClick={skipSession}>
                                Skip Session
                            </button>

                            <button
                                className="btn btn-neutral w-full hover:btn-info transform transition-all duration-200 hover:scale-105 active:scale-95"
                                onClick={() => setShowSettings(true)}>
                                Settings
                            </button>
                            
                        </div>
                    </div>

                    <div className="w-full max-w-2xl rounded-t-xl overflow-hidden">
                        {youtubePlayerVisible && (
                            <div className="mt-4 relative">
                                <div className="absolute top-2 right-2 z-10">
                                    <button
                                        className="btn btn-sm btn-ghost bg-base-100 bg-opacity-70"
                                        onClick={() => setShowVideoLibrary(true)}
                                        title="Video Library"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                        </svg>
                                    </button>
                                </div>
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
                            </div>
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
                        isPremium={isPremium}
                        onSave={handleSettingsChange}
                        onClose={() => setShowSettings(false)}
                        onPurchasePremium={handlePurchasePremium}
                        onShowAuthModal={() => {
                            setShowSettings(false);
                            setShowAuthModal(true);
                        }}
                    />
                )}
                {showPausePrompt && <PausePrompt onAction={handlePausePromptAction} currentTheme={currentTheme as ThemeName} />}
                {showAuthModal && (
                    <AuthModal
                        onClose={handleAuthModalClose}
                    />
                )}
                {showVideoLibrary && (
                    <VideoLibrary
                        onSelectVideo={(url) => {
                            setYoutubeUrl(url);
                            setShowVideoLibrary(false);
                            // Save to localStorage
                            localStorage.setItem('youtubeUrl', url);
                        }}
                        onClose={() => setShowVideoLibrary(false)}
                    />
                )}
            </div>
        </>
    )
}

