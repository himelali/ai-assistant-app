import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {AppHeader} from '../../shared/components/AppHeader';
import {AppCard} from '../../shared/components/AppCard';
import {AppIcon} from '../../shared/components/AppIcon';
import {useToast} from '../../shared/components/Toast';
import {useLocalization} from '../../shared/localization/LocalizationContext';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

const initialNotifications = [
  {id: '1', icon: 'keyboard-outline', title: 'Keyboard setup pending', body: 'Enable TypeAI keyboard to preview future server suggestions.', time: 'Now', unread: true},
  {id: '2', icon: 'star-four-points-outline', title: 'Daily credits refreshed', body: 'Your demo AI credits are ready for today.', time: '2h ago', unread: true},
  {id: '3', icon: 'shield-check-outline', title: 'Privacy reminder', body: 'No real API, payment, or keyboard data is connected in this prototype.', time: 'Yesterday', unread: false},
];

export function NotificationsScreen() {
  const {theme, isDark} = useAppTheme();
  const {showToast} = useToast();
  const {t} = useLocalization();
  const [notifications, setNotifications] = useState(initialNotifications);

  function markAllRead() {
    setNotifications(items => items.map(item => ({...item, unread: false})));
    showToast('Notifications marked as read');
  }

  return (
    <AppScreen style={styles.safe}>
      <AppHeader title={t('notificationsTitle')} right={<Pressable accessibilityRole="button" onPress={markAllRead}><Text style={[styles.markRead, {color: isDark ? colors.accent : colors.primaryStart}]}>{t('notificationsReadAll')}</Text></Pressable>} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.sectionHeader, {color: theme.text}]}>Today</Text>
        {notifications.map(item => (
          <AppCard key={item.id} style={styles.card}>
            <View style={[styles.iconWrap, {backgroundColor: isDark ? colors.darkSurface : colors.surfaceAlt}]}>
              <AppIcon name={item.icon} size={21} color={isDark ? colors.accent : colors.primaryStart} />
            </View>
            <View style={styles.textWrap}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, {color: theme.text}]}>{item.title}</Text>
                {item.unread ? <View style={styles.dot} /> : null}
              </View>
              <Text style={[typography.body, styles.body, {color: theme.textSoft}]}>{item.body}</Text>
              <Text style={[typography.small, {color: theme.textFaint}]}>{item.time}</Text>
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
  markRead: {fontSize: 12, fontWeight: '600'},
  card: {flexDirection: 'row', gap: 12, shadowOpacity: 0.03},
  iconWrap: {width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center'},
  textWrap: {flex: 1},
  titleRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10},
  title: {fontSize: 14, lineHeight: 20, fontWeight: '600'},
  body: {marginTop: 3, marginBottom: 6},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent},
});
