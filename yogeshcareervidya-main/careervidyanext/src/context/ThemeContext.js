// src/context/ThemeContext.js
"use client"; 

import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

// Function to check OS/Browser preference
const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default fallback
};

export function ThemeProvider({ children }) {
    // Theme state: 'light', 'dark', or 'system'
    const [theme, setTheme] = useState('light'); 
    
    // Manual toggle state: True if user has manually chosen a theme
    const [isManual, setIsManual] = useState(false);

    // --- 1. Initial Load and OS Listener Setup ---
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = getSystemTheme();

        if (savedTheme) {
            setTheme(savedTheme);
            setIsManual(true); // Saved theme means it was manually set
        } else {
            setTheme(systemTheme);
            setIsManual(false); // No saved theme, use system preference
        }

        // Add Listener for real-time OS changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            // Only update theme if the user hasn't manually set one
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        // Cleanup: remove listener when component unmounts
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []); // Runs only once on mount

    // --- 2. Apply Class and Save Preference ---
    useEffect(() => {
        // Apply the class based on current theme state
        const currentModeClass = theme === 'dark' ? 'dark-mode' : 'light-mode'; 
        
        // This makes sure that the browser-set class is overridden by our class
        document.body.className = currentModeClass; 
        
        // Only save to localStorage if it was manually set by the user
        if (isManual) {
            localStorage.setItem('theme', theme);
        } else if (!localStorage.getItem('theme')) {
            // If it's not manual and no theme is saved, clear the storage (optional, but clean)
            localStorage.removeItem('theme');
        }

    }, [theme, isManual]);

    // --- 3. Toggle Function ---
    const toggleTheme = () => {
        setTheme(currentTheme => {
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setIsManual(true); // User is now manually choosing
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}