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
import {
  languageOptions,
  LanguageCode,
  translations,
  TranslationKey,
} from './translations';

const LANGUAGE_STORAGE_KEY = 'typeai.language-code';

type LocalizationContextValue = {
  language: LanguageCode;
  languageLabel: string;
  languageNativeLabel: string;
  languageOptions: typeof languageOptions;
  isLocalizationLoaded: boolean;
  setLanguage: (language: LanguageCode) => Promise<void>;
  t: (key: TranslationKey) => string;
};

const LocalizationContext = createContext<LocalizationContextValue | null>(null);

function isLanguageCode(value: string | null): value is LanguageCode {
  return languageOptions.some(option => option.code === value);
}

export function LocalizationProvider({children}: PropsWithChildren) {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [isLocalizationLoaded, setIsLocalizationLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then(savedLanguage => {
        if (mounted && isLanguageCode(savedLanguage)) {
          setLanguageState(savedLanguage);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLocalizationLoaded(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const setLanguage = useCallback(async (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }, []);

  const value = useMemo<LocalizationContextValue>(() => {
    const option = languageOptions.find(item => item.code === language) ?? languageOptions[0];
    return {
      language,
      languageLabel: option.label,
      languageNativeLabel: option.nativeLabel,
      languageOptions,
      isLocalizationLoaded,
      setLanguage,
      t: key => translations[language][key] ?? translations.en[key],
    };
  }, [isLocalizationLoaded, language, setLanguage]);

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  const value = useContext(LocalizationContext);
  if (!value) {
    throw new Error('useLocalization must be used inside LocalizationProvider');
  }
  return value;
}
