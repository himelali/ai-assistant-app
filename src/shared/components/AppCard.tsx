import React, {PropsWithChildren} from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {YStack} from 'tamagui';
import {colors} from '../theme/colors';
import {radius} from '../theme/radius';
import {useAppTheme} from '../theme/ThemeContext';

export function AppCard({children, style}: PropsWithChildren<{style?: StyleProp<ViewStyle>}>) {
  const {theme} = useAppTheme();

  return (
    <YStack style={[styles.card, {backgroundColor: theme.surface, borderColor: theme.line}, style]}>
      {children}
    </YStack>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 2,
  },
});
