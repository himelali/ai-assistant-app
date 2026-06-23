import React, {useEffect, useMemo, useState} from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useToast} from './Toast';
import {copyToClipboard} from '../utils/clipboard';
import {reviewUserText} from '../utils/textReview';
import {colors} from '../theme/colors';
import {radius} from '../theme/radius';
import {useAppTheme} from '../theme/ThemeContext';

export function CopyableText({
  text,
  children,
  style,
  containerStyle,
  toastMessage = 'Copied to clipboard',
}: {
  text: string;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  toastMessage?: string;
}) {
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  const [displayText, setDisplayText] = useState(text);
  const [selection, setSelection] = useState({start: 0, end: 0});
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    setDisplayText(text);
    setSelection({start: 0, end: 0});
    setSuggestion('');
  }, [text]);

  const selectedText = useMemo(() => {
    const start = Math.min(selection.start, selection.end);
    const end = Math.max(selection.start, selection.end);
    return displayText.slice(start, end);
  }, [displayText, selection]);

  const hasSelection = selectedText.length > 0;

  function copy() {
    copyToClipboard(hasSelection ? selectedText : displayText);
    showToast(toastMessage);
  }

  function clearSelection() {
    setSelection({start: 0, end: 0});
    setSuggestion('');
  }

  function removeSelection() {
    if (!hasSelection) {
      return;
    }
    const start = Math.min(selection.start, selection.end);
    const end = Math.max(selection.start, selection.end);
    setDisplayText(`${displayText.slice(0, start)}${displayText.slice(end)}`.trim());
    showToast('Selected text removed');
    clearSelection();
  }

  function suggestSelection() {
    if (!hasSelection) {
      return;
    }
    const review = reviewUserText(selectedText);
    setSuggestion(review.correctedText || selectedText);
  }

  function handleSelectionChange(event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) {
    setSelection(event.nativeEvent.selection);
    setSuggestion('');
  }

  if (children) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Copy text"
        onPress={copy}
        style={({pressed}) => [containerStyle, pressed && styles.pressed]}>
        {children}
      </Pressable>
    );
  }

  return (
    <View style={containerStyle}>
      {hasSelection ? (
        <View style={[styles.tooltip, {backgroundColor: theme.surface, borderColor: theme.line}]}>
          <Pressable accessibilityRole="button" onPress={copy} style={styles.tooltipButton}>
            <Text style={styles.tooltipText}>Copy</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={clearSelection} style={styles.tooltipButton}>
            <Text style={styles.tooltipText}>Deselect</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={removeSelection} style={styles.tooltipButton}>
            <Text style={[styles.tooltipText, styles.removeText]}>Remove</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={suggestSelection} style={styles.tooltipButton}>
            <Text style={styles.tooltipText}>Suggestion</Text>
          </Pressable>
        </View>
      ) : null}
      {suggestion ? (
        <View style={[styles.suggestion, {backgroundColor: theme.canvas, borderColor: theme.line}]}>
          <Text style={[styles.suggestionText, {color: theme.text}]}>{suggestion}</Text>
          <View style={styles.suggestionActions}>
            <Pressable accessibilityRole="button" onPress={() => {copyToClipboard(suggestion); showToast('Copied suggestion');}} style={styles.suggestionButton}>
              <Text style={styles.tooltipText}>Copy</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => setSuggestion('')} style={styles.suggestionButton}>
              <Text style={styles.tooltipText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
      <TextInput
        multiline
        editable={false}
        scrollEnabled={false}
        value={displayText}
        selection={selection}
        onSelectionChange={handleSelectionChange}
        contextMenuHidden
        accessibilityLabel="Selectable copy text"
        style={[styles.selectableText, {color: theme.text}, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {opacity: 0.72},
  selectableText: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 21,
    padding: 0,
  },
  tooltip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
    padding: 5,
    shadowColor: colors.dark,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 2,
  },
  tooltipButton: {
    borderRadius: radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  tooltipText: {
    color: colors.primaryStart,
    fontSize: 11,
    fontWeight: '700',
  },
  removeText: {
    color: colors.error,
  },
  suggestion: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    marginBottom: 8,
    padding: 10,
  },
  suggestionText: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 20,
  },
  suggestionActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  suggestionButton: {
    borderRadius: radius.sm,
    backgroundColor: colors.softPurple,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
});
