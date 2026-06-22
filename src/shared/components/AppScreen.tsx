import React, {PropsWithChildren, useMemo} from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {YStack} from 'tamagui';
import {useAppTheme} from '../theme/ThemeContext';

export function AppScreen({
  children,
  style,
}: PropsWithChildren<{style?: StyleProp<ViewStyle>}>) {
  const {theme} = useAppTheme();
  const safeStyle = useMemo<ViewStyle>(
    () => ({flex: 1, backgroundColor: theme.canvas}),
    [theme.canvas],
  );
  const contentStyle = useMemo<ViewStyle>(
    () => ({backgroundColor: theme.canvas}),
    [theme.canvas],
  );

  return (
    <SafeAreaView style={[style, safeStyle]}>
      <YStack style={[styles.fill, contentStyle]}>
        {children}
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
