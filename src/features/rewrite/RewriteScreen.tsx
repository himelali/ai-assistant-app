import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {AiThinking} from '../../shared/components/AiThinking';
import {AppCard} from '../../shared/components/AppCard';
import {AppHeader} from '../../shared/components/AppHeader';
import {CopyableText} from '../../shared/components/CopyableText';
import {GradientButton} from '../../shared/components/GradientButton';
import {GhostButton} from '../../shared/components/GhostButton';
import {SkeletonLine} from '../../shared/components/SkeletonLine';
import {ToneChip} from '../../shared/components/ToneChip';
import {useToast} from '../../shared/components/Toast';
import {rewriteOutputs} from '../../shared/mock/mockData';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';
import {copyToClipboard} from '../../shared/utils/clipboard';

export function RewriteScreen() {
  const tones = Object.keys(rewriteOutputs);
  const [tone, setTone] = useState(tones[0]);
  const [loading, setLoading] = useState(false);
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  const output = rewriteOutputs[tone as keyof typeof rewriteOutputs];
  function choose(next: string) {
    setTone(next);
    setLoading(true);
    setTimeout(() => setLoading(false), 650);
  }
  return (
    <AppScreen style={styles.safe}>
      <AppHeader title="AI Rewrite" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Original text</Text>
        <AppCard style={styles.original}>
          <CopyableText text="I need this fast" toastMessage="Copied original text">
            <Text style={[typography.body, {color: theme.textSoft}]}>"I need this fast"</Text>
          </CopyableText>
        </AppCard>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Choose a tone</Text>
        <View style={styles.grid}>{tones.map(item => <ToneChip key={item} label={item} selected={tone === item} onPress={() => choose(item)} />)}</View>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Output preview</Text>
        <AppCard style={styles.output}>
          {loading ? <><AiThinking label="Rewriting tone..." /><View style={styles.skeleton}><SkeletonLine /><SkeletonLine width="70%" /></View></> : (
            <CopyableText text={output} toastMessage="Copied rewrite">
              <Text style={[styles.outputText, {color: theme.text}]}>{output}</Text>
            </CopyableText>
          )}
          <View style={styles.actions}>
            <GradientButton title="Share" small style={styles.action} onPress={() => showToast('Share mocked')} />
            <GhostButton title="Copy" small style={styles.action} onPress={() => {copyToClipboard(output); showToast('Copied rewrite');}} />
            <GhostButton title="Regenerate" small style={styles.action} onPress={() => choose(tone)} />
          </View>
        </AppCard>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 20, gap: 10},
  original: {marginBottom: 10, shadowOpacity: 0},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12},
  output: {minHeight: 178},
  outputText: {fontSize: 14, lineHeight: 22, color: colors.ink},
  skeleton: {marginTop: 14},
  actions: {flexDirection: 'row', gap: 8, marginTop: 18},
  action: {flex: 1},
});
