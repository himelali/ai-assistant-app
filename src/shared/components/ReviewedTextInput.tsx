import React, {useMemo, useState} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '../theme/colors';
import {radius} from '../theme/radius';
import {useAppTheme} from '../theme/ThemeContext';
import {copyToClipboard} from '../utils/clipboard';
import {reviewUserText} from '../utils/textReview';
import {useToast} from './Toast';

type Props = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export function ReviewedTextInput({containerStyle, inputStyle, onChangeText, value, defaultValue, ...props}: Props) {
  const [draft, setDraft] = useState(defaultValue ?? '');
  const text = value ?? draft;
  const {theme} = useAppTheme();
  const {showToast} = useToast();

  const review = useMemo(() => reviewUserText(text), [text]);
  const hasReview = text.trim().length > 0 && review.issues.length > 0;

  function update(next: string) {
    if (value === undefined) {
      setDraft(next);
    }
    onChangeText?.(next);
  }

  function applySuggestion() {
    update(review.correctedText);
    showToast('Text corrected');
  }

  return (
    <View style={containerStyle}>
      <TextInput
        {...props}
        value={text}
        onChangeText={update}
        style={inputStyle}
      />
      {hasReview ? (
        <View style={[styles.review, {backgroundColor: theme.surface, borderColor: theme.line}]}>
          <Text style={[styles.reviewTitle, {color: theme.text}]}>Text review</Text>
          <Text style={[styles.reviewBody, {color: theme.textSoft}]}>
            {review.issues.map(issue => issue.message).join(' ')}
          </Text>
          <Text style={[styles.suggestion, {color: theme.text}]}>{review.correctedText}</Text>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" onPress={applySuggestion} style={styles.actionButton}>
              <Text style={styles.actionText}>Apply</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                copyToClipboard(review.correctedText);
                showToast('Copied corrected text');
              }}
              style={styles.actionButton}>
              <Text style={styles.actionText}>Copy</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  review: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    marginTop: 8,
    padding: 10,
  },
  reviewTitle: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  reviewBody: {
    color: colors.inkSoft,
    fontSize: 12,
    lineHeight: 17,
  },
  suggestion: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 9,
  },
  actionButton: {
    borderRadius: radius.sm,
    backgroundColor: colors.softPurple,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  actionText: {
    color: colors.primaryStart,
    fontSize: 11,
    fontWeight: '700',
  },
});
