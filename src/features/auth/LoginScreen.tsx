import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../app/config/routes';
import {GradientButton} from '../../shared/components/GradientButton';
import {GhostButton} from '../../shared/components/GhostButton';
import {DarkButton} from '../../shared/components/DarkButton';
import {AppIcon} from '../../shared/components/AppIcon';
import {useToast} from '../../shared/components/Toast';
import {useLocalization} from '../../shared/localization/LocalizationContext';
import {colors} from '../../shared/theme/colors';
import {typography} from '../../shared/theme/typography';
import {radius} from '../../shared/theme/radius';
import {useAppTheme} from '../../shared/theme/ThemeContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({navigation}: Props) {
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  const {t} = useLocalization();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function enterApp() {
    // TODO: replace with real authentication flow.
    showToast(t('authWelcome'));
    navigation.getParent()?.reset({index: 0, routes: [{name: 'Main' as never}]});
  }

  return (
    <AppScreen style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logo}><AppIcon name="star-four-points-outline" size={26} color={colors.surface} /></View>
        <Text style={[typography.h1, {color: theme.text}]}>{t('authWelcome')}</Text>
        <Text style={[typography.body, styles.intro, {color: theme.textSoft}]}>{t('authIntro')}</Text>
        <Text style={[styles.label, {color: theme.textSoft}]}>{t('authEmail')}</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" placeholderTextColor={theme.textFaint} style={[styles.input, {backgroundColor: theme.surface, borderColor: theme.line, color: theme.text}]} />
        <Text style={[styles.label, {color: theme.textSoft}]}>{t('authPassword')}</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder={t('authPassword')} placeholderTextColor={theme.textFaint} style={[styles.input, {backgroundColor: theme.surface, borderColor: theme.line, color: theme.text}]} />
        <Text style={styles.forgot} onPress={() => showToast('Password reset is mocked')}>{t('authForgotPassword')}</Text>
        <GradientButton title={t('authSignIn')} block onPress={enterApp} />
        <Text style={[styles.divider, {color: theme.textFaint}]}>{t('authContinueWith')}</Text>
        <GhostButton title={t('authGoogle')} iconName="google" block onPress={() => showToast('Google sign-in mocked')} />
        <GhostButton title={t('authFacebook')} iconName="facebook" block onPress={() => showToast('Facebook sign-in mocked')} style={styles.stackBtn} />
        <DarkButton title={t('authApple')} iconName="apple" block onPress={() => showToast('Apple sign-in mocked')} style={styles.stackBtn} />
        <Text style={[styles.signup, {color: theme.textSoft}]}>
          {t('authNoAccount')} <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>{t('authSignUp')}</Text>
        </Text>
        <GradientButton title={t('authContinueToApp')} block onPress={enterApp} style={styles.prototypeButton} />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 22, paddingTop: 52},
  logo: {width: 56, height: 56, borderRadius: 17, backgroundColor: colors.primaryStart, borderWidth: 2, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 18},
  intro: {marginTop: 7, marginBottom: 22},
  label: {fontSize: 11, color: colors.inkSoft, fontWeight: '600', marginBottom: 6},
  input: {height: 45, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 13, marginBottom: 12, color: colors.ink, fontSize: 13},
  forgot: {alignSelf: 'flex-end', color: colors.primaryStart, fontWeight: '600', fontSize: 11, marginBottom: 18},
  divider: {textAlign: 'center', color: colors.inkFaint, fontSize: 11, marginVertical: 15},
  stackBtn: {marginTop: 10},
  signup: {textAlign: 'center', color: colors.inkSoft, marginTop: 20, fontSize: 12},
  link: {color: colors.primaryStart, fontWeight: '600'},
  prototypeButton: {marginTop: 22},
});
