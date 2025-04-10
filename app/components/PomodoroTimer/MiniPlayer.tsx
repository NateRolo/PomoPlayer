import type React from "react";

/**
 * MiniPlayer component provides compact controls when the main YouTube player is hidden
 */
export const MiniPlayer: React.FC<{
    isPlaying: boolean;
    onTogglePlay: () => void;
    onShowPlayer: () => void;
    videoTitle: string;
}> = ({ isPlaying, onTogglePlay, onShowPlayer, videoTitle }) => {
    return (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-base-200 p-2 rounded-lg shadow-lg z-50 border border-base-content/10">
            {/* Added z-50 to ensure it appears above other elements and a faint border to the container */}
            <button 
                className={`btn btn-circle btn-sm border border-base-content/20 ${isPlaying ? 'btn-primary' : 'btn-ghost'}`}
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
            <span className="text-sm font-medium truncate max-w-xs">{videoTitle}</span> {/* Added truncate and max-width */}
            <button 
                className="btn btn-circle btn-sm btn-ghost border border-base-content/20"
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