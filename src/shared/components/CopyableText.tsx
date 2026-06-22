import React from 'react';
import {Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle} from 'react-native';
import {useToast} from './Toast';
import {copyToClipboard} from '../utils/clipboard';

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

  function copy() {
    copyToClipboard(text);
    showToast(toastMessage);
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Copy text"
      onPress={copy}
      style={({pressed}) => [containerStyle, pressed && styles.pressed]}>
      {children ?? <Text style={style}>{text}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {opacity: 0.72},
});
