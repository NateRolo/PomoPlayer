"use client"

import type React from "react"
// Remove direct import of YouTube if no longer needed here
// import YouTube from "react-youtube"
import { Settings } from "./Settings"
import { PausePrompt } from "./PausePrompt"
// Remove unused imports
// import type { YouTubePlayer } from 'react-youtube' 
// import { ThemeName } from '../types/theme'
import { VideoLibrary } from "./VideoLibrary"
// Remove unused import
import { usePomodoroTimer /*, SessionType */ } from "../hooks/usePomodoroTimer" 
import { MiniPlayer } from "./PomodoroTimer/MiniPlayer"
import { Header } from "./PomodoroTimer/Header"
import { SessionSelector } from "./PomodoroTimer/SessionSelector"
import { TimerDisplay } from "./PomodoroTimer/TimerDisplay"
import { TimerControls } from "./PomodoroTimer/TimerControls"
import { ActionBar } from "./PomodoroTimer/ActionBar"
import { YouTubePlayerWrapper } from "./PomodoroTimer/YouTubePlayerWrapper"; 

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
        player, 
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
        toggleTheme,
        formatTime,
        keepRunningOnTransition,
        // handleSessionComplete, // Remove unused variable
    } = usePomodoroTimer();

    // Correct theme color logic
    const currentThemeColors = {
        background: currentTheme === 'light' ? 'bg-base-100' : 'bg-neutral', // Assuming dark uses neutral
        text: currentTheme === 'light' ? 'text-base-content' : 'text-neutral-content', // Use base-content for light theme
    };

    return (
        <>
            {/* Remove h-screen to allow natural page height and scrolling */}
            <div className={`min-h-screen flex flex-col transition-colors duration-500 ${currentThemeColors.background}`}>
                {/* Added min-h-screen as a replacement to ensure background covers at least the viewport height even if content is short */}
                <div className="w-full flex-none py-4">
                    {/* Controls Section */}
                    <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 min-w-[300px] px-4 sm:px-0">
                        {/* Added padding for very small screens */}
                        {/* Use Header component */}
                        <Header 
                            sessionType={sessionType} 
                            sessionCount={sessionCount} 
                            sessionsUntilLongBreak={sessionsUntilLongBreak} 
                            currentThemeColors={currentThemeColors} 
                        />

                        {/* Use SessionSelector component */}
                        <SessionSelector 
                            currentSessionType={sessionType} 
                            onChangeSessionType={changeSessionType}
                        />

                        {/* Use TimerDisplay component */}
                        <TimerDisplay 
                            timeLeft={timeLeft} 
                            formatTime={formatTime} 
                            currentThemeColors={currentThemeColors} 
                        />

                        {/* Use TimerControls component */}
                        <TimerControls 
                            isActive={isActive}
                            onToggleTimer={toggleTimer}
                            onResetTimer={resetTimer}
                            onSkipSession={skipSession}
                        />

                        {/* Use ActionBar component */}
                        <ActionBar
                            onShowSettings={() => setShowSettings(true)}
                            onShowVideoLibrary={() => setShowVideoLibrary(true)}
                            currentTheme={currentTheme}
                            onToggleTheme={toggleTheme}
                        />
                    </div>
                </div>

                {/* Video Section */}
                {/* Removed flex-1 overflow-y-auto as the whole page scrolls now */}
                {/* Added pb-16 or similar if MiniPlayer needs space */}
                <div className="w-full max-w-2xl mx-auto p-4 pb-16"> 
                    <YouTubePlayerWrapper
                        youtubeUrl={youtubeUrl}
                        isVisible={youtubePlayerVisible}
                        isActive={isActive}
                        sessionType={sessionType}
                        onPlayerReady={onPlayerReady}
                    />
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
                    keepRunningOnTransition={keepRunningOnTransition}
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

