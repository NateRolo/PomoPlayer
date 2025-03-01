"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import YouTube from "react-youtube"
import { Settings } from "./Settings"
import { PausePrompt } from "./PausePrompt"
import type { YouTubePlayer } from 'react-youtube';
import { themes, Theme } from '../types/theme'

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
    const [currentTheme, setCurrentTheme] = useState('default')

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
        if(sessionCount > sessionsUntilLongBreak + 1) {
            setSessionCount(0);
        }
    }, [sessionCount, sessionType, durations, sessionsUntilLongBreak])

    useEffect(() => {
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
        
        if (storedPausePromptEnabled !== null) {
            setPausePromptEnabled(JSON.parse(storedPausePromptEnabled))
        }
        if (storedPausePromptDelay !== null) {
            setPausePromptDelay(JSON.parse(storedPausePromptDelay))
        }

        const storedTheme = localStorage.getItem("theme")
        if (storedTheme) {
            setCurrentTheme(storedTheme)
        }
    }, []);

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
        const audio = new Audio("/sounds/notification.mp3")
        void audio.play()
    }

    const playSound2 = () => {
        const audio = new Audio("/sounds/pausePrompt.mp3")
        void audio.play()
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
        newTheme: string
    ) => {
        // Check if current session duration has changed
        const currentDurationChanged = durations[sessionType] !== newDurations[sessionType];

        // Update all settings
        setDurations(newDurations)
        setYoutubeUrl(newYoutubeUrl)
        setSessionsUntilLongBreak(newSessionsUntilLongBreak)
        setPausePromptEnabled(newPausePromptEnabled)
        setPausePromptDelay(newPausePromptDelay)
        setCurrentTheme(newTheme)

        // Save all settings to localStorage
        localStorage.setItem("pomodoroDurations", JSON.stringify(newDurations))
        localStorage.setItem("youtubeUrl", newYoutubeUrl)
        localStorage.setItem("sessionsUntilLongBreak", newSessionsUntilLongBreak.toString())
        localStorage.setItem("pausePromptEnabled", JSON.stringify(newPausePromptEnabled))
        localStorage.setItem("pausePromptDelay", JSON.stringify(newPausePromptDelay))
        localStorage.setItem("theme", newTheme)

        // Only reset timer if current session duration changed
        if (currentDurationChanged) {
            setTimeLeft(newDurations[sessionType])
        }

        setShowSettings(false)
    }

    const currentThemeColors = themes[currentTheme] || themes.default;

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

    return (
        <>
            <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-700 
                ${currentThemeColors[sessionType].background}`}>
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                    <h1 className={`text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r 
                        ${currentThemeColors[sessionType].gradient}`}>
                        PomoPlayer
                    </h1>

                    <div className={`text-l font-medium mb-8 opacity-80 ${currentThemeColors[sessionType].text}`}>
                        {sessionType === "work"
                            ? `Work Session ${Math.floor(sessionCount / 2) + 1}/${sessionsUntilLongBreak}`
                            : sessionType === "shortBreak"
                                ? "Short Break"
                                : "Long Break"}
                    </div>

                    <div className="relative mb-12">
                        <div className={`text-8xl md:text-9xl font-bold tracking-tight 
                            ${currentThemeColors[sessionType].text}`}>
                            {formatTime(timeLeft)}
                        </div>
                        <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 flex space-x-2 text-sm opacity-60">
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        <button
                            className={`transform transition-all duration-200 px-6 py-3 rounded-lg font-semibold
                                ${isActive
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : "bg-white hover:bg-gray-50 text-gray-800 shadow-sm border"}
                                hover:scale-105 active:scale-95`}
                            onClick={toggleTimer}>
                            {isActive ? "Pause" : "Start"}
                        </button>

                        <button
                            className="px-6 py-3 rounded-lg font-semibold bg-white hover:bg-gray-50 text-gray-600 shadow-sm border transform transition-all duration-200 hover:scale-105 active:scale-95"
                            onClick={resetTimer}>
                            Reset
                        </button>

                        <button
                            className="px-6 py-3 rounded-lg font-semibold bg-white hover:bg-gray-50 text-gray-600 shadow-sm border transform transition-all duration-200 hover:scale-105 active:scale-95"
                            onClick={skipSession}>
                            Skip
                        </button>

                        <button
                            className="px-6 py-3 rounded-lg font-semibold bg-white hover:bg-gray-50 text-gray-600 shadow-sm border transform transition-all duration-200 hover:scale-105 active:scale-95"
                            onClick={() => setShowSettings(true)}>
                            Settings
                        </button>
                    </div>

                    <div className="w-full max-w-3xl rounded-t-xl overflow-hidden">
                        <YouTube
                            videoId={youtubeUrl.split("v=")[1]}
                            opts={{
                                height: "395",
                                width: "100%",
                                playerVars: {
                                    autoplay: isActive ? 1 : 0,
                                },
                            }}
                            onReady={onPlayerReady}
                            className="w-full aspect-video"
                        />
                    </div>
                </div>

                {showSettings && (
                    <Settings
                        durations={durations}
                        youtubeUrl={youtubeUrl}
                        sessionsUntilLongBreak={sessionsUntilLongBreak}
                        pausePromptEnabled={pausePromptEnabled}
                        pausePromptDelay={pausePromptDelay}
                        currentTheme={currentTheme}
                        onSave={handleSettingsChange}
                        onClose={() => setShowSettings(false)}
                    />
                )}
                {showPausePrompt && <PausePrompt onAction={handlePausePromptAction} />}
            </div>
        </>
    )
}

