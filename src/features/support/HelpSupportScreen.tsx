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

const topics = [
  {icon: 'keyboard-outline', title: 'Keyboard setup', body: 'This prototype shows setup steps only. Native Android keyboard and iOS keyboard extension work will be added later.'},
  {icon: 'robot-outline', title: 'AI suggestions', body: 'All replies, rewrites, translations, and summaries are mock data. Server integration is intentionally not connected yet.'},
  {icon: 'camera-outline', title: 'Profile photo', body: 'Camera and gallery selection are local device actions for the demo profile experience.'},
  {icon: 'shield-lock-outline', title: 'Privacy', body: 'No message content is sent to a backend in this prototype. Future API integration should add consent, retention, and deletion controls.'},
];

export function HelpSupportScreen() {
  const {theme, isDark} = useAppTheme();
  const {t} = useLocalization();
  const navigation = useNavigation<any>();

  return (
    <AppScreen style={styles.safe}>
      <AppHeader title={t('helpTitle')} onBack={() => navigation.navigate('Settings')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.sectionHeader, {color: theme.text}]}>{t('settingsSupport')}</Text>
        <Text style={[typography.body, styles.intro, {color: theme.textSoft}]}>Find quick guidance for the current UI-only TypeAI prototype.</Text>
        {topics.map(topic => (
          <AppCard key={topic.title} style={styles.topic}>
            <View style={[styles.iconWrap, {backgroundColor: isDark ? colors.darkSurface : colors.surfaceAlt}]}>
              <AppIcon name={topic.icon} size={22} color={isDark ? colors.accent : colors.primaryStart} />
            </View>
            <View style={styles.topicText}>
              <Text style={[styles.title, {color: theme.text}]}>{topic.title}</Text>
              <Text style={[typography.body, {color: theme.textSoft}]}>{topic.body}</Text>
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 18, gap: 10, paddingBottom: 28},
  intro: {marginBottom: 6},
  topic: {flexDirection: 'row', gap: 12, shadowOpacity: 0.03},
  iconWrap: {width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center'},
  topicText: {flex: 1, gap: 4},
  title: {fontSize: 15, lineHeight: 21, fontWeight: '600'},
});
