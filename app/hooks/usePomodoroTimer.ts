"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { YouTubePlayer } from 'react-youtube'
import { ThemeName } from '@/app/types/theme' // Assuming this path is correct
import toast from 'react-hot-toast'

export type SessionType = "work" | "shortBreak" | "longBreak"

export const DEFAULT_DURATIONS = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
}

// Default sound files
const DEFAULT_SESSION_END_SOUND = "sessionEndDefault.mp3";
const DEFAULT_PAUSE_PROMPT_SOUND = "pausePromptDefault.mp3";

const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/watch?v=jfKfPfyJRdk"

export function usePomodoroTimer() {
    const [sessionType, setSessionType] = useState<SessionType>("work")
    const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATIONS.work)
    const [isActive, setIsActive] = useState(false)
    const [sessionCount, setSessionCount] = useState(0)
    const [showSettings, setShowSettings] = useState(false) // Keep UI state separate? Maybe move later.
    const [showPausePrompt, setShowPausePrompt] = useState(false) // Keep UI state separate? Maybe move later.
    const [youtubeUrl, setYoutubeUrl] = useState(DEFAULT_YOUTUBE_URL)
    const [player, setPlayer] = useState<YouTubePlayer | null>(null)
    const [durations, setDurations] = useState(DEFAULT_DURATIONS)
    const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4)
    const [pausePromptEnabled, setPausePromptEnabled] = useState(true)
    const [pausePromptDelay, setPausePromptDelay] = useState(2) // minutes
    const [currentTheme, setCurrentTheme] = useState<ThemeName>('dark')
    const [soundsEnabled, setSoundsEnabled] = useState(true)
    // State for selected sound files
    const [sessionEndSound, setSessionEndSound] = useState(DEFAULT_SESSION_END_SOUND);
    const [pausePromptSound, setPausePromptSound] = useState(DEFAULT_PAUSE_PROMPT_SOUND);
    const [youtubePlayerVisible, setYoutubePlayerVisible] = useState(true) // Keep UI state separate? Maybe move later.
    const [showVideoLibrary, setShowVideoLibrary] = useState(false) // Keep UI state separate? Maybe move later.
    const [hasStarted, setHasStarted] = useState(false) // Track if timer was ever started in the current session
    const [isYouTubePlaying, setIsYouTubePlaying] = useState(false)
    const [keepRunningOnTransition, setKeepRunningOnTransition] = useState(false)
    const soundIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // --- Sound Effects ---
    const playAlarm = useCallback(() => {
        if (soundsEnabled) {
            // Create and play the selected session end sound
            const audio = new Audio(`/sounds/${sessionEndSound}`);
            audio.play().catch(err => console.error(`Error playing sound ${sessionEndSound}:`, err));
        }
    }, [soundsEnabled, sessionEndSound]);

    const playPausePromptSound = useCallback(() => {
        if (soundsEnabled) {
            // Create and play the selected pause prompt sound
            const audio = new Audio(`/sounds/${pausePromptSound}`);
            audio.play().catch(err => console.error(`Error playing sound ${pausePromptSound}:`, err));
        }
    }, [soundsEnabled, pausePromptSound]);

    // --- Core Timer Logic ---
    const handleSessionComplete = useCallback((options?: { playSound?: boolean, showAlert?: boolean }) => {
        const playSound = options?.playSound ?? true;
        const showAlert = options?.showAlert ?? true;

        // Only pause player and timer if keepRunningOnTransition is false
        if (!keepRunningOnTransition) {
            if (player) player.pauseVideo();
            setIsActive(false);
            setHasStarted(false); // Only reset start tracker if timer stops
        } else {
             // If keepRunning is true, we still might want to pause the player
             // depending on the next session type (e.g., pause during breaks)
             // We'll determine the next session type first.
        }

        // Determine next session
        let nextSessionType: SessionType;
        let newSessionCount = sessionCount;
        let alertMessage: string;
        
        if (sessionType === "work") {
            newSessionCount = sessionCount + 1;
            nextSessionType = newSessionCount >= sessionsUntilLongBreak ? "longBreak" : "shortBreak";
            alertMessage = nextSessionType === "longBreak" ? "Time for a long break!" : "Time for a short break!";
        } else { // shortBreak or longBreak
            if (sessionType === "longBreak") newSessionCount = 0; // Reset cycle
            nextSessionType = "work";
            alertMessage = "Time to focus!";
        }

        // If keepRunning is true, handle player state for the *next* session
        if (keepRunningOnTransition && player) {
            if (nextSessionType === "work") {
                // If transitioning TO a work session, ensure video plays
                player.playVideo();
            } else {
                // If transitioning TO a break session, pause video
                player.pauseVideo();
            }
        }

        // Conditionally play sound and show toast
        if (playSound) {
            playAlarm();
        }
        
        if (showAlert) {
            toast(alertMessage);
        }

        // Update session state
        setSessionCount(newSessionCount);
        setSessionType(nextSessionType);
        setTimeLeft(durations[nextSessionType]);
        
        // Ensure isActive is true if keepRunning
        if (keepRunningOnTransition) {
            setIsActive(true); 
            setHasStarted(true);
        } 

    }, [player, sessionCount, sessionType, durations, sessionsUntilLongBreak, playAlarm, keepRunningOnTransition]); 

    // --- Settings Persistence ---
    useEffect(() => {
        // Load settings from localStorage
        const storedDurations = localStorage.getItem("pomodoroDurations");
        if (storedDurations) setDurations(JSON.parse(storedDurations));
        
        const storedUrl = localStorage.getItem("youtubeUrl");
        if (storedUrl) setYoutubeUrl(storedUrl);

        const storedUntilLongBreak = localStorage.getItem("sessionsUntilLongBreak");
        if (storedUntilLongBreak) setSessionsUntilLongBreak(parseInt(storedUntilLongBreak));
        
        const storedPauseEnabled = localStorage.getItem("pausePromptEnabled");
        if (storedPauseEnabled !== null) setPausePromptEnabled(JSON.parse(storedPauseEnabled));
        
        const storedPauseDelay = localStorage.getItem("pausePromptDelay");
        if (storedPauseDelay !== null) setPausePromptDelay(parseInt(storedPauseDelay));

        const storedSoundsEnabled = localStorage.getItem("soundsEnabled");
        if (storedSoundsEnabled !== null) setSoundsEnabled(JSON.parse(storedSoundsEnabled));

        // Load selected sounds
        const storedSessionEndSound = localStorage.getItem("sessionEndSound");
        if (storedSessionEndSound) setSessionEndSound(storedSessionEndSound);
        const storedPausePromptSound = localStorage.getItem("pausePromptSound");
        if (storedPausePromptSound) setPausePromptSound(storedPausePromptSound);

        const storedPlayerVisible = localStorage.getItem("youtubePlayerVisible");
        if (storedPlayerVisible !== null) setYoutubePlayerVisible(JSON.parse(storedPlayerVisible));
        
        const storedKeepRunning = localStorage.getItem("keepRunningOnTransition");
        if (storedKeepRunning !== null) setKeepRunningOnTransition(JSON.parse(storedKeepRunning)); // <-- Load new setting
        
        const storedTheme = localStorage.getItem("theme") as ThemeName || "dark";
        setCurrentTheme(storedTheme);
        document.documentElement.setAttribute("data-theme", storedTheme);

        // Set initial timeLeft based on potentially loaded durations and default sessionType
        setTimeLeft(storedDurations ? JSON.parse(storedDurations)["work"] : DEFAULT_DURATIONS.work);
    }, []);

    // Update timeLeft immediately if durations change (e.g., from settings) AND the timer isn't active
     useEffect(() => {
        if (!isActive) {
            setTimeLeft(durations[sessionType]);
        }
    }, [durations, sessionType]);

    // --- Timer Countdown Effect ---
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            handleSessionComplete(); 
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    // Ensure handleSessionComplete is stable or included if its identity changes
    }, [isActive, timeLeft, handleSessionComplete]);

    // --- Pause Prompt Effect ---
    useEffect(() => {
        // Clear previous timeouts/intervals if settings change or timer state changes
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
        setShowPausePrompt(false); // Hide prompt when dependencies change

        if (pausePromptEnabled && !isActive && hasStarted && timeLeft < durations[sessionType]) {
            pauseTimeoutRef.current = setTimeout(() => {
                setShowPausePrompt(true);
                playPausePromptSound();
                // Store interval reference in ref
                soundIntervalRef.current = setInterval(playPausePromptSound, 5000); // Play sound every 5s
            }, pausePromptDelay * 60 * 1000); // Delay converted to ms
        }

        // Cleanup function for this effect
        return () => {
            if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
            if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
            // No need to setShowPausePrompt(false) here, as it's handled above
        };
    }, [isActive, hasStarted, timeLeft, durations, sessionType, pausePromptEnabled, pausePromptDelay, playPausePromptSound]);

    // --- Document Title Effect ---
     useEffect(() => {
        const format = (seconds: number): string => {
            const hrs = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            const formattedTime = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
            return hrs > 0 ? `${hrs}:${formattedTime}` : formattedTime;
        };
        document.title = `${format(timeLeft)} - ${sessionType === 'work' ? 'Focus' : 'Break'} | PomoPlayer`;
    }, [timeLeft, sessionType]);


    // --- Control Functions ---
    const toggleTimer = useCallback(() => {
        if (!isActive && !hasStarted) {
            setHasStarted(true); // Mark as started only on first play press
        }
        const newIsActive = !isActive;
        setIsActive(newIsActive);

        // Control YouTube player only during work sessions
        if (player && sessionType === "work") {
            if (newIsActive) {
                player.playVideo();
            } else {
                player.pauseVideo();
            }
        } else if (player && !newIsActive) {
             // Always pause video when timer pauses, regardless of session type
            player.pauseVideo();
        }
    }, [isActive, hasStarted, player, sessionType]);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setHasStarted(false);
        setTimeLeft(durations[sessionType]);
        if (player) player.pauseVideo();
        // Clear pause prompt state
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
        setShowPausePrompt(false);
    }, [durations, sessionType, player]);

    const skipSession = useCallback(() => {
        setHasStarted(false); // Reset start tracker for next session
        // Call with sound and alert explicitly disabled
        handleSessionComplete({ playSound: false, showAlert: false }); 
         // Clear pause prompt state
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
        setShowPausePrompt(false);
    }, [handleSessionComplete]);

    const changeSessionType = useCallback((newSessionType: SessionType) => {
        if (newSessionType !== sessionType) {
            setIsActive(false);
            setHasStarted(false);
            setSessionType(newSessionType);
            setTimeLeft(durations[newSessionType]); // Set time for the *new* session type
            if (player) player.pauseVideo();
             // Clear pause prompt state
            if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
            if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
            setShowPausePrompt(false);
        }
    }, [sessionType, durations, player]);


    // --- Settings Handler ---
     const handleSettingsChange = useCallback((
        newDurations: typeof DEFAULT_DURATIONS,
        newYoutubeUrl: string,
        newSessionsUntilLongBreak: number,
        newPausePromptEnabled: boolean,
        newPausePromptDelay: number,
        newTheme: ThemeName,
        newSoundsEnabled: boolean,
        // Add sound selection params
        newSessionEndSound: string,
        newPausePromptSound: string,
        newYoutubePlayerVisible: boolean,
        newKeepRunningOnTransition: boolean // <-- Add new parameter
    ) => {
        const currentDuration = durations[sessionType];
        const newDuration = newDurations[sessionType];
        const durationChanged = currentDuration !== newDuration;

        // Update state
        setDurations(newDurations);
        setYoutubeUrl(newYoutubeUrl);
        setSessionsUntilLongBreak(newSessionsUntilLongBreak);
        setPausePromptEnabled(newPausePromptEnabled);
        setPausePromptDelay(newPausePromptDelay);
        setCurrentTheme(newTheme);
        setSoundsEnabled(newSoundsEnabled);
        // Update sound state
        setSessionEndSound(newSessionEndSound);
        setPausePromptSound(newPausePromptSound);
        setYoutubePlayerVisible(newYoutubePlayerVisible);
        setKeepRunningOnTransition(newKeepRunningOnTransition); // <-- Update state
        document.documentElement.setAttribute("data-theme", newTheme);

        // Persist settings
        localStorage.setItem("pomodoroDurations", JSON.stringify(newDurations));
        localStorage.setItem("youtubeUrl", newYoutubeUrl);
        localStorage.setItem("sessionsUntilLongBreak", newSessionsUntilLongBreak.toString());
        localStorage.setItem("pausePromptEnabled", JSON.stringify(newPausePromptEnabled));
        localStorage.setItem("pausePromptDelay", newPausePromptDelay.toString()); // Store as string
        localStorage.setItem("theme", newTheme);
        localStorage.setItem("soundsEnabled", JSON.stringify(newSoundsEnabled));
        // Persist sounds
        localStorage.setItem("sessionEndSound", newSessionEndSound);
        localStorage.setItem("pausePromptSound", newPausePromptSound);
        localStorage.setItem("youtubePlayerVisible", JSON.stringify(newYoutubePlayerVisible));
        localStorage.setItem("keepRunningOnTransition", JSON.stringify(newKeepRunningOnTransition)); // <-- Persist new setting

        // Reset timer state ONLY if the duration for the CURRENT session type changed and timer inactive
        if (durationChanged && !isActive) {
            setTimeLeft(newDuration);
            setHasStarted(false); 
        } 

        setShowSettings(false); // Close settings modal
    }, [sessionType, isActive, durations]);

    // --- NEW: Theme Toggle Function (Option 2 Logic) ---
    const toggleTheme = useCallback(() => {
        let newTheme: ThemeName;
        if (currentTheme === 'light') {
            newTheme = 'dark';
        } else if (currentTheme === 'dark') {
            newTheme = 'light';
        } else {
            // If current theme is neither light nor dark, revert to light
            newTheme = 'light'; 
        }
        setCurrentTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    }, [currentTheme]);

    // --- Pause Prompt Action Handler ---
    const handlePausePromptAction = useCallback((action: string) => {
        // Clear current sound interval first
        if (soundIntervalRef.current) {
            clearInterval(soundIntervalRef.current);
            soundIntervalRef.current = null;
        }
         if (pauseTimeoutRef.current) { // Also clear the initial delay timeout if prompt is acted upon
            clearTimeout(pauseTimeoutRef.current);
            pauseTimeoutRef.current = null;
        }

        setShowPausePrompt(false); // Hide prompt initially regardless of action

        // Use type assertion inside switch
        switch (action as "continue" | "reset" | "remind") { 
            case "continue":
                toggleTimer(); 
                break;
            case "reset":
                resetTimer();
                break;
            case "remind":
                 // Set a new timeout for the reminder sound AND to show the prompt again
                pauseTimeoutRef.current = setTimeout(() => {
                    setShowPausePrompt(true);
                    playPausePromptSound();
                    // Restart the interval for subsequent sounds *after* the prompt reappears
                    soundIntervalRef.current = setInterval(playPausePromptSound, 5000); 
                }, 2 * 60 * 1000); // Remind after 2 minutes
                break;
            default:
                break;
        }
    }, [toggleTimer, resetTimer, playPausePromptSound]);


     // --- YouTube Player Handlers ---
    const onPlayerReady = useCallback((event: { target: YouTubePlayer }) => {
        setPlayer(event.target);
        // Add listener for player state changes
         event.target.addEventListener('onStateChange', (stateEvent: { data: number }) => {
            // Possible states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
            setIsYouTubePlaying(stateEvent.data === 1);
        });
    }, []);

     // Handle play/pause directly from MiniPlayer or other controls
     const handleYouTubePlayPause = useCallback(() => {
        if (!player) return;
        if (isYouTubePlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }, [player, isYouTubePlaying]);


    // --- Format Time Utility --- (Can be moved out later)
    const formatTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const formattedTime = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        return hrs > 0 ? `${hrs}:${formattedTime}` : formattedTime;
    };


    // --- Return values ---
    return {
        // State
        timeLeft,
        sessionType,
        isActive,
        sessionCount,
        sessionsUntilLongBreak,
        durations, // Needed for display/settings
        currentTheme,
        soundsEnabled, // Needed for settings
        sessionEndSound,
        pausePromptSound,
        pausePromptEnabled, // Needed for settings
        pausePromptDelay, // Needed for settings
        youtubeUrl, // Needed for player & settings
        youtubePlayerVisible,
        isYouTubePlaying, // State of the YT player
        player, // Player instance for direct control if needed outside

        // UI Visibility State (Consider moving to component state if not needed globally)
        showSettings,
        showPausePrompt,
        showVideoLibrary,

        // Actions
        toggleTimer,
        resetTimer,
        skipSession,
        changeSessionType,
        handleSettingsChange,
        handlePausePromptAction,
        setShowSettings, // Allow component to toggle settings modal
        setShowVideoLibrary, // Allow component to toggle video library
        setYoutubeUrl, // Allow video library to set URL
        setYoutubePlayerVisible,
        onPlayerReady, // Pass to YouTube component
        handleYouTubePlayPause, // Pass to MiniPlayer/controls
        toggleTheme, // <-- Add the new function here

        // Utilities?
        formatTime, // Pass to TimerDisplay component
        keepRunningOnTransition, // <-- Return new state
        handleSessionComplete, // <-- Add missing function here
    };
} 