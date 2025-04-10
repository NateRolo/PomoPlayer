"use client"

import type React from "react"
import YouTube from "react-youtube"
import { Settings } from "./Settings"
import { PausePrompt } from "./PausePrompt"
import type { YouTubePlayer } from 'react-youtube'
import { ThemeName } from '../types/theme'
import { VideoLibrary } from "./VideoLibrary"
import { usePomodoroTimer, SessionType } from "../hooks/usePomodoroTimer"
import { MiniPlayer } from "./PomodoroTimer/MiniPlayer"

/**
 * PomodoroTimer is the main component of the application, implementing the Pomodoro Technique
 * with customizable work/break intervals, YouTube integration, and theme support.
 */
export const PomodoroTimer: React.FC = () => {
    // Use the custom hook to get state and actions
    const {
        timeLeft,
        sessionType,
        isActive,
        sessionCount,
        sessionsUntilLongBreak,
        durations,
        currentTheme,
        soundsEnabled,
        pausePromptEnabled,
        pausePromptDelay,
        youtubeUrl,
        youtubePlayerVisible,
        isYouTubePlaying,
        player, // May not be needed directly in the component after further refactoring
        showSettings,
        showPausePrompt,
        showVideoLibrary,
        toggleTimer,
        resetTimer,
        skipSession,
        changeSessionType,
        handleSettingsChange,
        handlePausePromptAction,
        setShowSettings,
        setShowVideoLibrary,
        setYoutubeUrl,
        setYoutubePlayerVisible,
        onPlayerReady,
        handleYouTubePlayPause,
        formatTime,
    } = usePomodoroTimer();

    // TODO: Define currentThemeColors based on currentTheme 
    // This logic should ideally live elsewhere (e.g., theme context or utility)
    const currentThemeColors = {
        background: currentTheme === 'light' ? 'bg-base-100' : 'bg-neutral',
        text: currentTheme === 'light' ? 'text-neutral-content' : 'text-neutral-content',
        // Add other color mappings as needed
    };

    return (
        <>
            {/* Main container */}
            {/* Use state/values from the hook */}
            <div className={`h-screen flex flex-col transition-all duration-700 ${currentThemeColors.background}`}>
                {/* Fixed height section */}
                <div className="w-full flex-none py-4">
                    <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 min-w-[320px]">
                        {/* Header */}
                        <div className="flex flex-col items-center gap-2">
                            <h1 className={`text-4xl font-bold bg-clip-text bg-gradient-to-r ${currentThemeColors.text} whitespace-nowrap`}>
                                PomoPlayer
                            </h1>
                            <div className={`text-l font-medium opacity-80 ${currentThemeColors.text} whitespace-nowrap`}>
                                {sessionType === "work"
                                    ? `Focus Session ${sessionCount + 1}/${sessionsUntilLongBreak}`
                                    : sessionType === "shortBreak"
                                        ? "Short Break"
                                        : "Long Break"}
                            </div>
                        </div>

                        {/* Session type selector */}
                        <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-2 min-w-[300px]">
                            {/* Use changeSessionType from hook */}
                            <button
                                className={`btn w-full ${sessionType === "work" ? "btn-primary" : "btn-ghost hover:btn-primary"}`}
                                onClick={() => changeSessionType("work")}>
                                Focus
                            </button>
                            <button
                                className={`btn w-full ${sessionType === "shortBreak" ? "btn-primary" : "btn-ghost hover:btn-primary"}`}
                                onClick={() => changeSessionType("shortBreak")}>
                                Break
                            </button>
                            <button
                                className={`btn w-full ${sessionType === "longBreak" ? "btn-primary" : "btn-ghost hover:btn-primary"}`}
                                onClick={() => changeSessionType("longBreak")}>
                                Long Break
                            </button>
                        </div>

                        {/* Timer display */}
                        <div className="relative my-2">
                             {/* Use formatTime and timeLeft from hook */} 
                            <div className={`text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight ${currentThemeColors.text} whitespace-nowrap`}>
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        {/* Control buttons */}
                        <div className="w-full flex flex-col gap-2 max-w-md min-w-[300px]">
                            {/* Use toggleTimer and isActive from hook */} 
                            <button
                                className="btn btn-accent w-full transform transition-all duration-200 hover:scale-105 active:scale-95"
                                onClick={toggleTimer}>
                                {isActive ? "Pause" : "Start"}
                            </button>

                            <div className="grid grid-cols-2 gap-2">
                                {/* Use resetTimer from hook */} 
                                <button
                                    className="btn btn-neutral hover:btn-secondary transform transition-all duration-200 hover:scale-105 active:scale-95"
                                    onClick={resetTimer}>
                                    Reset Timer
                                </button>
                                 {/* Use skipSession from hook */} 
                                <button
                                    className="btn btn-neutral hover:btn-warning transform transition-all duration-200 hover:scale-105 active:scale-95"
                                    onClick={skipSession}>
                                    Skip Session
                                </button>
                                {/* Use setShowSettings from hook */} 
                                <button
                                    className="btn btn-neutral hover:btn-info transform transition-all duration-200 hover:scale-105 active:scale-95"
                                    onClick={() => setShowSettings(true)}>
                                    Settings
                                </button>
                                {/* Use setShowVideoLibrary from hook */} 
                                <button
                                    className="btn btn-neutral hover:btn-success transform transition-all duration-200 hover:scale-105 active:scale-95"
                                    onClick={() => setShowVideoLibrary(true)}>
                                    Videos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable section for YouTube player */}
                <div className="flex-1 overflow-y-auto">
                    <div className="w-full max-w-2xl mx-auto p-4">
                         {/* Use youtubePlayerVisible, youtubeUrl, isActive, sessionType, onPlayerReady from hook */} 
                        <div className={`${youtubePlayerVisible ? "relative w-full aspect-video" : "hidden"}`}>
                            <YouTube
                                videoId={youtubeUrl.split("v=")[1]} // Consider moving URL parsing to hook or player component
                                opts={{
                                    height: "100%",
                                    width: "100%",
                                    playerVars: {
                                        // Autoplay logic might be simplified/moved if hook controls player state
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

            {/* Modals - Use state and handlers from hook */} 
            {showSettings && (
                <Settings
                    // Pass necessary props from hook state
                    durations={durations}
                    youtubeUrl={youtubeUrl}
                    sessionsUntilLongBreak={sessionsUntilLongBreak}
                    pausePromptEnabled={pausePromptEnabled}
                    pausePromptDelay={pausePromptDelay}
                    currentTheme={currentTheme}
                    soundsEnabled={soundsEnabled}
                    youtubePlayerVisible={youtubePlayerVisible}
                    // Pass handlers from hook
                    onSave={handleSettingsChange}
                    onClose={() => setShowSettings(false)}
                />
            )}
            {showPausePrompt && (
                <PausePrompt 
                    onAction={handlePausePromptAction} 
                    currentTheme={currentTheme} 
                />
            )}
            {showVideoLibrary && (
                <VideoLibrary
                    onSelectVideo={(url) => {
                        // Use setYoutubeUrl from hook
                        setYoutubeUrl(url); 
                        setShowVideoLibrary(false);
                        // Persisting URL now happens within handleSettingsChange or dedicated hook logic
                        // localStorage.setItem('youtubeUrl', url); 
                    }}
                    onClose={() => setShowVideoLibrary(false)}
                />
            )}

            {/* Mini Player - Use state and handlers from hook */} 
            {!youtubePlayerVisible && (
                <MiniPlayer 
                    isPlaying={isYouTubePlaying} // Use dedicated YT playing state
                    onTogglePlay={handleYouTubePlayPause} // Use dedicated YT handler
                    onShowPlayer={() => setYoutubePlayerVisible(true)} // Use setter from hook
                    videoTitle={player?.getVideoData()?.title || 'YouTube'} // Still needs player instance from hook
                />
            )}
        </>
    )
}

