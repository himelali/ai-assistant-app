import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import {radius} from '../theme/radius';
import {useAppTheme} from '../theme/ThemeContext';
import {useToast} from './Toast';
import {copyToClipboard} from '../utils/clipboard';

export function SuggestionCard({
  label,
  text,
  selected,
  onPress,
}: {
  label: string;
  text: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const {theme} = useAppTheme();
  const {showToast} = useToast();

  function handlePress() {
    if (selected) {
      copyToClipboard(text);
      showToast('Copied suggestion');
      return;
    }
    onPress?.();
  }

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={() => {
        copyToClipboard(text);
        showToast('Copied suggestion');
      }}
      accessibilityRole="button"
      accessibilityLabel={`${selected ? 'Copy' : 'Select'} ${label} suggestion`}
      style={[
        styles.card,
        {backgroundColor: theme.surface, borderColor: theme.line},
        selected && styles.selected,
      ]}>
      <View style={[styles.accent, selected && styles.accentSelected]} />
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.text, {color: theme.text}]}>{text}</Text>
      </View>
      <View style={[styles.check, selected && styles.checkOn]}>
        <Text style={styles.checkText}>✓</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  selected: {
    borderColor: colors.primaryStart,
    backgroundColor: colors.softPurple,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.line,
  },
  accentSelected: {
    backgroundColor: colors.primaryStart,
  },
  content: {
    flex: 1,
  },
  label: {
    color: colors.primaryStart,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  text: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 19,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.line,
  },
  checkOn: {
    backgroundColor: colors.primaryStart,
  },
  checkText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
});
