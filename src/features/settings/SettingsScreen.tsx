import React, {useState} from 'react';
import {Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Switch, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../app/config/routes';
import {AppCard} from '../../shared/components/AppCard';
import {AppHeader} from '../../shared/components/AppHeader';
import {AppIcon} from '../../shared/components/AppIcon';
import {BottomSheet} from '../../shared/components/BottomSheet';
import {LanguageChip} from '../../shared/components/LanguageChip';
import {useToast} from '../../shared/components/Toast';
import {useLocalization} from '../../shared/localization/LocalizationContext';
import {LanguageCode} from '../../shared/localization/translations';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function Row({icon, title, subtitle, onPress, danger}: {icon: string; title: string; subtitle?: string; onPress?: () => void; danger?: boolean}) {
  const {theme, isDark} = useAppTheme();
  const iconColor = danger ? colors.error : isDark ? colors.accent : colors.primaryStart;

  return (
    <Pressable onPress={onPress} style={[styles.row, {borderBottomColor: theme.line}]}>
      <View style={styles.rowText}><Text style={[styles.rowTitle, {color: theme.text}, danger && styles.danger]}>{title}</Text>{subtitle ? <Text style={[typography.small, {color: theme.textFaint}]}>{subtitle}</Text> : null}</View>
      <AppIcon name={icon} size={20} color={iconColor} />
      <Text style={[styles.chevron, {color: theme.textFaint}]}>›</Text>
    </Pressable>
  );
}

function ToggleRow({icon, title}: {icon: string; title: string}) {
  const [value, setValue] = useState(true);
  const {theme, isDark} = useAppTheme();

  return (
    <View style={[styles.row, {borderBottomColor: theme.line}]}>
      <View style={styles.toggleTitle}>
        <AppIcon name={icon} size={20} color={isDark ? colors.accent : colors.primaryStart} />
        <Text style={[styles.rowTitle, {color: theme.text}]}>{title}</Text>
      </View>
      <Switch value={value} onValueChange={setValue} trackColor={{true: colors.primaryStart}} />
    </View>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const {showToast} = useToast();
  const {isDark, theme, toggleTheme} = useAppTheme();
  const {language, languageNativeLabel, languageOptions, setLanguage, t} = useLocalization();
  const [languageSheet, setLanguageSheet] = useState(false);

  async function handleThemeToggle() {
    const nextMode = await toggleTheme();
    showToast(`${nextMode === 'dark' ? 'Dark' : 'Light'} theme enabled`);
  }

  async function handleLanguageSelect(nextLanguage: LanguageCode) {
    await setLanguage(nextLanguage);
    const option = languageOptions.find(item => item.code === nextLanguage);
    setLanguageSheet(false);
    showToast(`${t('settingsLanguageSet')} ${option?.nativeLabel ?? nextLanguage}`);
  }

  async function shareTypeAI() {
    const url = Platform.select({
      ios: 'https://apps.apple.com/app/typeai-ai-keyboard/id0000000000',
      android: 'https://play.google.com/store/apps/details?id=com.himelali.typeai',
      default: 'https://typeai.app',
    });
    await Share.share({
      title: 'TypeAI',
      message: `Try TypeAI - AI Keyboard & Communication Assistant: ${url}`,
      url,
    });
  }

  async function rateTypeAI() {
    const url = Platform.select({
      ios: 'itms-apps://itunes.apple.com/app/id0000000000?action=write-review',
      android: 'market://details?id=com.himelali.typeai',
      default: 'https://typeai.app',
    });

    try {
      const supported = await Linking.canOpenURL(url);
      await Linking.openURL(supported ? url : 'https://typeai.app');
    } catch {
      showToast('Store link unavailable in this prototype');
    }
  }

  return (
    <AppScreen style={styles.safe}>
      <AppHeader title={t('settingsTitle')} onBack={() => navigation.navigate('Main', {screen: 'Profile'})} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.sectionHeader, {color: theme.text}]}>{t('settingsPreferences')}</Text>
        <AppCard style={styles.card}><Row icon="translate" title={t('settingsLanguage')} subtitle={languageNativeLabel} onPress={() => setLanguageSheet(true)} /><Row icon={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'} title={isDark ? t('settingsThemeLight') : t('settingsThemeDark')} subtitle={isDark ? t('settingsDarkActive') : t('settingsLightActive')} onPress={handleThemeToggle} /><Row icon="keyboard-outline" title={t('settingsKeyboardSettings')} subtitle={t('settingsKeyboardSubtitle')} onPress={() => navigation.navigate('KeyboardSetup')} /></AppCard>
        <Text style={[typography.sectionHeader, {color: theme.text}]}>{t('settingsAccount')}</Text>
        <AppCard style={styles.card}><Row icon="history" title={t('settingsAiHistory')} onPress={() => navigation.navigate('Main' as never)} /><Row icon="cloud-sync-outline" title={t('settingsSync')} subtitle={t('settingsEnabled')} onPress={() => showToast('Sync mocked')} /><Row icon="trash-can-outline" title={t('settingsClearCache')} onPress={() => showToast('Cache cleared')} /></AppCard>
        <Text style={[typography.sectionHeader, {color: theme.text}]}>{t('settingsPrivacy')}</Text>
        <AppCard style={styles.card}><ToggleRow icon="content-save-outline" title={t('settingsSaveHistory')} /><ToggleRow icon="clipboard-text-outline" title={t('settingsClipboard')} /><ToggleRow icon="bell-outline" title={t('settingsExternalSuggestions')} /><ToggleRow icon="auto-fix" title={t('settingsAutoGenerate')} /></AppCard>
        <Text style={[typography.sectionHeader, {color: theme.text}]}>{t('settingsSupport')}</Text>
        <AppCard style={styles.card}><Row icon="help-circle-outline" title={t('settingsHelp')} onPress={() => navigation.navigate('HelpSupport')} /><Row icon="star-outline" title={t('settingsRate')} onPress={rateTypeAI} /><Row icon="share-variant-outline" title={t('settingsShare')} onPress={shareTypeAI} /><Row icon="information-outline" title={t('settingsAbout')} subtitle="v0.1 UI prototype" onPress={() => navigation.navigate('AboutTypeAI')} /></AppCard>
        <Text style={[typography.sectionHeader, {color: theme.text}]}>{t('settingsNotifications')}</Text>
        <AppCard style={styles.card}><ToggleRow icon="bell-ring-outline" title={t('settingsPush')} /><ToggleRow icon="email-newsletter" title={t('settingsEmailUpdates')} /></AppCard>
      </ScrollView>
      <BottomSheet visible={languageSheet} onClose={() => setLanguageSheet(false)}>
        <Text style={[typography.h2, styles.sheetTitle, {color: theme.text}]}>{t('settingsChooseLanguage')}</Text>
        <View style={styles.langs}>
          {languageOptions.map(option => (
            <LanguageChip
              key={option.code}
              label={`${option.nativeLabel} · ${option.label}`}
              selected={option.code === language}
              onPress={() => handleLanguageSelect(option.code)}
            />
          ))}
        </View>
      </BottomSheet>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 20, gap: 10, paddingBottom: 30},
  card: {padding: 0, overflow: 'hidden', shadowOpacity: 0},
  row: {minHeight: 58, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  rowText: {flex: 1},
  toggleTitle: {flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10},
  rowTitle: {fontSize: 13, fontWeight: '600', color: colors.ink},
  chevron: {color: colors.inkFaint, fontSize: 20},
  danger: {color: colors.error},
  sheetTitle: {fontSize: 20, marginBottom: 14},
  langs: {gap: 10},
});
