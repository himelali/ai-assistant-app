import React, {createContext, PropsWithChildren, useContext, useMemo} from 'react';
import {translations, TranslationKey} from './translations';

type LocalizationContextValue = {
  isLocalizationLoaded: boolean;
  t: (key: TranslationKey) => string;
};

const LocalizationContext = createContext<LocalizationContextValue | null>(null);

export function LocalizationProvider({children}: PropsWithChildren) {
  const value = useMemo<LocalizationContextValue>(
    () => ({
      isLocalizationLoaded: true,
      t: key => translations[key],
    }),
    [],
  );

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  const value = useContext(LocalizationContext);
  if (!value) {
    throw new Error('useLocalization must be used inside LocalizationProvider');
  }
  return value;
}
