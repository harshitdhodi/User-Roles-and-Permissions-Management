import React, { createContext, useState, useContext } from 'react';

// Create the ThemeContext
export const ThemeContext = createContext({
  themeColor: 'blue', // Default theme color
  setThemeColor: () => {},
});

// Context Provider Component
export function ThemeProvider({ children }) {
  const [themeColor, setThemeColor] = useState('blue'); // Store only the color name

  // Function to update the theme color with validation
  const updateThemeColor = (newColor) => {


    if (newColor) {
      setThemeColor(newColor);
    } else {
      console.warn(`Invalid color: ${newColor}. Using default.`);
      setThemeColor('black');
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        themeColor, 
        setThemeColor: updateThemeColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for easy context usage
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

// Helper function to construct Tailwind class dynamically
export function getTailwindClass(color) {
  return `text-${color}`;
}
