import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import {radius} from '../theme/radius';

export function UsageCreditCard({used, total}: {used: number; total: number}) {
  const percent = Math.round((used / total) * 100);
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>Daily AI Credits</Text>
        <Text style={styles.value}>
          {used} <Text style={styles.total}>/ {total}</Text>
        </Text>
      </View>
      <View style={styles.ring}>
        <Text style={styles.percent}>{percent}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: colors.inkFaint,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.surface,
    fontSize: 19,
    fontWeight: '600',
    marginTop: 4,
  },
  total: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  ring: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 6,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: '600',
  },
});
