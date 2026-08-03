// src/components/ThemeToggle.js

'use client'; // App Router में state/hooks के लिए ज़रूरी

import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    // theme state और toggle function को लाएं
    const { theme, toggleTheme } = useTheme(); 

    return (
        <button 
            onClick={toggleTheme}
            style={{ 
                padding: '10px 15px', 
                cursor: 'pointer',
                // बटन की स्टाइलिंग भी variables पर निर्भर करेगी 
                backgroundColor: theme === 'dark' ? '#333' : '#eee', 
                color: theme === 'dark' ? '#fff' : '#000',
                border: 'none',
                borderRadius: '5px'
            }}
        >
            {theme === 'light' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
        </button>
    );
}