"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import YouTube from "react-youtube"
import { Settings } from "./Settings"
import { PausePrompt } from "./PausePrompt"

type SessionType = "work" | "shortBreak" | "longBreak"

const DEFAULT_DURATIONS = {
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
    const [player, setPlayer] = useState<any>(null)
    const [durations, setDurations] = useState(DEFAULT_DURATIONS)

    useEffect(() => {
        const storedDurations = localStorage.getItem("pomodoroDurations")
        if (storedDurations) {
            setDurations(JSON.parse(storedDurations))
        }

        const storedYoutubeUrl = localStorage.getItem("youtubeUrl")
        if (storedYoutubeUrl) {
            setYoutubeUrl(storedYoutubeUrl)
        }

        const storedSessionCount = localStorage.getItem("sessionCount")
        const storedDate = localStorage.getItem("sessionDate")
        if (storedSessionCount && storedDate) {
            const today = new Date().toDateString()
            if (storedDate === today) {
                setSessionCount(Number.parseInt(storedSessionCount, 10))
            } else {
                localStorage.setItem("sessionCount", "0")
                localStorage.setItem("sessionDate", today)
            }
        }
    }, [])

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
    }, [isActive, timeLeft])

    useEffect(() => {
        let pauseTimeout: NodeJS.Timeout | null = null
        if (!isActive && timeLeft < durations[sessionType]) {
            pauseTimeout = setTimeout(
                () => {
                    setShowPausePrompt(true)
                },
                2 * 60 * 1000,
            ) // 2 minutes
        }
        return () => {
            if (pauseTimeout) clearTimeout(pauseTimeout)
        }
    }, [isActive, timeLeft, durations, sessionType])

    const handleSessionComplete = useCallback(() => {
        const newSessionCount = sessionCount + 1
        setSessionCount(newSessionCount)
        localStorage.setItem("sessionCount", newSessionCount.toString())
        localStorage.setItem("sessionDate", new Date().toDateString())

        let nextSessionType: SessionType
        if (sessionType === "work") {
            nextSessionType = newSessionCount % 4 === 0 ? "longBreak" : "shortBreak"
        } else {
            nextSessionType = "work"
        }

        setSessionType(nextSessionType)
        setTimeLeft(durations[nextSessionType])
        playSound()
    }, [sessionCount, sessionType, durations])

    const toggleTimer = () => {
        setIsActive(!isActive)
        if (player) {
            isActive ? player.pauseVideo() : player.playVideo()
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
        const audio = new Audio("/notification.mp3")
        audio.play()
    }

    const onPlayerReady = (event: { target: any }) => {
        setPlayer(event.target)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleSettingsChange = (newDurations: typeof DEFAULT_DURATIONS, newYoutubeUrl: string) => {
        setDurations(newDurations)
        setYoutubeUrl(newYoutubeUrl)
        localStorage.setItem("pomodoroDurations", JSON.stringify(newDurations))
        localStorage.setItem("youtubeUrl", newYoutubeUrl)
        setTimeLeft(newDurations[sessionType])
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
                // Do nothing, it will automatically reprompt
                break
        }
        setShowPausePrompt(false)
    }

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${sessionType === "work" ? "bg-red-100" : sessionType === "shortBreak" ? "bg-blue-100" : "bg-purple-100"
                }`}
        >
            <h1 className="text-4xl font-bold mb-8">Pomodoro Timer</h1>
            <div className="text-2xl mb-4">
                {sessionType === "work"
                    ? `Work Session ${Math.floor(sessionCount / 2) + 1}/4`
                    : sessionType === "shortBreak"
                        ? "Short Break"
                        : "Long Break"}
            </div>
            <div className="text-6xl font-bold mb-8">{formatTime(timeLeft)}</div>
            <div className="space-x-4 mb-8">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={toggleTimer}>
                    {isActive ? "Pause" : "Start"}
                </button>
                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={resetTimer}>
                    Reset
                </button>
                <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    onClick={skipSession}
                >
                    Skip
                </button>
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setShowSettings(true)}
                >
                    Settings
                </button>
            </div>
            <div className="w-full max-w-md">
                <YouTube
                    videoId={youtubeUrl.split("v=")[1]}
                    opts={{
                        height: "195",
                        width: "320",
                        playerVars: {
                            autoplay: isActive ? 1 : 0,
                        },
                    }}
                    onReady={onPlayerReady}
                />
            </div>
            {showSettings && (
                <Settings
                    durations={durations}
                    youtubeUrl={youtubeUrl}
                    onSave={handleSettingsChange}
                    onClose={() => setShowSettings(false)}
                />
            )}
            {showPausePrompt && <PausePrompt onAction={handlePausePromptAction} />}
        </div>
    )
}

