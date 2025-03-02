"use client"

import { useState, useEffect } from 'react';

export default function ThemeTest() {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setTimeout(() => {
      console.log("HTML element:", document.documentElement);
      console.log("Available data-theme attribute:", document.documentElement.getAttribute("data-theme"));
      console.log("HTML classes:", document.documentElement.className);
      console.log("HTML outerHTML:", document.documentElement.outerHTML);
    }, 100);
  }, [theme]);
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Theme Test</h1>
      <div className="flex gap-2 mb-4">
        {['light', 'dark', 'cupcake', 'forest'].map((t) => (
          <button 
            key={t}
            className="btn btn-primary"
            onClick={() => setTheme(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <div className="bg-base-100 p-4 rounded mb-2">Base-100</div>
        <div className="bg-base-200 p-4 rounded mb-2">Base-200</div>
        <div className="bg-base-300 p-4 rounded mb-2">Base-300</div>
        <div className="bg-primary p-4 rounded mb-2 text-primary-content">Primary</div>
        <div className="bg-secondary p-4 rounded mb-2 text-secondary-content">Secondary</div>
        <div className="bg-accent p-4 rounded mb-2 text-accent-content">Accent</div>
      </div>
    </div>
  );
} 