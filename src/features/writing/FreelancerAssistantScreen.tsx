import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {AiThinking} from '../../shared/components/AiThinking';
import {AppCard} from '../../shared/components/AppCard';
import {AppHeader} from '../../shared/components/AppHeader';
import {GradientButton} from '../../shared/components/GradientButton';
import {GhostButton} from '../../shared/components/GhostButton';
import {LanguageChip} from '../../shared/components/LanguageChip';
import {SkeletonLine} from '../../shared/components/SkeletonLine';
import {SuggestionCard} from '../../shared/components/SuggestionCard';
import {useToast} from '../../shared/components/Toast';
import {freelancerOutputs} from '../../shared/mock/mockData';
import {colors} from '../../shared/theme/colors';
import {radius} from '../../shared/theme/radius';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

export function FreelancerAssistantScreen() {
  const [platform, setPlatform] = useState('Fiverr');
  const types = Object.keys(freelancerOutputs);
  const [type, setType] = useState(types[0]);
  const [loading, setLoading] = useState(false);
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  function generate() {
    setLoading(true);
    setTimeout(() => {setLoading(false); showToast('Generated');}, 900);
  }
  return (
    <AppScreen style={styles.safe}>
      <AppHeader title="Freelancer Assistant" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Platform</Text>
        <View style={styles.chips}>{['Fiverr', 'Upwork', 'Direct Client'].map(item => <LanguageChip key={item} label={item} selected={platform === item} onPress={() => setPlatform(item)} />)}</View>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Generate type</Text>
        <View style={styles.types}>{types.map(item => <SuggestionCard key={item} label={item} text={item === 'Project proposal' ? 'Tailored pitch from a job post' : item === 'Client reply' ? 'Respond professionally' : 'Gentle no-reply nudge'} selected={type === item} onPress={() => setType(item)} />)}</View>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Job details / context</Text>
        <TextInput
          multiline
          defaultValue="Laravel API integration job, client wants backend scaling experience"
          placeholderTextColor={theme.textFaint}
          style={[styles.textarea, {backgroundColor: theme.surface, borderColor: theme.line, color: theme.text}]}
        />
        <GradientButton title="Generate" block onPress={generate} />
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Preview output</Text>
        <AppCard>{loading ? <><AiThinking label="Writing..." /><View style={styles.loading}><SkeletonLine /><SkeletonLine width="88%" /><SkeletonLine width="68%" /></View></> : <><Text style={[styles.output, {color: theme.text}]}>{freelancerOutputs[type as keyof typeof freelancerOutputs]}</Text><View style={styles.actions}><GradientButton title="Copy" small style={styles.action} onPress={() => showToast('Copied')} /><GhostButton title="Share" small style={styles.action} onPress={() => showToast('Share mocked')} /><GhostButton title="Regenerate" small style={styles.action} onPress={generate} /></View></>}</AppCard>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 20, gap: 12},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  types: {gap: 10},
  textarea: {minHeight: 82, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, backgroundColor: colors.surface, padding: 14, textAlignVertical: 'top', color: colors.ink},
  loading: {marginTop: 14},
  output: {fontSize: 13, lineHeight: 21, color: colors.ink},
  actions: {flexDirection: 'row', gap: 8, marginTop: 16},
  action: {flex: 1},
});
