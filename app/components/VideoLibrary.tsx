"use client";

import { useState, useEffect } from "react";

interface Video {
  id: string;
  title: string;
  url: string;
}

interface VideoLibraryProps {
  onSelectVideo: (url: string) => void;
  onClose: () => void;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({ onSelectVideo, onClose }) => {
  // Load videos from localStorage or use default mock data
  const [videos, setVideos] = useState<Video[]>(() => {
    const savedVideos = localStorage.getItem('savedVideos');
    if (savedVideos) {
      return JSON.parse(savedVideos);
    }
    return [
      { 
        id: "1", 
        title: "Lofi Hip Hop Radio", 
        url: "https://www.youtube.com/watch?v=jfKfPfyJRdk" 
      },
      { 
        id: "2", 
        title: "Relaxing Jazz Music", 
        url: "https://www.youtube.com/watch?v=neV3EPgvZ3g" 
      },
      { 
        id: "3", 
        title: "Classical Music for Studying", 
        url: "https://www.youtube.com/watch?v=1Cv0kCB59J0" 
      }
    ];
  });
  
  // Save videos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedVideos', JSON.stringify(videos));
  }, [videos]);
  
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [youtubeUrlError, setYoutubeUrlError] = useState<string | null>(null);
  
  const validateYoutubeUrl = (url: string): boolean => {
    if (!url) {
      setYoutubeUrlError("URL is required");
      return false;
    }
    
    // Check if it's a valid YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url)) {
      setYoutubeUrlError("Please enter a valid YouTube URL");
      return false;
    }
    
    // Check if it contains a video ID
    const videoIdRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(videoIdRegex);
    
    if (!match) {
      setYoutubeUrlError("Please enter a valid YouTube video URL");
      return false;
    }
    
    // Valid YouTube URL with video ID
    setYoutubeUrlError(null);
    return true;
  };
  
  const handleYoutubeUrlChange = (value: string) => {
    setNewVideoUrl(value);
    
    if (!value) {
      setYoutubeUrlError(null);
      return;
    }
    
    validateYoutubeUrl(value);
  };
  
  const handleAddVideo = () => {
    if (!newVideoUrl) {
      setYoutubeUrlError("URL is required");
      return;
    }
    
    // Validate the YouTube URL
    if (!validateYoutubeUrl(newVideoUrl)) {
      return;
    }
    
    const newVideo: Video = {
      id: Date.now().toString(),
      title: newVideoTitle || `Video ${videos.length + 1}`,
      url: newVideoUrl
    };
    
    setVideos([...videos, newVideo]);
    setNewVideoUrl("");
    setNewVideoTitle("");
    setYoutubeUrlError(null);
  };
  
  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
  };
  
  return (
    <div className="modal modal-open" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-box w-full max-w-2xl">
        <h3 className="text-xl font-bold mb-4">Your YouTube Videos</h3>
        
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-2 mb-2">
            <input
              type="text"
              placeholder="Video title (optional)"
              value={newVideoTitle}
              onChange={(e) => setNewVideoTitle(e.target.value)}
              className="input input-bordered flex-1"
            />
            <input
              type="text"
              placeholder="YouTube URL"
              value={newVideoUrl}
              onChange={(e) => handleYoutubeUrlChange(e.target.value)}
              className={`input input-bordered flex-1 ${youtubeUrlError ? 'input-error' : ''}`}
            />
            <button 
              className="btn btn-primary"
              onClick={handleAddVideo}
              disabled={!!youtubeUrlError}
            >
              Add
            </button>
          </div>
          {youtubeUrlError ? (
            <p className="text-xs text-error mt-1">
              {youtubeUrlError}
            </p>
          ) : (
            <p className="text-xs opacity-70">
              Enter a YouTube video URL (e.g., https://www.youtube.com/watch?v=jfKfPfyJRdk)
            </p>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(video => (
                <tr key={video.id}>
                  <td>{video.title}</td>
                  <td className="truncate max-w-[200px]">{video.url}</td>
                  <td className="flex gap-2">
                    <button 
                      className="btn btn-sm btn-ghost"
                      onClick={() => onSelectVideo(video.url)}
                    >
                      Use
                    </button>
                    <button 
                      className="btn btn-sm btn-ghost text-error"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {videos.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No videos saved yet. Add your favorite YouTube videos above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
