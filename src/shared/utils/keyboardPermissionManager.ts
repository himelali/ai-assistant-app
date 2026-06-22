import {Linking, PermissionsAndroid, Platform} from 'react-native';

export type KeyboardPermissionId =
  | 'keyboard'
  | 'fullAccess'
  | 'internet'
  | 'network'
  | 'clipboard'
  | 'notifications'
  | 'microphone'
  | 'camera'
  | 'photos';

export type KeyboardPermissionItem = {
  id: KeyboardPermissionId;
  title: string;
  body: string;
  status: 'ready' | 'manual' | 'runtime' | 'declared';
  actionLabel?: string;
};

export const keyboardPermissionItems: KeyboardPermissionItem[] = [
  {
    id: 'keyboard',
    title: 'Keyboard extension',
    body:
      Platform.OS === 'android'
        ? 'Enable TypeAI as an Android input method, then select it as the active keyboard.'
        : 'Enable TypeAI Keyboard manually in iOS Settings, then switch to it with the globe key.',
    status: 'manual',
    actionLabel: Platform.OS === 'android' ? 'Open keyboard settings' : 'Open app settings',
  },
  {
    id: 'fullAccess',
    title: Platform.OS === 'ios' ? 'Full Access' : 'Input method access',
    body:
      Platform.OS === 'ios'
        ? 'Needed later if the iOS keyboard extension calls your API or shares copied context with the containing app.'
        : 'Android grants text insertion through the selected input method. No extra runtime dialog is required.',
    status: 'manual',
    actionLabel: Platform.OS === 'ios' ? 'Open app settings' : undefined,
  },
  {
    id: 'internet',
    title: 'Internet access',
    body: 'Declared for the future AI suggestion API. The current build uses a mock API response.',
    status: 'declared',
  },
  {
    id: 'network',
    title: 'Wi-Fi and network status',
    body: 'Declared so future API requests can check connectivity before requesting AI suggestions.',
    status: 'declared',
  },
  {
    id: 'clipboard',
    title: 'Copied text context',
    body:
      Platform.OS === 'ios'
        ? 'iOS may show paste permission prompts when the keyboard reads copied text.'
        : 'Android keyboard reads copied text from the clipboard after the user taps Use Copy.',
    status: 'ready',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    body: 'Prepared for future alerts and optional incoming-message suggestion reminders.',
    status: Platform.OS === 'android' ? 'runtime' : 'manual',
    actionLabel: Platform.OS === 'android' ? 'Allow notifications' : 'Open app settings',
  },
  {
    id: 'microphone',
    title: 'Microphone',
    body: 'Prepared for future voice typing and voice summaries.',
    status: Platform.OS === 'android' ? 'runtime' : 'manual',
    actionLabel: Platform.OS === 'android' ? 'Allow microphone' : 'Open app settings',
  },
  {
    id: 'camera',
    title: 'Camera',
    body: 'Used by profile photo capture and prepared for future keyboard media helpers.',
    status: Platform.OS === 'android' ? 'runtime' : 'manual',
    actionLabel: Platform.OS === 'android' ? 'Allow camera' : 'Open app settings',
  },
  {
    id: 'photos',
    title: 'Photo library',
    body: 'Used by profile gallery selection and prepared for future media-aware helper flows.',
    status: Platform.OS === 'android' ? 'runtime' : 'manual',
    actionLabel: Platform.OS === 'android' ? 'Allow photos' : 'Open app settings',
  },
];

export async function requestKeyboardRuntimePermission(id: KeyboardPermissionId) {
  if (Platform.OS !== 'android') {
    await Linking.openSettings();
    return true;
  }

  const permission = getAndroidRuntimePermission(id);
  if (!permission) {
    return true;
  }

  const result = await PermissionsAndroid.request(permission);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function openPermissionSettings() {
  await Linking.openSettings();
}

function getAndroidRuntimePermission(id: KeyboardPermissionId) {
  switch (id) {
    case 'notifications':
      return Number(Platform.Version) >= 33
        ? PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        : undefined;
    case 'microphone':
      return PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
    case 'camera':
      return PermissionsAndroid.PERMISSIONS.CAMERA;
    case 'photos':
      return Number(Platform.Version) >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    default:
      return undefined;
  }
}
