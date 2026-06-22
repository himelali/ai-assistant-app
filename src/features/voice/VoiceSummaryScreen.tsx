import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {AppCard} from '../../shared/components/AppCard';
import {AppHeader} from '../../shared/components/AppHeader';
import {AppIcon} from '../../shared/components/AppIcon';
import {GradientButton} from '../../shared/components/GradientButton';
import {GhostButton} from '../../shared/components/GhostButton';
import {useToast} from '../../shared/components/Toast';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

const sections = [
  ['Main Point', 'The client wants the homepage redesign delivered before the festival sale begins.'],
  ['Action Item', 'Share the updated mockup with the client by tomorrow morning.'],
  ['Important Date', 'Festival sale launches July 3rd. Deadline is non-negotiable.'],
];

export function VoiceSummaryScreen() {
  const [playing, setPlaying] = useState(false);
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  return (
    <AppScreen style={styles.safe}>
      <AppHeader title="Voice Note Summary" />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => setPlaying(!playing)}>
          <AppCard style={styles.player}>
            <View style={styles.play}>
              <AppIcon name={playing ? 'pause' : 'play'} size={20} color={colors.surface} />
            </View>
            <View style={[styles.track, {backgroundColor: theme.line}]}><View style={styles.progress} /></View>
            <Text style={[styles.time, {color: theme.textFaint}]}>2:14</Text>
          </AppCard>
        </Pressable>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>AI generated summary</Text>
        {sections.map(([title, body]) => <AppCard key={title} style={styles.section}><Text style={styles.sectionTitle}>{title}</Text><Text style={[typography.body, {color: theme.textSoft}]}>{body}</Text></AppCard>)}
        <View style={styles.actions}><GradientButton title="Share" block style={styles.action} onPress={() => showToast('Share mocked')} /><GhostButton title="Copy" block style={styles.action} onPress={() => showToast('Copied summary')} /></View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 20, gap: 12},
  player: {flexDirection: 'row', alignItems: 'center', gap: 12, shadowOpacity: 0},
  play: {width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primaryStart, alignItems: 'center', justifyContent: 'center'},
  track: {flex: 1, height: 4, borderRadius: 3, backgroundColor: colors.line},
  progress: {width: '38%', height: 4, borderRadius: 3, backgroundColor: colors.primaryStart},
  time: {fontSize: 12, color: colors.inkFaint, fontWeight: '600'},
  section: {shadowOpacity: 0},
  sectionTitle: {fontSize: 12, color: colors.primaryStart, fontWeight: '600', textTransform: 'uppercase', marginBottom: 6},
  actions: {flexDirection: 'row', gap: 10, marginTop: 8},
  action: {flex: 1},
});
