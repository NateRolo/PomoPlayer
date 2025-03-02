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
          try {
            const response = await fetch('/api/user-settings');
            
            if (response.ok) {
              const data = await response.json();
              
              // Transform the data from the API format to our app format
              setSettings({
                durations: {
                  work: data.work_duration || DEFAULT_SETTINGS.durations.work,
                  shortBreak: data.short_break_duration || DEFAULT_SETTINGS.durations.shortBreak,
                  longBreak: data.long_break_duration || DEFAULT_SETTINGS.durations.longBreak,
                },
                sessionsUntilLongBreak: data.sessions_until_long_break || DEFAULT_SETTINGS.sessionsUntilLongBreak,
                youtubeUrl: data.youtube_url || DEFAULT_SETTINGS.youtubeUrl,
                pausePromptEnabled: data.pause_prompt_enabled ?? DEFAULT_SETTINGS.pausePromptEnabled,
                pausePromptDelay: data.pause_prompt_delay || DEFAULT_SETTINGS.pausePromptDelay,
                theme: data.theme || DEFAULT_SETTINGS.theme,
                soundsEnabled: data.sounds_enabled ?? DEFAULT_SETTINGS.soundsEnabled,
                youtubePlayerVisible: data.youtube_player_visible ?? DEFAULT_SETTINGS.youtubePlayerVisible,
              });
              return;
            } else {
              console.warn(`Failed to load settings from API: ${response.status} ${response.statusText}`);
            }
          } catch (apiError) {
            console.error("API error when loading settings:", apiError);
          }
          
          // Fall back to localStorage if API fails
          console.log("Falling back to localStorage for settings");
          const storedSettings = localStorage.getItem('userSettings');
          
          if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
          }
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
