import React, {useEffect, useState} from 'react';
import {Platform, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../app/config/routes';
import {AppCard} from '../../shared/components/AppCard';
import {AppHeader} from '../../shared/components/AppHeader';
import {GradientButton} from '../../shared/components/GradientButton';
import {GhostButton} from '../../shared/components/GhostButton';
import {useToast} from '../../shared/components/Toast';
import {
  isTypeAiKeyboardEnabled,
  openSystemKeyboardSettings,
  showSystemKeyboardPicker,
} from '../../shared/native/KeyboardSettings';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';
import {
  KeyboardPermissionItem,
  keyboardPermissionItems,
  openPermissionSettings,
  requestKeyboardRuntimePermission,
} from '../../shared/utils/keyboardPermissionManager';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function KeyboardSetupScreen() {
  const navigation = useNavigation<Nav>();
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  const [keyboardEnabled, setKeyboardEnabled] = useState(false);
  const isAndroid = Platform.OS === 'android';
  const steps = isAndroid
    ? ['Enable TypeAI Keyboard', 'Use TypeAI Add-on from the Android text selection menu when available', 'Select TypeAI in WhatsApp, Messenger, or Telegram for keyboard actions', 'Select editable text or copy chat text', 'Use TypeAI Copy, Remove, and Suggestion actions']
    : ['Enable TypeAI Keyboard extension', 'Allow Full Access for pasteboard suggestions', 'Copy text in WhatsApp, Messenger, or Telegram', 'Open TypeAI keyboard and request a suggestion'];
  const flow = [
    'On Android, supported apps can show TypeAI Add-on beside the host app selection actions. Otherwise the user copies text and opens the TypeAI keyboard.',
    'TypeAI keyboard receives selected text when the host input allows it, or reads copied text after Use Copy',
    'Mock API returns a correction or reply suggestion',
    'User copies the suggestion or inserts it from the TypeAI keyboard',
  ];

  async function refreshKeyboardStatus() {
    const enabled = await isTypeAiKeyboardEnabled();
    setKeyboardEnabled(enabled);
  }

  async function openKeyboardSettings() {
    await openSystemKeyboardSettings();
    showToast('Enable TypeAI Keyboard in system settings');
  }

  async function openKeyboardPicker() {
    await showSystemKeyboardPicker();
    showToast('Select TypeAI Keyboard from the picker');
  }

  async function handlePermissionAction(item: KeyboardPermissionItem) {
    if (item.id === 'keyboard' && isAndroid) {
      await openKeyboardSettings();
      return;
    }

    if (item.status === 'runtime') {
      const granted = await requestKeyboardRuntimePermission(item.id);
      showToast(granted ? `${item.title} ready` : `${item.title} permission needs app settings`);
      return;
    }

    if (item.actionLabel) {
      await openPermissionSettings();
      showToast('Open system settings to finish this step');
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', refreshKeyboardStatus);
    refreshKeyboardStatus();
    return unsubscribe;
  }, [navigation]);

  return (
    <AppScreen style={styles.safe}>
      <AppHeader
        title="AI Keyboard"
        onBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
            return;
          }
          navigation.navigate('Settings');
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h1, {color: theme.text}]}>Set up TypeAI keyboard helper</Text>
        <Text style={[typography.body, styles.intro, {color: theme.textSoft}]}>
          TypeAI works inside WhatsApp, Messenger, Telegram, and other chat apps through the custom keyboard. On Android, supported apps can also expose TypeAI Add-on as an extra text action beside the host app's own selection menu.
        </Text>
        <AppCard style={styles.statusCard}>
          <Text style={[typography.title, {color: theme.text}]}>Keyboard status</Text>
          <Text style={[typography.body, {color: keyboardEnabled ? colors.success : theme.textSoft}]}>
            {isAndroid
              ? keyboardEnabled
                ? 'TypeAI Keyboard is enabled on this device.'
                : 'TypeAI Keyboard is installed but not enabled yet.'
              : 'TypeAI iOS keyboard extension is bundled. iOS users enable it manually, then switch with the globe key.'}
          </Text>
        </AppCard>
        <AppCard style={styles.flowCard}>
          <Text style={[typography.title, {color: theme.text}]}>Current app flow</Text>
          {flow.map((item, index) => (
            <Text key={item} style={[typography.body, styles.flowItem, {color: theme.textSoft}]}>
              {index + 1}. {item}
            </Text>
          ))}
        </AppCard>
        {!isAndroid ? (
          <AppCard style={styles.flowCard}>
            <Text style={[typography.title, {color: theme.text}]}>iOS behavior</Text>
            <Text style={[typography.body, styles.flowItem, {color: theme.textSoft}]}>
              iOS users manually enable the TypeAI keyboard extension, allow Full Access for pasteboard-powered suggestions, copy text from WhatsApp or another app, switch to TypeAI with the globe key, then request a mock suggestion.
            </Text>
          </AppCard>
        ) : null}
        {steps.map((step, index) => (
          <AppCard key={step} style={styles.step}>
            <Text style={[styles.stepNum, {color: theme.textFaint}]}>Step {index + 1}</Text>
            <Text style={[typography.title, {color: theme.text}]}>{step}</Text>
            <Text style={[typography.small, {color: theme.textFaint}]}>
              {isAndroid
                ? 'Android IME flow prepared for mock API suggestions from copied text.'
                : 'iOS keyboard extension flow prepared for mock API suggestions from copied text.'}
            </Text>
          </AppCard>
        ))}
        <AppCard style={styles.note}>
          <Text style={[typography.title, {color: theme.text}]}>Mock API now, real API later</Text>
          <Text style={[typography.body, {color: theme.textSoft}]}>
            The keyboard helper receives copied context, calls a mock suggestion handler, and inserts the selected reply. Your real AI endpoint can replace the mock request later without changing the user journey.
          </Text>
        </AppCard>
        <Text style={[typography.eyebrow, styles.permissionTitle, {color: theme.textFaint}]}>Permission readiness</Text>
        {keyboardPermissionItems.map(item => (
          <AppCard key={item.id} style={styles.permission}>
            <View style={styles.permissionHeader}>
              <View style={styles.permissionText}>
                <Text style={[typography.title, {color: theme.text}]}>{item.title}</Text>
                <Text style={[typography.small, styles.permissionBody, {color: theme.textFaint}]}>{item.body}</Text>
              </View>
              <View style={[styles.statusPill, statusStyle(item.status)]}>
                <Text style={styles.statusText}>{statusLabel(item.status)}</Text>
              </View>
            </View>
            {item.actionLabel ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.actionLabel}
                onPress={() => handlePermissionAction(item)}
                style={({pressed}) => [styles.permissionAction, pressed && styles.pressed]}>
                <Text style={styles.permissionActionText}>{item.actionLabel}</Text>
              </Pressable>
            ) : null}
          </AppCard>
        ))}
        {!isAndroid ? (
          <AppCard style={styles.note}>
            <Text style={[typography.title, {color: theme.text}]}>iOS note</Text>
            <Text style={[typography.body, {color: theme.textSoft}]}>
              iOS does not allow apps to programmatically open the keyboard picker or change the active keyboard. TypeAI will work as a keyboard extension helper after the user enables it manually.
            </Text>
          </AppCard>
        ) : (
          <>
            <GhostButton title="Open Keyboard Settings" block onPress={openKeyboardSettings} />
            <GhostButton title="Show Keyboard Picker" block onPress={openKeyboardPicker} style={styles.continue} />
          </>
        )}
        <GradientButton title="Continue" block onPress={() => navigation.navigate('KeyboardPreview')} style={styles.continue} />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 20, paddingBottom: 34},
  intro: {marginTop: 8, marginBottom: 18},
  step: {marginBottom: 10},
  statusCard: {marginBottom: 10, borderColor: colors.accent},
  flowCard: {marginBottom: 10},
  flowItem: {marginTop: 8},
  stepNum: {...typography.eyebrow, marginBottom: 6},
  note: {marginBottom: 10, backgroundColor: colors.softPurple},
  permissionTitle: {marginBottom: 10},
  permission: {marginBottom: 10, shadowOpacity: 0},
  permissionHeader: {flexDirection: 'row', alignItems: 'flex-start', gap: 10},
  permissionText: {flex: 1},
  permissionBody: {marginTop: 4},
  statusPill: {borderWidth: 1, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4},
  statusText: {fontSize: 10, fontWeight: '700', color: colors.primaryStart},
  permissionAction: {alignSelf: 'flex-start', marginTop: 12, borderRadius: 999, backgroundColor: colors.primaryStart, paddingHorizontal: 14, paddingVertical: 8},
  permissionActionText: {fontSize: 12, fontWeight: '700', color: colors.surface},
  pressed: {opacity: 0.75},
  continue: {marginTop: 10},
});

function statusLabel(status: KeyboardPermissionItem['status']) {
  switch (status) {
    case 'runtime':
      return 'Runtime';
    case 'manual':
      return 'Manual';
    case 'declared':
      return 'Declared';
    default:
      return 'Ready';
  }
}

function statusStyle(status: KeyboardPermissionItem['status']) {
  switch (status) {
    case 'runtime':
      return {backgroundColor: 'rgba(242, 201, 76, 0.2)', borderColor: colors.accent};
    case 'manual':
      return {backgroundColor: 'rgba(24, 58, 99, 0.12)', borderColor: colors.primaryStart};
    case 'declared':
      return {backgroundColor: 'rgba(22, 199, 132, 0.12)', borderColor: colors.success};
    default:
      return {backgroundColor: 'rgba(22, 199, 132, 0.12)', borderColor: colors.success};
  }
}
