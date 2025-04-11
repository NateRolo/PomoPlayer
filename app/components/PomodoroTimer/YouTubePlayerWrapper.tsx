import type React from "react";
import YouTube from "react-youtube";
import type { YouTubePlayer } from 'react-youtube';
import type { SessionType } from "../../hooks/usePomodoroTimer"; // Adjust path as needed

interface YouTubePlayerWrapperProps {
    youtubeUrl: string;
    isVisible: boolean;
    isActive: boolean; // Timer active state
    sessionType: SessionType;
    onPlayerReady: (event: { target: YouTubePlayer }) => void;
}

/**
 * Extracts the YouTube Video ID from various URL formats.
 * Handles standard watch URLs, short URLs (youtu.be), embed, shorts, and live URLs.
 * Validates the extracted ID format (typically 11 alphanumeric characters, _, -).
 * @param url The YouTube URL string.
 * @returns The extracted and validated video ID, or null if not found or invalid.
 */
const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    // Regular expression to cover common YouTube URL patterns and capture the ID
    // Groups: 1=youtu.be, 2=watch?v=, 3=embed/, 4=shorts/, 5=live/
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})(?:\S+)?$/;
    
    const match = url.match(regex);
    
    const potentialId = match ? match[1] : null;

    // Basic validation for typical YouTube ID format (11 chars, alphanumeric, _, -)
    if (potentialId && /^[a-zA-Z0-9_-]{11}$/.test(potentialId)) {
        return potentialId;
    } 

    // Optional: Fallback or warning if format looks unusual but was extracted
    // if (potentialId) { 
    //    console.warn("Extracted potential YouTube ID with non-standard format:", potentialId); 
    //    return potentialId; // Decide if you want to allow non-standard IDs
    // }

    console.warn("Could not extract valid YouTube Video ID from URL:", url);
    return null;
};

export const YouTubePlayerWrapper: React.FC<YouTubePlayerWrapperProps> = ({
    youtubeUrl,
    isVisible,
    isActive,
    sessionType,
    onPlayerReady,
}) => {
    const videoId = getYouTubeVideoId(youtubeUrl);

    if (!videoId) {
        return isVisible ? (
            <div className="relative w-full aspect-video bg-base-300 flex items-center justify-center">
                <p className="text-error-content bg-error/30 p-4 rounded-md text-center">
                    Invalid or unsupported YouTube URL.
                    <br />
                    <span className="text-xs opacity-80">Please use a standard video, shorts, or live URL.</span>
                </p>
            </div>
        ) : null;
    }

    return (
        <div className={`${isVisible ? "relative w-full aspect-video" : "hidden"}`}>
            <YouTube
                videoId={videoId}
                opts={{
                    height: "100%",
                    width: "100%",
                    playerVars: {
                        // Autoplay only during active work sessions
                        autoplay: isActive && sessionType === "work" ? 1 : 0,
                    },
                }}
                onReady={onPlayerReady}
                className="w-full h-full"
            />
        </div>
    );
}; 