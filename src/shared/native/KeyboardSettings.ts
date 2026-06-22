import {NativeModules, Platform} from 'react-native';

type KeyboardSettingsNativeModule = {
  openKeyboardSettings: () => Promise<boolean>;
  showKeyboardPicker: () => Promise<boolean>;
  isTypeAiKeyboardEnabled: () => Promise<boolean>;
};

const nativeKeyboardSettings = NativeModules.KeyboardSettings as
  | KeyboardSettingsNativeModule
  | undefined;

export async function openSystemKeyboardSettings() {
  if (Platform.OS === 'android' && nativeKeyboardSettings) {
    return nativeKeyboardSettings.openKeyboardSettings();
  }

  return false;
}

export async function showSystemKeyboardPicker() {
  if (Platform.OS === 'android' && nativeKeyboardSettings) {
    return nativeKeyboardSettings.showKeyboardPicker();
  }

  return false;
}

export async function isTypeAiKeyboardEnabled() {
  if (Platform.OS === 'android' && nativeKeyboardSettings) {
    return nativeKeyboardSettings.isTypeAiKeyboardEnabled();
  }

  // iOS does not expose installed keyboard state to the containing app.
  return false;
}
