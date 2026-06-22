import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../app/config/routes';
import {AppCard} from '../../shared/components/AppCard';
import {GlassCard} from '../../shared/components/GlassCard';
import {GradientButton} from '../../shared/components/GradientButton';
import {AppIcon} from '../../shared/components/AppIcon';
import {QuickActionCard} from '../../shared/components/QuickActionCard';
import {UsageCreditCard} from '../../shared/components/UsageCreditCard';
import {useLocalization} from '../../shared/localization/LocalizationContext';
import {quickActions, usage, user} from '../../shared/mock/mockData';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const {theme} = useAppTheme();
  const {t} = useLocalization();
  const localizedQuickActions = quickActions.map(action => ({
    ...action,
    title: t(action.titleKey),
    subtitle: t(action.subtitleKey),
  }));

  return (
    <AppScreen style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.top}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{user.initial}</Text></View>
          <View style={styles.greeting}>
            <Text style={[styles.faint, {color: theme.textFaint}]}>{t('homeGreeting')}</Text>
            <Text style={[typography.title, {color: theme.text}]}>Himel</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open notifications"
            onPress={() => navigation.navigate('Notifications')}
            style={[styles.bell, {backgroundColor: theme.surface, borderColor: theme.line}]}>
            <AppIcon name="bell-outline" size={20} color={theme.text} />
          </Pressable>
        </View>
        <UsageCreditCard used={usage.dailyCredits} total={usage.totalCredits} />
        <GlassCard style={styles.keyboardCard}>
          <Text style={[typography.eyebrow, {color: theme.textFaint}]}>{t('homeKeyboardStatus')}</Text>
          <Text style={[typography.h2, styles.cardTitle, {color: theme.text}]}>{t('homeKeyboardReady')}</Text>
          <Text style={[typography.body, {color: theme.textSoft}]}>{t('homeKeyboardReadyBody')}</Text>
          <GradientButton title={t('homeOpenKeyboard')} small onPress={() => navigation.navigate('KeyboardPreview')} style={styles.inlineButton} />
        </GlassCard>
        <Text style={[typography.title, styles.sectionTitle, {color: theme.text}]}>{t('homeQuickActions')}</Text>
        <View style={styles.grid}>
          {localizedQuickActions.map(action => (
            <View key={action.titleKey} style={styles.gridItem}>
              <QuickActionCard {...action} onPress={() => navigation.navigate(action.route as never)} />
            </View>
          ))}
        </View>
        <AppCard style={styles.proCard}>
          <View>
            <Text style={[typography.title, {color: theme.text}]}>{t('homeGoPro')}</Text>
            <Text style={[typography.small, {color: theme.textFaint}]}>{t('homeGoProBody')}</Text>
          </View>
          <GradientButton title={t('commonUpgrade')} small onPress={() => navigation.navigate('Premium')} />
        </AppCard>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 18, paddingBottom: 28},
  top: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  avatar: {width: 38, height: 38, borderRadius: 13, backgroundColor: colors.primaryStart, borderWidth: 1.5, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center'},
  avatarText: {color: colors.surface, fontWeight: '600'},
  greeting: {flex: 1, marginLeft: 10},
  faint: {fontSize: 11, color: colors.inkFaint},
  bell: {width: 36, height: 36, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center'},
  keyboardCard: {marginTop: 18},
  cardTitle: {fontSize: 17, marginVertical: 7},
  inlineButton: {alignSelf: 'flex-start', marginTop: 16},
  sectionTitle: {marginTop: 22, marginBottom: 12},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  gridItem: {width: '48.5%'},
  proCard: {marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
});
