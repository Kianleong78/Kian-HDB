import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'dark' | 'light';
export type ViewMode = 'simple' | 'pro';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  viewMode: ViewMode;
  toggleViewMode: () => void;
  setViewMode: (mode: ViewMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('hdb_ai_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem('hdb_ai_view_mode');
      if (saved === 'simple' || saved === 'pro') return saved;
      return 'simple'; // Default to simple mode for a friendly, un-intimidating experience
    } catch {
      return 'simple';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hdb_ai_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.warn('Storage theme sync notice:', e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('hdb_ai_view_mode', viewMode);
    } catch (e) {
      console.warn('Storage view mode sync notice:', e);
    }
  }, [viewMode]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const toggleViewMode = () => {
    setViewModeState((prev) => (prev === 'simple' ? 'pro' : 'simple'));
  };

  const setViewMode = (m: ViewMode) => {
    setViewModeState(m);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        viewMode,
        toggleViewMode,
        setViewMode,
      }}
    >
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
