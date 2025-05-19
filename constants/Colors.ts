/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0BDA51'; // Malachite
const tintColorDark = '#0AAA40'; // Emerald

export const Colors = {
  light: {
    text: '#1e293b', // Slate 800
    background: '#f8fafc', // Slate 50
    tint: {
      default: tintColorLight,
      darker: "#06402B",
    },
    tabIconDefault: '#64748b', // Slate 500
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
    success: '#10b981', // Emerald 500
    warning: '#f59e0b', // Amber 500
    error: '#ef4444', // Red 500
  },
  dark: {
    text: '#f1f5f9', // Slate 100
    background: '#0f172a', // Slate 900
    tint: {
      default: tintColorDark,
      darker: "#06402B",
    },
    tabIconDefault: '#94a3b8', // Slate 400
    tabIconSelected: tintColorDark,
    card: '#1e293b', // Slate 800
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    success: '#34d399', // Emerald 400
    warning: '#fbbf24', // Amber 400
    error: '#f87171', // Red 400
  },
};
