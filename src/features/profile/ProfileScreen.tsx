import React, {useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type CameraOptions,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import {AppScreen} from '../../shared/components/AppScreen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../app/config/routes';
import {AppCard} from '../../shared/components/AppCard';
import {AppButton} from '../../shared/components/AppButton';
import {AppIcon} from '../../shared/components/AppIcon';
import {BottomSheet} from '../../shared/components/BottomSheet';
import {GradientButton} from '../../shared/components/GradientButton';
import {GhostButton} from '../../shared/components/GhostButton';
import {useToast} from '../../shared/components/Toast';
import {useLocalization} from '../../shared/localization/LocalizationContext';
import {user} from '../../shared/mock/mockData';
import {colors} from '../../shared/theme/colors';
import {radius} from '../../shared/theme/radius';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Sheet = 'password' | 'logout' | 'delete' | 'photo' | null;

function Row({icon, title, subtitle, action, onPress, danger}: {icon: string; title: string; subtitle?: string; action?: string; onPress?: () => void; danger?: boolean}) {
  const {theme, isDark} = useAppTheme();
  const iconColor = danger ? colors.error : isDark ? colors.accent : colors.primaryStart;

  return (
    <Pressable onPress={onPress} style={[styles.row, {borderBottomColor: theme.line}]}>
      <AppIcon name={icon} size={20} color={iconColor} />
      <View style={styles.rowText}><Text style={[styles.rowTitle, {color: theme.text}, danger && styles.danger]}>{title}</Text>{subtitle ? <Text style={[typography.small, {color: theme.textFaint}]}>{subtitle}</Text> : null}</View>
      <Text style={[styles.action, {color: theme.textFaint}, danger && styles.danger]}>{action || '›'}</Text>
    </Pressable>
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  const {t} = useLocalization();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [photoSource, setPhotoSource] = useState<'Camera' | 'Gallery' | null>(null);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);

  async function selectProfilePhoto(source: 'Camera' | 'Gallery') {
    const options: CameraOptions & ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
      includeBase64: false,
      saveToPhotos: false,
    };

    try {
      const result = source === 'Camera' ? await launchCamera(options) : await launchImageLibrary(options);

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        showToast(result.errorMessage || 'Photo permission unavailable');
        return;
      }

      const uri = result.assets?.[0]?.uri;
      if (!uri) {
        showToast('No photo selected');
        return;
      }

      setProfilePhotoUri(uri);
      setPhotoSource(source);
      setSheet(null);
      showToast(`${source} photo selected`);
    } catch {
      showToast('Photo selection failed');
    }
  }

  return (
    <AppScreen style={styles.safe}>
      <View style={styles.header}><View style={styles.blank} /><Text style={[typography.navTitle, {color: theme.text}]}>{t('profileTitle')}</Text><Pressable onPress={() => navigation.navigate('Settings')} style={[styles.settings, {backgroundColor: theme.surface, borderColor: theme.line}]}><AppIcon name="cog-outline" size={21} color={theme.text} /></Pressable></View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.identity, {borderBottomColor: theme.line}]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Change profile photo" onPress={() => setSheet('photo')} style={styles.avatarWrap}>
            <View style={styles.avatar}>
              {profilePhotoUri ? (
                <Image source={{uri: profilePhotoUri}} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{user.initial}</Text>
              )}
            </View>
            <View style={styles.cameraBadge}><AppIcon name="camera-plus-outline" size={17} color={colors.surface} /></View>
          </Pressable>
          <Text style={[typography.h2, {color: theme.text}]}>{user.name}</Text>
          <Text style={[typography.body, {color: theme.textSoft}]}>{user.email}</Text>
          {photoSource ? <Text style={[typography.small, styles.photoHint, {color: theme.textFaint}]}>Photo source: {photoSource}</Text> : null}
        </View>
        <Text style={[typography.sectionHeader, {color: theme.text}]}>{t('profileAccount')}</Text>
        <AppCard style={styles.card}><Row icon="lock-outline" title={t('profilePassword')} subtitle={t('profileChangePassword')} onPress={() => setSheet('password')} /><Row icon="credit-card-outline" title={t('profileSubscription')} subtitle={t('profileFreePlan')} onPress={() => navigation.navigate('Premium')} /></AppCard>
        <Text style={[typography.sectionHeader, {color: theme.text}]}>{t('profileBilling')}</Text>
        <AppCard style={styles.card}><Row icon="file-document-outline" title="Pro Plan Annual" subtitle="Invoice #INV-2024-001" action="$99.99" /><Row icon="file-document-multiple-outline" title="Pro Plan Monthly" subtitle="Invoice #INV-2024-002" action="$12.99" /></AppCard>
        <Text style={[typography.sectionHeader, {color: theme.text}]}>{t('profileConnected')}</Text>
        <AppCard style={styles.card}><Row icon="google" title="Google" subtitle="Connected" action="Disconnect" onPress={() => showToast('Google disconnected')} /><Row icon="facebook" title="Facebook" subtitle="Not connected" action="Connect" onPress={() => showToast('Facebook connected')} /><Row icon="apple" title="Apple" subtitle="Connected" action="Disconnect" onPress={() => showToast('Apple disconnected')} /></AppCard>
        <Text style={[typography.sectionHeader, styles.danger]}>{t('profileDanger')}</Text>
        <AppCard style={[styles.card, styles.dangerCard]}><Row icon="logout" title={t('profileSignOut')} subtitle="Log out from this device" danger onPress={() => setSheet('logout')} /><Row icon="delete-outline" title={t('profileDelete')} subtitle="Permanently delete all data" danger onPress={() => setSheet('delete')} /></AppCard>
      </ScrollView>
      <BottomSheet visible={sheet === 'password'} onClose={() => setSheet(null)}>
        <Text style={[typography.h2, styles.sheetTitle, {color: theme.text}]}>{t('profileChangePassword')}</Text>
        {['Current Password', 'New Password', 'Confirm Password'].map(label => (
          <TextInput
            key={label}
            placeholder={label}
            placeholderTextColor={theme.textFaint}
            secureTextEntry
            style={[styles.input, {backgroundColor: theme.canvas, borderColor: theme.line, color: theme.text}]}
          />
        ))}
        <GradientButton title="Update Password" block onPress={() => {setSheet(null); showToast('Password updated');}} />
        <GhostButton title="Cancel" block onPress={() => setSheet(null)} style={styles.sheetBtn} />
      </BottomSheet>
      <BottomSheet visible={sheet === 'photo'} onClose={() => setSheet(null)}>
        <Text style={[typography.h2, styles.sheetTitle, {color: theme.text}]}>Change profile photo</Text>
        <Text style={[typography.body, styles.sheetBody, {color: theme.textSoft}]}>Choose a photo from the phone camera or gallery. The selected photo stays local in this prototype.</Text>
        <GradientButton title="Take Photo" block onPress={() => selectProfilePhoto('Camera')} />
        <GhostButton title="Choose from Gallery" block onPress={() => selectProfilePhoto('Gallery')} style={styles.sheetBtn} />
        <GhostButton title="Cancel" block onPress={() => setSheet(null)} style={styles.sheetBtn} />
      </BottomSheet>
      <BottomSheet visible={sheet === 'logout'} onClose={() => setSheet(null)}>
        <Text style={[typography.h2, styles.sheetTitle, {color: theme.text}]}>Sign out of TypeAI?</Text>
        <Text style={[typography.body, styles.sheetBody, {color: theme.textSoft}]}>You can sign in again any time.</Text>
        <AppButton title="Sign out" variant="danger" block onPress={() => {setSheet(null); showToast('Signed out');}} />
        <GhostButton title="Cancel" block onPress={() => setSheet(null)} style={styles.sheetBtn} />
      </BottomSheet>
      <BottomSheet visible={sheet === 'delete'} onClose={() => setSheet(null)}>
        <Text style={[typography.h2, styles.sheetTitle, {color: theme.text}]}>Delete Account?</Text>
        <Text style={[typography.body, styles.sheetBody, {color: theme.textSoft}]}>This mock action does not delete real data.</Text>
        <AppButton title="Delete My Account" variant="danger" block onPress={() => {setSheet(null); showToast('Delete account mocked');}} />
        <GhostButton title="Cancel" block onPress={() => setSheet(null)} style={styles.sheetBtn} />
      </BottomSheet>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  header: {height: 58, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  blank: {width: 38},
  settings: {width: 38, height: 38, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center'},
  content: {padding: 20, gap: 10, paddingBottom: 30},
  identity: {alignItems: 'center', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.line, marginBottom: 10},
  avatarWrap: {marginBottom: 12},
  avatar: {width: 76, height: 76, borderRadius: 38, backgroundColor: colors.primaryStart, borderWidth: 2, borderColor: colors.primaryEnd, alignItems: 'center', justifyContent: 'center', marginBottom: 12},
  avatarImage: {width: 72, height: 72, borderRadius: 36},
  avatarText: {fontSize: 25, color: colors.surface, fontWeight: '600'},
  cameraBadge: {position: 'absolute', right: -2, bottom: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primaryEnd, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.surface},
  photoHint: {marginTop: 6},
  card: {padding: 0, overflow: 'hidden', shadowOpacity: 0},
  row: {minHeight: 58, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  rowText: {flex: 1},
  rowTitle: {fontSize: 12, fontWeight: '600', color: colors.ink},
  action: {fontSize: 11, color: colors.inkFaint, fontWeight: '600'},
  danger: {color: colors.error},
  dangerCard: {borderColor: colors.error},
  sheetTitle: {fontSize: 16, marginBottom: 10},
  sheetBody: {marginBottom: 18},
  input: {height: 48, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, marginBottom: 10},
  sheetBtn: {marginTop: 10},
});
