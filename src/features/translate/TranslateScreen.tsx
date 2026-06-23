import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {AppCard} from '../../shared/components/AppCard';
import {AppHeader} from '../../shared/components/AppHeader';
import {CopyableText} from '../../shared/components/CopyableText';
import {GradientButton} from '../../shared/components/GradientButton';
import {GhostButton} from '../../shared/components/GhostButton';
import {LanguageChip} from '../../shared/components/LanguageChip';
import {useToast} from '../../shared/components/Toast';
import {translationOutputs} from '../../shared/mock/mockData';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';
import {copyToClipboard} from '../../shared/utils/clipboard';

export function TranslateScreen() {
  const langs = Object.keys(translationOutputs);
  const [lang, setLang] = useState('English');
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  const translated = translationOutputs[lang as keyof typeof translationOutputs];
  return (
    <AppScreen style={styles.safe}>
      <AppHeader title="Translation" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.selector}><Text style={styles.selectorActive}>Bangla</Text><Text style={styles.swap}>⇄</Text><Text style={[styles.selectorText, {backgroundColor: theme.surface, borderColor: theme.line, color: theme.text}]}>{lang}</Text></View>
        <View style={styles.chips}>{langs.map(item => <LanguageChip key={item} label={item} selected={lang === item} onPress={() => setLang(item)} />)}</View>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Original</Text>
        <AppCard style={styles.card}>
          <CopyableText text={translationOutputs.Bangla} toastMessage="Copied original text" style={[styles.text, {color: theme.text}]} />
        </AppCard>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Translated</Text>
        <AppCard style={styles.card}>
          <CopyableText text={translated} toastMessage="Copied translation" style={[styles.text, {color: theme.text}]} />
          <View style={styles.actions}><GradientButton title="Share" small style={styles.action} onPress={() => showToast('Share mocked')} /><GhostButton title="Copy" small style={styles.action} onPress={() => {copyToClipboard(translated); showToast('Copied translation');}} /></View>
        </AppCard>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 20, gap: 12},
  selector: {flexDirection: 'row', alignItems: 'center', gap: 10},
  selectorActive: {flex: 1, backgroundColor: colors.softPurple, color: colors.primaryStart, textAlign: 'center', padding: 13, borderRadius: 16, fontWeight: '600'},
  selectorText: {flex: 1, backgroundColor: colors.surface, color: colors.ink, textAlign: 'center', padding: 13, borderRadius: 16, fontWeight: '600', borderWidth: 1, borderColor: colors.line},
  swap: {width: 32, height: 32, borderRadius: 16, backgroundColor: colors.ink, color: colors.surface, textAlign: 'center', textAlignVertical: 'center'},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  card: {shadowOpacity: 0},
  text: {fontSize: 14, lineHeight: 22, color: colors.ink},
  actions: {flexDirection: 'row', gap: 8, marginTop: 16},
  action: {flex: 1},
});
