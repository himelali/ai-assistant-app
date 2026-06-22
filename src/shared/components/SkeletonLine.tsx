import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '../theme/colors';
import {radius} from '../theme/radius';

export function SkeletonLine({width = '100%', style}: {width?: ViewStyle['width']; style?: ViewStyle}) {
  return <View style={[styles.line, {width}, style]} />;
}

const styles = StyleSheet.create({
  line: {
    height: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.line,
    marginBottom: 9,
  },
});
