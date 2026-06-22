import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {AiThinking} from '../../shared/components/AiThinking';
import {AppCard} from '../../shared/components/AppCard';
import {AppHeader} from '../../shared/components/AppHeader';
import {AppIcon} from '../../shared/components/AppIcon';
import {CopyableText} from '../../shared/components/CopyableText';
import {GradientButton} from '../../shared/components/GradientButton';
import {GhostButton} from '../../shared/components/GhostButton';
import {LanguageChip} from '../../shared/components/LanguageChip';
import {SkeletonLine} from '../../shared/components/SkeletonLine';
import {useToast} from '../../shared/components/Toast';
import {emailDraft} from '../../shared/mock/mockData';
import {colors} from '../../shared/theme/colors';
import {radius} from '../../shared/theme/radius';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';
import {copyToClipboard} from '../../shared/utils/clipboard';

export function EmailWriterScreen() {
  const [template, setTemplate] = useState('Business');
  const [loading, setLoading] = useState(false);
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  const draftText = `Subject: ${emailDraft.subject}\n\n${emailDraft.body}`;
  function generate() {
    setLoading(true);
    setTimeout(() => {setLoading(false); showToast('Email drafted');}, 900);
  }
  return (
    <AppScreen style={styles.safe}>
      <AppHeader title="AI Email Writer" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Templates</Text>
        <View style={styles.chips}>{['Business', 'Job', 'Client', 'Follow-up'].map(item => <LanguageChip key={item} label={item} selected={template === item} onPress={() => setTemplate(item)} />)}</View>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>What's the email about?</Text>
        <View style={[styles.inputWrap, {backgroundColor: theme.surface, borderColor: theme.line}]}>
          <TextInput
            multiline
            defaultValue="Write email about project delay"
            placeholderTextColor={theme.textFaint}
            style={[styles.input, {color: theme.text}]}
          />
          <AppIcon name="microphone-outline" size={22} color={colors.primaryStart} />
        </View>
        <GradientButton title="Generate Email" block onPress={generate} />
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Generated draft</Text>
        <AppCard>
          {loading ? <><AiThinking label="Drafting email..." /><View style={styles.loading}><SkeletonLine width="62%" /><SkeletonLine /><SkeletonLine width="86%" /><SkeletonLine width="72%" /></View></> : (
            <>
              <CopyableText text={draftText} toastMessage="Copied email draft">
                <Text style={[styles.subject, {color: theme.textFaint}]}>Subject: {emailDraft.subject}</Text>
                <Text style={[styles.body, {color: theme.text}]}>{emailDraft.body}</Text>
              </CopyableText>
              <View style={styles.actions}><GradientButton title="Copy" small style={styles.action} onPress={() => {copyToClipboard(draftText); showToast('Copied email draft');}} /><GhostButton title="Share" small style={styles.action} onPress={() => showToast('Share mocked')} /><GhostButton title="Regenerate" small style={styles.action} onPress={generate} /></View>
            </>
          )}
        </AppCard>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 20, gap: 12},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8},
  inputWrap: {borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, flexDirection: 'row', gap: 10},
  input: {flex: 1, minHeight: 64, textAlignVertical: 'top', color: colors.ink},
  loading: {marginTop: 14},
  subject: {fontSize: 12, color: colors.inkFaint, marginBottom: 10},
  body: {fontSize: 13, lineHeight: 21, color: colors.ink},
  actions: {flexDirection: 'row', gap: 8, marginTop: 16},
  action: {flex: 1},
});
