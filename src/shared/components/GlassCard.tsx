import React, {PropsWithChildren, useMemo} from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {YStack} from 'tamagui';
import {colors} from '../theme/colors';
import {radius} from '../theme/radius';
import {useAppTheme} from '../theme/ThemeContext';

export function GlassCard({children, style}: PropsWithChildren<{style?: StyleProp<ViewStyle>}>) {
  const {isDark, theme} = useAppTheme();
  const themedBorder = useMemo<ViewStyle>(
    () => ({borderColor: isDark ? theme.line : 'rgba(255,255,255,0.75)'}),
    [isDark, theme.line],
  );

  return (
    <YStack
      style={[
        styles.card,
        isDark ? styles.darkGlass : styles.lightGlass,
        themedBorder,
        style,
      ]}>
      {children}
    </YStack>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 16,
    shadowColor: colors.primaryStart,
    shadowOpacity: 0.11,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 10},
    elevation: 3,
  },
  lightGlass: {
    backgroundColor: colors.glass,
  },
  darkGlass: {
    backgroundColor: 'rgba(16,28,44,0.9)',
  },
});
