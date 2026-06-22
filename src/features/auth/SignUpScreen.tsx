import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../app/config/routes';
import {AppScreen} from '../../shared/components/AppScreen';
import {AppIcon} from '../../shared/components/AppIcon';
import {AppButton} from '../../shared/components/AppButton';
import {GradientButton} from '../../shared/components/GradientButton';
import {useToast} from '../../shared/components/Toast';
import {useLocalization} from '../../shared/localization/LocalizationContext';
import {colors} from '../../shared/theme/colors';
import {radius} from '../../shared/theme/radius';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({navigation}: Props) {
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  const {t} = useLocalization();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function enterApp() {
    // TODO: replace with real registration.
    showToast(t('signUpCreate'));
    navigation.getParent()?.reset({index: 0, routes: [{name: 'Main' as never}]});
  }

  return (
    <AppScreen style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logo}>
          <AppIcon name="account-plus-outline" size={26} color={colors.surface} />
        </View>
        <Text style={[typography.h1, {color: theme.text}]}>{t('signUpTitle')}</Text>
        <Text style={[typography.body, styles.intro, {color: theme.textSoft}]}>{t('signUpIntro')}</Text>

        <Text style={[styles.label, {color: theme.textSoft}]}>{t('signUpName')}</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Himel Khan" placeholderTextColor={theme.textFaint} style={[styles.input, {backgroundColor: theme.surface, borderColor: theme.line, color: theme.text}]} />
        <Text style={[styles.label, {color: theme.textSoft}]}>{t('authEmail')}</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" placeholderTextColor={theme.textFaint} style={[styles.input, {backgroundColor: theme.surface, borderColor: theme.line, color: theme.text}]} />
        <Text style={[styles.label, {color: theme.textSoft}]}>{t('authPassword')}</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder={t('authPassword')} placeholderTextColor={theme.textFaint} style={[styles.input, {backgroundColor: theme.surface, borderColor: theme.line, color: theme.text}]} />

        <GradientButton title={t('signUpCreate')} block onPress={enterApp} />
        <Text style={[styles.divider, {color: theme.textFaint}]}>{t('signUpWith')}</Text>
        <AppButton title={t('authGoogle')} iconName="google" iconColor={colors.surface} textColor={colors.surface} block onPress={() => showToast('Google sign-up mocked')} style={styles.googleBtn} />
        <AppButton title={t('authFacebook')} iconName="facebook" iconColor={colors.surface} textColor={colors.surface} block onPress={() => showToast('Facebook sign-up mocked')} style={[styles.stackBtn, styles.facebookBtn]} />
        <AppButton title={t('authApple')} iconName="apple" iconColor={colors.surface} textColor={colors.surface} block onPress={() => showToast('Apple sign-up mocked')} style={[styles.stackBtn, styles.appleBtn]} />

        <Text style={[styles.signup, {color: theme.textSoft}]}>
          {t('signUpAlready')} <Text style={styles.link} onPress={() => navigation.navigate('Login')}>{t('authSignIn')}</Text>
        </Text>
        <GradientButton title={t('authContinueToApp')} block onPress={enterApp} style={styles.prototypeButton} />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 22, paddingTop: 46, paddingBottom: 28},
  logo: {width: 56, height: 56, borderRadius: 17, backgroundColor: colors.primaryStart, borderWidth: 2, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 18},
  intro: {marginTop: 7, marginBottom: 22},
  label: {fontSize: 12, color: colors.inkSoft, fontWeight: '600', marginBottom: 6},
  input: {height: 45, borderRadius: radius.md, borderWidth: 1, paddingHorizontal: 13, marginBottom: 12, fontSize: 14},
  divider: {textAlign: 'center', fontSize: 12, marginVertical: 15},
  stackBtn: {marginTop: 10},
  googleBtn: {backgroundColor: '#4285F4', borderColor: '#4285F4'},
  facebookBtn: {backgroundColor: '#1877F2', borderColor: '#1877F2'},
  appleBtn: {backgroundColor: '#000000', borderColor: '#000000'},
  signup: {textAlign: 'center', marginTop: 20, fontSize: 13},
  link: {color: colors.primaryStart, fontWeight: '600'},
  prototypeButton: {marginTop: 22},
});
