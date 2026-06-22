import React from 'react';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {RootStackParamList} from '../config/routes';
import {AuthNavigator} from './AuthNavigator';
import {MainTabNavigator} from './MainTabNavigator';
import {KeyboardPreviewScreen} from '../../features/keyboard/KeyboardPreviewScreen';
import {RewriteScreen} from '../../features/rewrite/RewriteScreen';
import {TranslateScreen} from '../../features/translate/TranslateScreen';
import {VoiceAiScreen} from '../../features/voice/VoiceAiScreen';
import {VoiceSummaryScreen} from '../../features/voice/VoiceSummaryScreen';
import {EmailWriterScreen} from '../../features/writing/EmailWriterScreen';
import {FreelancerAssistantScreen} from '../../features/writing/FreelancerAssistantScreen';
import {StatusGeneratorScreen} from '../../features/writing/StatusGeneratorScreen';
import {PremiumScreen} from '../../features/premium/PremiumScreen';
import {SettingsScreen} from '../../features/settings/SettingsScreen';
import {KeyboardSetupScreen} from '../../features/keyboard/KeyboardSetupScreen';
import {NotificationsScreen} from '../../features/notifications/NotificationsScreen';
import {HelpSupportScreen} from '../../features/support/HelpSupportScreen';
import {AboutTypeAIScreen} from '../../features/support/AboutTypeAIScreen';
import {InvoiceScreen} from '../../features/profile/InvoiceScreen';
import {stackTransitionOptions} from './transitions';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const {isDark, theme} = useAppTheme();
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primaryStart,
      background: theme.canvas,
      card: theme.surface,
      text: theme.text,
      border: theme.line,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{headerShown: false, ...stackTransitionOptions}}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="KeyboardSetup" component={KeyboardSetupScreen} />
        <Stack.Screen name="KeyboardPreview" component={KeyboardPreviewScreen} />
        <Stack.Screen name="Rewrite" component={RewriteScreen} />
        <Stack.Screen name="Translate" component={TranslateScreen} />
        <Stack.Screen name="VoiceAi" component={VoiceAiScreen} />
        <Stack.Screen name="VoiceSummary" component={VoiceSummaryScreen} />
        <Stack.Screen name="EmailWriter" component={EmailWriterScreen} />
        <Stack.Screen name="FreelancerAssistant" component={FreelancerAssistantScreen} />
        <Stack.Screen name="StatusGenerator" component={StatusGeneratorScreen} />
        <Stack.Screen name="Premium" component={PremiumScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <Stack.Screen name="AboutTypeAI" component={AboutTypeAIScreen} />
        <Stack.Screen name="Invoice" component={InvoiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
