import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../app/config/routes';
import {AppIcon} from '../../shared/components/AppIcon';
import {useLocalization} from '../../shared/localization/LocalizationContext';
import {colors} from '../../shared/theme/colors';
import {typography} from '../../shared/theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export function SplashScreen({navigation}: Props) {
  const {t} = useLocalization();

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Onboarding'), 1100);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={[styles.glow, styles.glowA]} />
      <View style={[styles.glow, styles.glowB]} />
      <View style={styles.logo}>
        <AppIcon name="star-four-points-outline" size={38} color={colors.surface} />
      </View>
      <Text style={styles.name}>{t('appName')}</Text>
      <Text style={styles.subtitle}>{t('appSubtitle')}</Text>
      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
  },
  subtitle: {
    ...typography.body,
    color: colors.inkFaint,
    marginTop: 8,
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
    backgroundColor: colors.accent,
  },
});
