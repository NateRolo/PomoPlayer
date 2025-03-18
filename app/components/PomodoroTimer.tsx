"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import YouTube from "react-youtube"
import { Settings } from "./Settings"
import { PausePrompt } from "./PausePrompt"
import type { YouTubePlayer } from 'react-youtube'
import { ThemeName } from '../types/theme'
import { VideoLibrary } from "./VideoLibrary"


type SessionType = "work" | "shortBreak" | "longBreak"

export const DEFAULT_DURATIONS = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
}

const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/watch?v=jfKfPfyJRdk"

/**
 * MiniPlayer component provides compact controls when the main YouTube player is hidden
 */
const MiniPlayer: React.FC<{
    isPlaying: boolean;
    onTogglePlay: () => void;
    onShowPlayer: () => void;
    videoTitle: string;
}> = ({ isPlaying, onTogglePlay, onShowPlayer, videoTitle }) => {
    return (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-base-200 p-2 rounded-lg shadow-lg">
            <button 
                className={`btn btn-circle btn-sm ${isPlaying ? 'btn-primary' : 'btn-ghost'}`}
                onClick={onTogglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </button>
            <span className="text-sm font-medium">{videoTitle}</span>
            <button 
                className="btn btn-circle btn-sm btn-ghost"
                onClick={onShowPlayer}
                title="Show video player"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            </button>
        </div>
    );
};

/**
 * PomodoroTimer is the main component of the application, implementing the Pomodoro Technique
 * with customizable work/break intervals, YouTube integration, and theme support.
 */
export const PomodoroTimer: React.FC = () => {
    // Initialize with default values
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
    const [showVideoLibrary, setShowVideoLibrary] = useState(false)
    const [hasStarted, setHasStarted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [alarmAudio, setAlarmAudio] = useState<HTMLAudioElement | null>(null)

    /**
     * Initializes audio loop
     */
    useEffect(() => {
        const audio = new Audio("/sounds/notification2.mp3");
        audio.loop = true; // Make the alarm continuous
        setAlarmAudio(audio);
    }, []);

    /**
     * Handles the completion of a timer session, managing the transition between
     * work and break periods while tracking the session count.
     * 
     * HACK: player dependency is included in the callback to prevent stale closure,
     * but it doesn't actually affect the session completion logic
     */
    const handleSessionComplete = useCallback(() => {
        if(player) player.pauseVideo();
        setIsActive(false);
        
        let nextSessionType: SessionType;
        let newSessionCount = sessionCount;
        
        if (sessionType === "work") {
            newSessionCount = sessionCount + 1;
            nextSessionType = newSessionCount >= sessionsUntilLongBreak ? "longBreak" : "shortBreak";
            
            // Play sound and show alert
            if(alarmAudio) {
                alarmAudio.play();
            }
            alert("Time for a break!");
            if(alarmAudio) {
                alarmAudio.pause();
                alarmAudio.currentTime = 0;
            }
        } else if (sessionType === "longBreak") {
            // Reset cycle after long break
            newSessionCount = 0;
            nextSessionType = "work";
            
            if (alarmAudio) {
                alarmAudio.play();
            }
            alert("Let's focus!");
            if(alarmAudio) {
                alarmAudio.pause();
                alarmAudio.currentTime = 0;
            }
        } else {
            // After short break, return to work without incrementing count
            nextSessionType = "work";
            
            if (alarmAudio) {
                alarmAudio.play();
            }
            alert("Let's focus!");
            if(alarmAudio) {
                alarmAudio.pause();
                alarmAudio.currentTime = 0;
            }
        }
        
        // Update session state after alert is dismissed
        setSessionCount(newSessionCount);
        setSessionType(nextSessionType);
        setTimeLeft(durations[nextSessionType]);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionCount, sessionType, durations, sessionsUntilLongBreak, isActive, player])

    // Load persisted settings from localStorage on component mount
    useEffect(() => {
        const loadSettings = () => {
            // Load durations and update timeLeft based on current session type
            const storedDurations = localStorage.getItem("pomodoroDurations")
            if (storedDurations) {
                const parsedDurations = JSON.parse(storedDurations)
                setDurations(parsedDurations)
                // Update timeLeft based on current session type
                setTimeLeft(parsedDurations[sessionType])
            }

            const storedYoutubeUrl = localStorage.getItem("youtubeUrl")
            if (storedYoutubeUrl) {
                setYoutubeUrl(storedYoutubeUrl)
            }

            const storedSessionsUntilLongBreak = localStorage.getItem("sessionsUntilLongBreak")
            if (storedSessionsUntilLongBreak) {
                setSessionsUntilLongBreak(parseInt(storedSessionsUntilLongBreak))
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
            const storedTheme = localStorage.getItem("theme") as ThemeName || "dark"
            setCurrentTheme(storedTheme)
            document.documentElement.setAttribute("data-theme", storedTheme)
        }

        loadSettings()
    }, [sessionType]) // Add sessionType as dependency to update timeLeft when session changes

    // Update timeLeft when durations change
    useEffect(() => {
        setTimeLeft(durations[sessionType])
    }, [durations, sessionType])

    // Main timer countdown logic
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

    /**
     * Manages the pause prompt feature, showing a notification when:
     * 1. The timer has been started and then paused
     * 2. Pause prompts are enabled
     * 3. The timer is not at its initial duration
     */
    useEffect(() => {
        let pauseTimeout: NodeJS.Timeout | null = null
        if (pausePromptEnabled && !isActive && hasStarted && timeLeft < durations[sessionType]) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, timeLeft, durations, sessionType, pausePromptEnabled, pausePromptDelay, hasStarted])


    /**
     * Sets the title of the page to the remaining time left.
     */
    useEffect(() => {
        document.documentElement.setAttribute('title', formatTime(timeLeft));
    }, [timeLeft])

    /**
     * Toggles the timer state and synchronizes YouTube player playback
     * Also tracks initial timer start for pause prompt functionality
     */
    const toggleTimer = () => {
        if (!isActive && !hasStarted) {
            setHasStarted(true)
        }
        setIsActive(!isActive)
        
        // Only control video during work sessions
        if (player && sessionType === "work") {
            if (isActive) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        } else if (player && !isActive) {
            // Ensure video is paused during breaks
            player.pauseVideo();
        }
    }

    const resetTimer = () => {
        setIsActive(false)
        setHasStarted(false)
        setTimeLeft(durations[sessionType])
        if (player) player.pauseVideo()
    }

    const skipSession = () => {
        setHasStarted(false)
        handleSessionComplete()
    }

    const playSound2 = () => {
        if (soundsEnabled) {
            const audio = new Audio("/sounds/pausePrompt.mp3")
            audio.play().catch(console.error)
        }
    }

    const onPlayerReady = (event: { target: YouTubePlayer }) => {
        setPlayer(event.target)
        event.target.addEventListener('onStateChange', (stateEvent: { data: number }) => {
            setIsPlaying(stateEvent.data === 1)
        })
    }

    const formatTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
    
        const formattedTime = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    
        return hrs > 0 ? `${hrs}:${formattedTime}` : formattedTime;
    };
    

    /**
     * Handles settings updates and persists them to localStorage
     * If the current session duration changes, the timer is reset
     */
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

        // Persist settings to localStorage
        localStorage.setItem("pomodoroDurations", JSON.stringify(newDurations))
        localStorage.setItem("youtubeUrl", newYoutubeUrl)
        localStorage.setItem("sessionsUntilLongBreak", newSessionsUntilLongBreak.toString())
        localStorage.setItem("pausePromptEnabled", JSON.stringify(newPausePromptEnabled))
        localStorage.setItem("pausePromptDelay", JSON.stringify(newPausePromptDelay))
        localStorage.setItem("theme", newTheme)
        localStorage.setItem("soundsEnabled", JSON.stringify(newSoundsEnabled))
        localStorage.setItem("youtubePlayerVisible", JSON.stringify(newYoutubePlayerVisible))

        // Reset timer if duration changed
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

    const changeSessionType = (newSessionType: SessionType) => {
        // Only change if it's a different session type
        if (newSessionType !== sessionType) {
            setSessionType(newSessionType)
            setTimeLeft(durations[newSessionType])
            setIsActive(false)
            setHasStarted(false)
            if (player) player.pauseVideo()
        }
    }

    // Handle play/pause from mini player
    const handlePlayPause = () => {
        if (player) {
            if (isPlaying) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        }
    };

    return (
        <>
            {/* Main container with no scroll */}
            <div className="h-screen flex flex-col transition-all duration-700 
                ${currentThemeColors.background}">
                {/* Fixed height section for timer components - always visible */}
                <div className="w-full flex-none py-4">
                    <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 min-w-[320px]">
                        {/* Header */}
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-4xl font-bold bg-clip-text bg-gradient-to-r 
                                ${currentThemeColors.text} whitespace-nowrap">
                                PomoPlayer
                            </h1>
                            <div className="text-l font-medium opacity-80 ${currentThemeColors.text} whitespace-nowrap">
                                {sessionType === "work"
                                    ? `Work Session ${sessionCount + 1}/${sessionsUntilLongBreak}`
                                    : sessionType === "shortBreak"
                                        ? "Short Break"
                                        : "Long Break"}
                            </div>
                        </div>

                        {/* Session type selector */}
                        <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-2 min-w-[300px]">
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

                        {/* Timer display */}
                        <div className="relative my-2">
                            <div className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight 
                                ${currentThemeColors.text} whitespace-nowrap">
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        {/* Control buttons */}
                        <div className="w-full flex flex-col gap-2 max-w-md min-w-[300px]">
                            <button
                                className="btn btn-accent w-full transform transition-all duration-200 hover:scale-105 active:scale-95"
                                onClick={toggleTimer}>
                                {isActive ? "Pause" : "Start"}
                            </button>

                            <div className="grid grid-cols-3 gap-2">
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
                    </div>
                </div>

                {/* Scrollable section for YouTube player */}
                <div className="flex-1 overflow-y-auto">
                    <div className="w-full max-w-2xl mx-auto p-4">
                        <div className={`${youtubePlayerVisible 
                            ? "relative w-full aspect-video" 
                            : "hidden"}`}>
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
                                        // Only autoplay if it's a work session and timer is active
                                        autoplay: isActive && sessionType === "work" ? 1 : 0,
                                    },
                                }}
                                onReady={onPlayerReady}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
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
                    onSave={handleSettingsChange}
                    onClose={() => setShowSettings(false)}
                />
            )}
            {showPausePrompt && <PausePrompt onAction={handlePausePromptAction} currentTheme={currentTheme as ThemeName} />}
            
            {showVideoLibrary && (
                <VideoLibrary
                    onSelectVideo={(url) => {
                        setYoutubeUrl(url);
                        setShowVideoLibrary(false);
                        localStorage.setItem('youtubeUrl', url);
                    }}
                    onClose={() => setShowVideoLibrary(false)}
                />
            )}

            {!youtubePlayerVisible && (
                <MiniPlayer 
                    isPlaying={isPlaying}
                    onTogglePlay={handlePlayPause}
                    onShowPlayer={() => setYoutubePlayerVisible(true)}
                    videoTitle={player?.getVideoData()?.title || 'YouTube'}
                />
            )}

            
        </>
    )
}

