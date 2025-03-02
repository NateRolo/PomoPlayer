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
  
  const handleAddVideo = () => {
    if (!newVideoUrl) return;
    
    // Extract video ID from URL
    const videoId = newVideoUrl.includes("youtube.com/watch?v=") 
      ? newVideoUrl.split("v=")[1].split("&")[0]
      : newVideoUrl.includes("youtu.be/")
        ? newVideoUrl.split("youtu.be/")[1].split("?")[0]
        : "";
    
    if (!videoId) {
      alert("Please enter a valid YouTube URL");
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
              onChange={(e) => setNewVideoUrl(e.target.value)}
              className="input input-bordered flex-1"
            />
            <button 
              className="btn btn-primary"
              onClick={handleAddVideo}
            >
              Add
            </button>
          </div>
          <p className="text-xs opacity-70">
            Enter a YouTube video URL (e.g., https://www.youtube.com/watch?v=jfKfPfyJRdk)
          </p>
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
