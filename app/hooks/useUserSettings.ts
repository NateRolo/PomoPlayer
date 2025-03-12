"use client";

import { useState, useEffect } from 'react';

interface UserSettings {
  durations: {
    work: number;
    shortBreak: number;
    longBreak: number;
  };
  sessionsUntilLongBreak: number;
  youtubeUrl: string;
  pausePromptEnabled: boolean;
  pausePromptDelay: number;
  theme: string;
  soundsEnabled: boolean;
  youtubePlayerVisible: boolean;
}

interface StorageError {
  name: string;
  message: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  durations: {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  },
  sessionsUntilLongBreak: 4,
  youtubeUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
  pausePromptEnabled: true,
  pausePromptDelay: 2,
  theme: "dark",
  soundsEnabled: true,
  youtubePlayerVisible: true
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      setLoading(true);
      setError(null);
      
      try {
        const storedSettings = localStorage.getItem('userSettings');
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (err) {
        const error = err as StorageError;
        console.error('Error loading settings:', error);
        setError(error.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: UserSettings) => {
    setLoading(true);
    setError(null);
    
    try {
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    saveSettings,
    loading,
    error,
  };
}
