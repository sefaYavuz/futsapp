/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2563eb'; // Modern blue
const tintColorDark = '#3b82f6'; // Lighter blue for dark mode

export const Colors = {
  light: {
    text: '#1e293b', // Slate 800
    background: '#f8fafc', // Slate 50
    tint: tintColorLight,
    tabIconDefault: '#64748b', // Slate 500
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
    success: '#10b981', // Emerald 500
    warning: '#f59e0b', // Amber 500
    error: '#ef4444', // Red 500
    primary: {
      light: '#60a5fa', // Blue 400
      main: tintColorLight,
      dark: '#1d4ed8', // Blue 700
    },
    secondary: {
      light: '#2dd4bf', // Teal 400
      main: '#14b8a6', // Teal 500
      dark: '#0f766e', // Teal 700
    },
    accent: {
      light: '#f472b6', // Pink 400
      main: '#ec4899', // Pink 500
      dark: '#db2777', // Pink 600
    },
  },
  dark: {
    text: '#f1f5f9', // Slate 100
    background: '#0f172a', // Slate 900
    tint: tintColorDark,
    tabIconDefault: '#94a3b8', // Slate 400
    tabIconSelected: tintColorDark,
    card: '#1e293b', // Slate 800
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    success: '#34d399', // Emerald 400
    warning: '#fbbf24', // Amber 400
    error: '#f87171', // Red 400
    primary: {
      light: '#93c5fd', // Blue 300
      main: tintColorDark,
      dark: '#60a5fa', // Blue 400
    },
    secondary: {
      light: '#5eead4', // Teal 300
      main: '#2dd4bf', // Teal 400
      dark: '#14b8a6', // Teal 500
    },
    accent: {
      light: '#f9a8d4', // Pink 300
      main: '#f472b6', // Pink 400
      dark: '#ec4899', // Pink 500
    },
  },
};
