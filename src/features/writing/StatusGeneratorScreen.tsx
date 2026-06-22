import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {AppCard} from '../../shared/components/AppCard';
import {AppHeader} from '../../shared/components/AppHeader';
import {GradientButton} from '../../shared/components/GradientButton';
import {LanguageChip} from '../../shared/components/LanguageChip';
import {ToneChip} from '../../shared/components/ToneChip';
import {useToast} from '../../shared/components/Toast';
import {statuses} from '../../shared/mock/mockData';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

export function StatusGeneratorScreen() {
  const [platform, setPlatform] = useState('Facebook');
  const [category, setCategory] = useState('Motivation');
  const [offset, setOffset] = useState(0);
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  const current = [statuses[offset % statuses.length], statuses[(offset + 1) % statuses.length], statuses[(offset + 2) % statuses.length]];
  return (
    <AppScreen style={styles.safe}>
      <AppHeader title="Status Generator" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Platform</Text>
        <View style={styles.chips}>{['Facebook', 'WhatsApp', 'Instagram'].map(item => <LanguageChip key={item} label={item} selected={platform === item} onPress={() => setPlatform(item)} />)}</View>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Category</Text>
        <View style={styles.category}>{['Funny', 'Motivation', 'Love', 'Festival', 'Islamic'].map(item => <ToneChip key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />)}</View>
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Generated status cards</Text>
        {current.map(status => <Pressable key={status} onPress={() => showToast('Copied to clipboard')}><AppCard style={styles.card}><Text style={[styles.status, {color: theme.text}]}>{status}</Text></AppCard></Pressable>)}
        <GradientButton title="Generate more" block onPress={() => setOffset(offset + 1)} />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 20, gap: 12},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  category: {flexDirection: 'row', flexWrap: 'wrap', gap: 9},
  card: {shadowOpacity: 0},
  status: {fontSize: 14, lineHeight: 22, color: colors.ink},
});
