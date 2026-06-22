import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {AppHeader} from '../../shared/components/AppHeader';
import {AppCard} from '../../shared/components/AppCard';
import {AppIcon} from '../../shared/components/AppIcon';
import {useLocalization} from '../../shared/localization/LocalizationContext';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

export function AboutTypeAIScreen() {
  const {theme, isDark} = useAppTheme();
  const {t} = useLocalization();
  const navigation = useNavigation<any>();

  return (
    <AppScreen style={styles.safe}>
      <AppHeader title={t('aboutTitle')} onBack={() => navigation.navigate('Settings')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <AppIcon name="star-four-points-outline" size={30} color={colors.surface} />
          </View>
          <Text style={[typography.h1, {color: theme.text}]}>TypeAI</Text>
          <Text style={[typography.body, styles.subtitle, {color: theme.textSoft}]}>{t('appSubtitle')}</Text>
        </View>

        <AppCard style={styles.card}>
          <Text style={[typography.sectionHeader, {color: theme.text}]}>Prototype status</Text>
          <Text style={[typography.body, styles.body, {color: theme.textSoft}]}>TypeAI is currently a UI prototype. AI calls, native keyboard suggestions, payment, and backend sync are intentionally mocked for now.</Text>
        </AppCard>

        <AppCard style={styles.card}>
          <Text style={[typography.sectionHeader, {color: theme.text}]}>Future integration points</Text>
          {['Server-powered text suggestions', 'Android input method service', 'iOS keyboard extension', 'Subscription and billing backend', 'Privacy controls and data export'].map(item => (
            <View key={item} style={styles.item}>
              <AppIcon name="check-circle-outline" size={18} color={isDark ? colors.accent : colors.primaryStart} />
              <Text style={[typography.body, styles.itemText, {color: theme.textSoft}]}>{item}</Text>
            </View>
          ))}
        </AppCard>

        <Text style={[typography.small, styles.version, {color: theme.textFaint}]}>Version 0.1.0 UI Prototype</Text>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 18, gap: 12, paddingBottom: 28},
  hero: {alignItems: 'center', paddingVertical: 18},
  logo: {width: 66, height: 66, borderRadius: 20, backgroundColor: colors.primaryStart, borderWidth: 2, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 12},
  subtitle: {textAlign: 'center', marginTop: 4},
  card: {gap: 8, shadowOpacity: 0.03},
  body: {marginTop: 4},
  item: {flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 8},
  itemText: {flex: 1},
  version: {textAlign: 'center', marginTop: 8},
});
