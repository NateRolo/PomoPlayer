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
        title: "Deep & Melodic House", 
        url: "https://www.youtube.com/watch?v=WsDyRAPFBC8" 
      },
      { 
        id: "3", 
        title: "Synthwave Radio", 
        url: "https://www.youtube.com/watch?v=4xDzrJKXOOY" 
      },
      {
        id: "4",
        title: "Chillhop Radio",
        url: "https://www.youtube.com/watch?v=5yx6BWlEVcY"
      },
      {
        id: "5",
        title: "Yes",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
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
  
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  
  const getVideoId = (url: string): string => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : '';
  };
  
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
  
  const getYoutubeVideoTitle = async (url: string): Promise<string> => {
    const videoId = getVideoId(url);
    try {
      const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      const data = await response.json();
      return data.title || `Video ${videos.length + 1}`;
    } catch (error) {
      console.error('Error fetching video title:', error);
      return `Video ${videos.length + 1}`;
    }
  };
  
  const handleAddVideo = async () => {
    if (!newVideoUrl) {
      setYoutubeUrlError("URL is required");
      return;
    }
    
    // Validate the YouTube URL
    if (!validateYoutubeUrl(newVideoUrl)) {
      return;
    }
    
    // If no title provided, fetch it from YouTube
    const videoTitle = newVideoTitle || await getYoutubeVideoTitle(newVideoUrl);
    
    const newVideo: Video = {
      id: Date.now().toString(),
      title: videoTitle,
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
  
  const handleEditVideo = () => {
    if (!editingVideo) return;
    
    // Validate the URL
    if (!validateYoutubeUrl(editUrl)) {
      return;
    }
    
    // Update the video in the list
    setVideos(videos.map(video => 
      video.id === editingVideo.id 
        ? { ...video, title: editTitle || video.title, url: editUrl }
        : video
    ));
    
    // Reset edit state
    setEditingVideo(null);
    setEditTitle("");
    setEditUrl("");
    setYoutubeUrlError(null);
  };
  
  return (
    <div className="modal modal-open" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-box w-full max-w-2xl max-h-[80vh] flex flex-col">
        <h3 className="text-xl font-bold mb-4">Your YouTube Videos</h3>
        
        <div className="sticky top-0 bg-base-100 z-10 mb-6 pb-4 border-b border-base-300">
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
          {youtubeUrlError && (
            <p className="text-xs text-error mt-1">
              {youtubeUrlError}
            </p>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Desktop view - table */}
          <div className="hidden md:block">
            <table className="table w-full">
              <thead className="sticky top-0 bg-base-100 z-10">
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map(video => (
                  <tr key={video.id}>
                    {editingVideo?.id === video.id ? (
                      <>
                        <td>
                          <img 
                            src={`https://img.youtube.com/vi/${getVideoId(editUrl || video.url)}/default.jpg`}
                            alt="Video thumbnail"
                            className="w-20 h-auto rounded"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder={video.title}
                            className="input input-bordered input-sm w-full"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editUrl}
                            onChange={(e) => {
                              setEditUrl(e.target.value);
                              validateYoutubeUrl(e.target.value);
                            }}
                            placeholder={video.url}
                            className={`input input-bordered input-sm w-full ${youtubeUrlError ? 'input-error' : ''}`}
                          />
                        </td>
                        <td className="flex gap-2">
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={handleEditVideo}
                            disabled={!!youtubeUrlError}
                          >
                            Save
                          </button>
                          <button 
                            className="btn btn-sm btn-ghost"
                            onClick={() => {
                              setEditingVideo(null);
                              setEditTitle("");
                              setEditUrl("");
                              setYoutubeUrlError(null);
                            }}
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <img 
                            src={`https://img.youtube.com/vi/${getVideoId(video.url)}/default.jpg`}
                            alt={video.title}
                            className="w-20 h-auto rounded"
                          />
                        </td>
                        <td>{video.title}</td>
                        <td>
                          <span className="text-sm opacity-50" title={video.url}>
                            ID: {getVideoId(video.url)}
                          </span>
                        </td>
                        <td className="flex gap-2">
                          <button 
                            className="btn btn-sm btn-ghost"
                            onClick={() => onSelectVideo(video.url)}
                          >
                            Use
                          </button>
                          <button 
                            className="btn btn-sm btn-ghost"
                            onClick={() => {
                              setEditingVideo(video);
                              setEditTitle(video.title);
                              setEditUrl(video.url);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-ghost text-error"
                            onClick={() => handleDeleteVideo(video.id)}
                            title="Delete video"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                              />
                            </svg>
                          </button>
                        </td>
                      </>
                    )}
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

          {/* Mobile view - cards */}
          <div className="md:hidden space-y-4">
            {videos.map(video => (
              <div key={video.id} className="card bg-base-200">
                {editingVideo?.id === video.id ? (
                  // Edit mode
                  <div className="p-4 space-y-4">
                    <img 
                      src={`https://img.youtube.com/vi/${getVideoId(editUrl || video.url)}/default.jpg`}
                      alt="Video thumbnail"
                      className="w-full h-auto rounded"
                    />
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder={video.title}
                      className="input input-bordered w-full"
                    />
                    <input
                      type="text"
                      value={editUrl}
                      onChange={(e) => {
                        setEditUrl(e.target.value);
                        validateYoutubeUrl(e.target.value);
                      }}
                      placeholder={video.url}
                      className={`input input-bordered w-full ${youtubeUrlError ? 'input-error' : ''}`}
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={handleEditVideo}
                        disabled={!!youtubeUrlError}
                      >
                        Save
                      </button>
                      <button 
                        className="btn btn-sm btn-ghost"
                        onClick={() => {
                          setEditingVideo(null);
                          setEditTitle("");
                          setEditUrl("");
                          setYoutubeUrlError(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={`https://img.youtube.com/vi/${getVideoId(video.url)}/default.jpg`}
                        alt={video.title}
                        className="w-24 h-auto rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold">{video.title}</h3>
                        <p className="text-sm opacity-50" title={video.url}>
                          ID: {getVideoId(video.url)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button 
                        className="btn btn-sm btn-ghost"
                        onClick={() => onSelectVideo(video.url)}
                      >
                        Use
                      </button>
                      <button 
                        className="btn btn-sm btn-ghost"
                        onClick={() => {
                          setEditingVideo(video);
                          setEditTitle(video.title);
                          setEditUrl(video.url);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-ghost text-error"
                        onClick={() => handleDeleteVideo(video.id)}
                        title="Delete video"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {videos.length === 0 && (
              <div className="text-center py-4">
                No videos saved yet. Add your favorite YouTube videos above.
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-action mt-4 border-t border-base-300 pt-4">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
