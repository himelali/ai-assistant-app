import React, {PropsWithChildren} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TamaguiProvider, Theme} from 'tamagui';
import {ToastProvider} from '../../shared/components/Toast';
import {LocalizationProvider} from '../../shared/localization/LocalizationContext';
import {AppThemeProvider, useAppTheme} from '../../shared/theme/ThemeContext';
import tamaguiConfig from '../../tamagui.config';

export function AppProviders({children}: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <TamaguiProvider config={tamaguiConfig as any} defaultTheme="light">
        <AppThemeProvider>
          <LocalizationProvider>
            <ThemedContent>{children}</ThemedContent>
          </LocalizationProvider>
        </AppThemeProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}

function ThemedContent({children}: PropsWithChildren) {
  const {mode} = useAppTheme();

  return (
    <Theme name={mode}>
      <ToastProvider>{children}</ToastProvider>
    </Theme>
  );
}
