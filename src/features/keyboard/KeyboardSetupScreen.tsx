import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../app/config/routes';
import {AppCard} from '../../shared/components/AppCard';
import {AppHeader} from '../../shared/components/AppHeader';
import {GradientButton} from '../../shared/components/GradientButton';
import {GhostButton} from '../../shared/components/GhostButton';
import {useToast} from '../../shared/components/Toast';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function KeyboardSetupScreen() {
  const navigation = useNavigation<Nav>();
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  const steps = ['Enable TypeAI Keyboard', 'Select TypeAI as active keyboard', 'Allow server suggestions'];
  const permissions = [
    ['Internet access', 'Prepared for future server-based text suggestions. No API calls are made in this prototype.'],
    ['Network status', 'Prepared to detect Wi-Fi/mobile connectivity before future suggestion requests.'],
    ['Microphone', 'Prepared for future voice typing and voice summaries.'],
    ['Notifications', 'Prepared for future incoming-message suggestions with explicit user permission.'],
    ['Keyboard full access', 'Prepared for future native keyboard extensions and suggestion insertion.'],
  ];
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
        <Text style={[typography.h1, {color: theme.text}]}>Set up your AI keyboard</Text>
        <Text style={[typography.body, styles.intro, {color: theme.textSoft}]}>This prototype prepares the app to become a native keyboard. Suggestions are mock data now and can be connected to your server later.</Text>
        {steps.map((step, index) => (
          <AppCard key={step} style={styles.step}>
            <Text style={[styles.stepNum, {color: theme.textFaint}]}>Step {index + 1}</Text>
            <Text style={[typography.title, {color: theme.text}]}>{step}</Text>
            <Text style={[typography.small, {color: theme.textFaint}]}>Mock setup step ready for native integration.</Text>
          </AppCard>
        ))}
        <AppCard style={styles.note}>
          <Text style={[typography.title, {color: theme.text}]}>Future native integration</Text>
          <Text style={[typography.body, {color: theme.textSoft}]}>The future native keyboard will send typed context to your server, receive best-match suggestions, and insert selected text into the active field.</Text>
        </AppCard>
        <Text style={[typography.eyebrow, styles.permissionTitle, {color: theme.textFaint}]}>Permission readiness</Text>
        {permissions.map(([title, body]) => (
          <AppCard key={title} style={styles.permission}>
            <Text style={[typography.title, {color: theme.text}]}>{title}</Text>
            <Text style={[typography.small, {color: theme.textFaint}]}>{body}</Text>
          </AppCard>
        ))}
        <AppCard style={styles.note}>
          <Text style={[typography.title, {color: theme.text}]}>Same UI on Android and iOS</Text>
          <Text style={[typography.body, {color: theme.textSoft}]}>The prototype keeps one shared React Native interface. Native permission prompts will be added behind these mock actions later.</Text>
        </AppCard>
        <GhostButton title="Open Keyboard Settings" block onPress={() => showToast('Opening settings is mocked')} />
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
  stepNum: {...typography.eyebrow, marginBottom: 6},
  note: {marginBottom: 10, backgroundColor: colors.softPurple},
  permissionTitle: {marginBottom: 10},
  permission: {marginBottom: 10, shadowOpacity: 0},
  continue: {marginTop: 10},
});
