import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../app/config/routes';
import {AppHeader} from '../../shared/components/AppHeader';
import {GhostButton} from '../../shared/components/GhostButton';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function VoiceAiScreen() {
  const [recording, setRecording] = useState(true);
  const [seconds, setSeconds] = useState(14);
  const navigation = useNavigation<Nav>();
  const {theme} = useAppTheme();
  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => setSeconds(value => value + 1), 1000);
    return () => clearInterval(timer);
  }, [recording]);
  const time = `00:${String(seconds).padStart(2, '0')}`;
  return (
    <AppScreen style={styles.safe}>
      <AppHeader title="Voice AI" />
      <View style={styles.center}>
        <View style={styles.wave}>{[20, 42, 64, 30, 52, 24, 58, 36, 46, 18].map((h, i) => <View key={i} style={[styles.bar, {height: recording ? h : h / 2}, !recording && styles.pausedBar]} />)}</View>
        <Text style={[styles.timer, {color: theme.textSoft}]}>{time}</Text>
        <Text style={[typography.body, {color: theme.textSoft}]}>{recording ? 'Listening...' : 'Paused - tap to resume'}</Text>
        <Pressable onPress={() => setRecording(!recording)} style={styles.record}><View style={[styles.stop, !recording && styles.play]} /></Pressable>
        <View style={styles.actions}><GhostButton title="Translate" small style={styles.action} onPress={() => navigation.navigate('Translate')} /><GhostButton title="Summarize" small style={styles.action} onPress={() => navigation.navigate('VoiceSummary')} /></View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30},
  wave: {height: 76, flexDirection: 'row', gap: 5, alignItems: 'flex-end', marginBottom: 30},
  bar: {width: 5, borderRadius: 3, backgroundColor: colors.primaryStart, borderColor: colors.primaryEnd, borderWidth: 1},
  pausedBar: {opacity: 0.35},
  timer: {fontSize: 14, color: colors.inkSoft, fontWeight: '600', marginBottom: 8},
  record: {width: 78, height: 78, borderRadius: 39, backgroundColor: colors.primaryStart, alignItems: 'center', justifyContent: 'center', marginVertical: 34},
  stop: {width: 22, height: 22, borderRadius: 6, backgroundColor: colors.surface},
  play: {borderLeftWidth: 20, borderTopWidth: 13, borderBottomWidth: 13, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: colors.surface, backgroundColor: 'transparent', borderRadius: 0, width: 0, height: 0},
  actions: {flexDirection: 'row', gap: 10, width: '100%'},
  action: {flex: 1},
});
