import React, {useState} from 'react';
import {ScrollView, Text, TextInput, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../app/config/routes';
import {GradientButton} from '../../shared/components/GradientButton';
import {AppButton} from '../../shared/components/AppButton';
import {AppIcon} from '../../shared/components/AppIcon';
import {useToast} from '../../shared/components/Toast';
import {useLocalization} from '../../shared/localization/LocalizationContext';
import {colors} from '../../shared/theme/colors';
import {typography} from '../../shared/theme/typography';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {loginStyles as styles} from '../../shared/utils/screenStyles';

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
        <AppButton title={t('authGoogle')} iconName="google" iconColor={colors.surface} textColor={colors.surface} block onPress={() => showToast('Google sign-in mocked')} style={styles.googleBtn} />
        <AppButton title={t('authFacebook')} iconName="facebook" iconColor={colors.surface} textColor={colors.surface} block onPress={() => showToast('Facebook sign-in mocked')} style={[styles.stackBtn, styles.facebookBtn]} />
        <AppButton title={t('authApple')} iconName="apple" iconColor={colors.surface} textColor={colors.surface} block onPress={() => showToast('Apple sign-in mocked')} style={[styles.stackBtn, styles.appleBtn]} />
        <Text style={[styles.signup, {color: theme.textSoft}]}>
          {t('authNoAccount')} <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>{t('authSignUp')}</Text>
        </Text>
      </ScrollView>
    </AppScreen>
  );
}
