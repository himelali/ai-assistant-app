import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  KeyboardSetup: undefined;
  KeyboardPreview: undefined;
  Rewrite: undefined;
  Translate: undefined;
  VoiceAi: undefined;
  VoiceSummary: undefined;
  EmailWriter: undefined;
  FreelancerAssistant: undefined;
  StatusGenerator: undefined;
  Premium: undefined;
  Settings: undefined;
  Notifications: undefined;
  HelpSupport: undefined;
  AboutTypeAI: undefined;
  Invoice: {invoiceId: string};
};

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Keyboard: undefined;
  AiHub: undefined;
  History: undefined;
  Profile: undefined;
};
