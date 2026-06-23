import {StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import {radius} from '../theme/radius';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

export const screenStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: typography.h1,
  h2: typography.h2,
  body: typography.body,
  small: typography.small,
  eyebrow: typography.eyebrow,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionGap: {
    marginBottom: spacing.xl,
  },
});

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pager: {
    flex: 1,
    alignSelf: 'stretch',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.28,
  },
  glowA: {
    backgroundColor: colors.primaryStart,
    top: -60,
    left: -70,
  },
  glowB: {
    backgroundColor: colors.primaryEnd,
    bottom: -50,
    right: -70,
  },
  logo: {
    width: 86,
    height: 86,
    borderRadius: 24,
    backgroundColor: colors.primaryStart,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
    shadowColor: colors.primaryStart,
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: {width: 0, height: 18},
    elevation: 8,
  },
  name: {
    ...typography.h1,
    color: colors.surface,
    marginTop: 22,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.inkFaint,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  okButton: {
    minWidth: 116,
    minHeight: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xxl,
  },
  okPressed: {
    opacity: 0.78,
  },
  okText: {
    color: colors.dark,
    fontSize: 13,
    fontWeight: '800',
  },
  dots: {
    position: 'absolute',
    bottom: 58,
    flexDirection: 'row',
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.accent,
  },
});

export const loginStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    padding: 22,
    paddingTop: 52,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 17,
    backgroundColor: colors.primaryStart,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  intro: {
    marginTop: 7,
    marginBottom: 22,
  },
  label: {
    fontSize: 11,
    color: colors.inkSoft,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 45,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 13,
    marginBottom: 12,
    color: colors.ink,
    fontSize: 13,
  },
  forgot: {
    alignSelf: 'flex-end',
    color: colors.primaryStart,
    fontWeight: '600',
    fontSize: 11,
    marginBottom: 18,
  },
  divider: {
    textAlign: 'center',
    color: colors.inkFaint,
    fontSize: 11,
    marginVertical: 15,
  },
  stackBtn: {
    marginTop: 10,
  },
  googleBtn: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  facebookBtn: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  appleBtn: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  signup: {
    textAlign: 'center',
    color: colors.inkSoft,
    marginTop: 20,
    fontSize: 12,
  },
  link: {
    color: colors.primaryStart,
    fontWeight: '600',
  },
});
