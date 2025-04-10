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

// Utility function to extract YouTube Video ID from various URL formats
const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === "youtu.be") {
            return urlObj.pathname.slice(1);
        }
        if (urlObj.hostname.includes("youtube.com")) {
            if (urlObj.pathname === "/watch") {
                return urlObj.searchParams.get("v");
            }
            if (urlObj.pathname.startsWith("/embed/")) {
                return urlObj.pathname.split("/")[2];
            }
            // Add other potential formats if needed
        }
    } catch (e) {
        console.error("Error parsing YouTube URL:", e);
        // Fallback for simple v= query param if URL parsing fails
        const match = url.match(/[?&]v=([^&]+)/);
        if (match) return match[1];
    }
    console.warn("Could not extract YouTube Video ID from URL:", url);
    return null; // Return null if ID couldn't be extracted
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
        // Optionally render a placeholder or error message if video ID is invalid
        return isVisible ? (
            <div className="relative w-full aspect-video bg-base-300 flex items-center justify-center">
                <p className="text-error">Invalid YouTube URL</p>
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