import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {colors} from './colors';

export type AppThemeMode = 'light' | 'dark';

const palettes = {
  light: {
    mode: 'light',
    canvas: colors.canvas,
    surface: colors.surface,
    text: colors.ink,
    textSoft: colors.inkSoft,
    textFaint: colors.inkFaint,
    line: colors.line,
    tabBar: colors.surface,
    statusBarStyle: 'dark-content',
  },
  dark: {
    mode: 'dark',
    canvas: colors.dark,
    surface: colors.darkPanel,
    text: '#F8FAFC',
    textSoft: '#D7DEE9',
    textFaint: '#AAB5C5',
    line: 'rgba(248,250,252,0.14)',
    tabBar: '#0B1626',
    statusBarStyle: 'light-content',
  },
} as const;

const THEME_STORAGE_KEY = 'typeai.theme-mode';

type AppThemeContextValue = {
  mode: AppThemeMode;
  isDark: boolean;
  theme: (typeof palettes)[AppThemeMode];
  isThemeLoaded: boolean;
  setThemeMode: (mode: AppThemeMode) => Promise<void>;
  toggleTheme: () => Promise<AppThemeMode>;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({children}: PropsWithChildren) {
  const [mode, setMode] = useState<AppThemeMode>('light');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then(savedMode => {
        if (!mounted) {
          return;
        }
        if (savedMode === 'light' || savedMode === 'dark') {
          setMode(savedMode);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsThemeLoaded(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const setThemeMode = useCallback(async (nextMode: AppThemeMode) => {
    setMode(nextMode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
  }, []);

  const value = useMemo<AppThemeContextValue>(() => {
    const theme = palettes[mode];
    return {
      mode,
      isDark: mode === 'dark',
      theme,
      isThemeLoaded,
      setThemeMode,
      toggleTheme: async () => {
        const nextMode = mode === 'dark' ? 'light' : 'dark';
        await setThemeMode(nextMode);
        return nextMode;
      },
    };
  }, [isThemeLoaded, mode, setThemeMode]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const value = useContext(AppThemeContext);
  if (!value) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }
  return value;
}
