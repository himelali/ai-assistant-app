import {TextStyle} from 'react-native';
import {colors} from './colors';

export const typography = {
  h1: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '500',
    color: colors.ink,
  } satisfies TextStyle,
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '500',
    color: colors.ink,
  } satisfies TextStyle,
  title: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
    color: colors.ink,
  } satisfies TextStyle,
  body: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.inkSoft,
  } satisfies TextStyle,
  small: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.inkFaint,
  } satisfies TextStyle,
  eyebrow: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: colors.primaryStart,
  } satisfies TextStyle,
  navTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '500',
    color: colors.ink,
  } satisfies TextStyle,
  sectionHeader: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.primaryStart,
  } satisfies TextStyle,
};
