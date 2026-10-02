import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
export type FontSizeScale = 'small' | 'normal' | 'large';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  fontSize: FontSizeScale;
  setFontSize: (size: FontSizeScale) => void;
  resetFontSize: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'chandu_theme_preference';
const FONT_SIZE_STORAGE_KEY = 'chandu_font_size_preference';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      if (saved === 'dark' || saved === 'light') return saved;
      // System preference check
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  const [fontSize, setFontSizeState] = useState<FontSizeScale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY) as FontSizeScale;
      if (saved === 'small' || saved === 'normal' || saved === 'large') {
        return saved;
      }
    }
    return 'normal';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body?.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      body?.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else if (fontSize === 'small') {
      root.style.fontSize = '15px';
    } else {
      root.style.fontSize = '16px';
    }
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setFontSize = (newSize: FontSizeScale) => {
    setFontSizeState(newSize);
  };

  const resetFontSize = () => {
    setFontSizeState('normal');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, fontSize, setFontSize, resetFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

