import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../theme/colors';
import {radius} from '../theme/radius';
import {useAppTheme} from '../theme/ThemeContext';

export function ToneChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const {theme} = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{selected}}
      onPress={onPress}
      style={[
        styles.chip,
        {backgroundColor: theme.surface, borderColor: theme.line},
        selected && styles.selected,
      ]}>
      <Text numberOfLines={1} style={[styles.text, {color: theme.text}, selected && styles.selectedText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 48,
    minWidth: 86,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.primaryStart,
    borderColor: colors.primaryEnd,
  },
  text: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 13,
  },
  selectedText: {
    color: colors.surface,
  },
});
