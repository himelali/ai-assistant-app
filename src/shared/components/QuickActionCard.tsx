import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import {radius} from '../theme/radius';
import {useAppTheme} from '../theme/ThemeContext';
import {AppIcon} from './AppIcon';

export function QuickActionCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  const {theme} = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.card, {backgroundColor: theme.surface, borderColor: theme.line}]}>
      <View style={styles.iconBox}>
        <AppIcon name={icon} size={17} color={colors.primaryStart} />
      </View>
      <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
      <Text style={[styles.subtitle, {color: theme.textFaint}]}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 104,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 13,
    justifyContent: 'center',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.softPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.inkFaint,
    fontSize: 10,
    marginTop: 3,
  },
});
