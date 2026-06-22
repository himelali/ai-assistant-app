import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {AppProviders} from './src/app/providers/AppProviders';
import {RootNavigator} from './src/app/navigation/RootNavigator';
import {useLocalization} from './src/shared/localization/LocalizationContext';
import {useAppTheme} from './src/shared/theme/ThemeContext';

declare const process: {env: {JEST_WORKER_ID?: string}};

if (!process.env.JEST_WORKER_ID) {
  enableScreens();
}

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

function AppContent() {
  const {theme, isThemeLoaded} = useAppTheme();
  const {isLocalizationLoaded} = useLocalization();

  if (!isThemeLoaded || !isLocalizationLoaded) {
    return <View style={[styles.loading, {backgroundColor: theme.canvas}]} />;
  }

  return (
    <>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.canvas} />
      <RootNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
  },
});

export default App;
