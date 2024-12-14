import { useContext } from 'react';
import { ThemeContext } from './color-context';

export const getThemeClasses = (themeColor) => {
    const themeColorMap = {
        blue: {
          bg: 'bg-blue-600',
          text: 'text-blue-50',
          border: 'border-blue-500',
          hover: 'hover:bg-blue-700',
          ring: 'focus:ring-blue-500',
          outline: 'outline-blue-500',
          accent: 'bg-blue-100 text-blue-800',
          layoutBg: 'bg-blue-50', // Light background for layouts
          layoutText: 'text-blue-900' // Text color for light background
        },
        green: {
          bg: 'bg-green-600',
          text: 'text-green-50',
          border: 'border-green-500',
          hover: 'hover:bg-green-700',
          ring: 'focus:ring-green-500',
          outline: 'outline-green-500',
          accent: 'bg-green-100 text-green-800',
          layoutBg: 'bg-green-50', // Light background for layouts
          layoutText: 'text-green-900' // Text color for light background
        },
        red: {
          bg: 'bg-red-600',
          text: 'text-red-50',
          border: 'border-red-500',
          hover: 'hover:bg-red-700',
          ring: 'focus:ring-red-500',
          outline: 'outline-red-500',
          accent: 'bg-red-100 text-red-800',
          layoutBg: 'bg-red-50', // Light background for layouts
          layoutText: 'text-red-900' // Text color for light background
        },
        purple: {
          bg: 'bg-purple-600',
          text: 'text-purple-50',
          border: 'border-purple-500',
          hover: 'hover:bg-purple-700',
          ring: 'focus:ring-purple-500',
          outline: 'outline-purple-500',
          accent: 'bg-purple-100 text-purple-800',
          layoutBg: 'bg-purple-50', // Light background for layouts
          layoutText: 'text-purple-900' // Text color for light background
        },
        orange: {
          bg: 'bg-orange-600',
          text: 'text-orange-50',
          border: 'border-orange-500',
          hover: 'hover:bg-orange-700',
          ring: 'focus:ring-orange-500',
          outline: 'outline-orange-500',
          accent: 'bg-orange-100 text-orange-800',
          layoutBg: 'bg-orange-50', // Light background for layouts
          layoutText: 'text-orange-900' // Text color for light background
        },
        default: {
          bg: 'bg-blue-600',
          text: 'text-blue-50',
          border: 'border-blue-500',
          hover: 'hover:bg-blue-700',
          ring: 'focus:ring-blue-500',
          outline: 'outline-blue-500',
          accent: 'bg-blue-100 text-blue-800',
          layoutBg: 'bg-blue-50', // Light background for layouts
          layoutText: 'text-blue-900' // Text color for light background
        }
    };

    return themeColorMap[themeColor] || themeColorMap.default;
};

// Hook to get theme classes within a component
export const useThemeClasses = () => {
  const { themeColor } = useContext(ThemeContext);
  return getThemeClasses(themeColor);
};

// Utility function to apply theme background to layouts
export const useThemeLayoutClasses = () => {
  const { themeColor } = useContext(ThemeContext);
  const themeClasses = getThemeClasses(themeColor);
  return {
    layoutBackground: themeClasses.layoutBg,
    layoutText: themeClasses.layoutText
  };
};