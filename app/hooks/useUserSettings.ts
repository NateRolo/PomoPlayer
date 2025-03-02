"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../components/contexts/AuthContext';

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
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from localStorage if not logged in, or from API if logged in
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (user) {
          // Load from API
          const response = await fetch('/api/user-settings');
          
          if (!response.ok) {
            throw new Error('Failed to load settings');
          }
          
          const data = await response.json();
          
          // Transform the data from the API format to our app format
          setSettings({
            durations: {
              work: data.work_duration,
              shortBreak: data.short_break_duration,
              longBreak: data.long_break_duration,
            },
            sessionsUntilLongBreak: data.sessions_until_long_break,
            youtubeUrl: data.youtube_url,
            pausePromptEnabled: data.pause_prompt_enabled,
            pausePromptDelay: data.pause_prompt_delay,
            theme: data.theme,
            soundsEnabled: data.sounds_enabled,
            youtubePlayerVisible: data.youtube_player_visible,
          });
        } else {
          // Load from localStorage
          const storedSettings = localStorage.getItem('userSettings');
          
          if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
          }
        }
      } catch (err: any) {
        console.error('Error loading settings:', err);
        setError(err.message || 'Failed to load settings');
        
        // Fall back to localStorage if API fails
        const storedSettings = localStorage.getItem('userSettings');
        
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [user]);

  // Save settings to localStorage and/or API
  const saveSettings = async (newSettings: UserSettings) => {
    setLoading(true);
    setError(null);
    
    try {
      // Always save to localStorage for quick access
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      
      if (user) {
        // Also save to API if logged in
        const response = await fetch('/api/user-settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSettings),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save settings');
        }
      }
      
      setSettings(newSettings);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to save settings');
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
