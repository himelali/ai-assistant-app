import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../app/config/routes';
import {GradientButton} from '../../shared/components/GradientButton';
import {GhostButton} from '../../shared/components/GhostButton';
import {GlassCard} from '../../shared/components/GlassCard';
import {colors} from '../../shared/theme/colors';
import {typography} from '../../shared/theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const slides = [
  {
    title: 'Type faster\nwith AI',
    body: 'Real-time suggestions as you type in messages, email, notes, or anywhere the TypeAI keyboard opens.',
    label: '01 / 03',
    bg: '#EEF0FF',
    art: 'keyboard',
  },
  {
    title: 'Reply\ninstantly',
    body: 'TypeAI drafts replies in your tone. Pick one, insert it, and keep moving.',
    label: '02 / 03',
    bg: '#E8FBFF',
    art: 'reply',
  },
  {
    title: 'Speak any\nlanguage',
    body: 'Instant translation across Bangla, English, Hindi and Urdu.',
    label: '03 / 03',
    bg: '#F1EEFF',
    art: 'language',
  },
];

export function OnboardingScreen({navigation}: Props) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  const illustration = useMemo(() => {
    if (slide.art === 'reply') {
      return (
        <>
          <View style={styles.chatLeft}><Text style={styles.chatText}>Can you send the report today?</Text></View>
          <View style={styles.chatRight}><Text style={styles.chatRightText}>Yes, sending it within the hour.</Text></View>
          <View style={[styles.chatRight, styles.chatGhost]}><Text style={styles.chatText}>Sure, give me until 5 PM.</Text></View>
        </>
      );
    }
    if (slide.art === 'language') {
      return (
        <>
          <View style={styles.langRow}><Text style={styles.langLabel}>বাংলা</Text><Text>খবরটা পেয়েছি</Text></View>
          <Text style={styles.down}>↓</Text>
          <View style={[styles.langRow, styles.langActive]}><Text style={styles.langLabelLight}>English</Text><Text style={styles.langTextLight}>Got the news</Text></View>
        </>
      );
    }
    return (
      <>
        <View style={styles.keys}>
          {['Q', 'W', 'E', 'R'].map(key => (
            <View key={key} style={[styles.key, key === 'E' && styles.keyActive]}>
              <Text style={[styles.keyText, key === 'E' && styles.keyActiveText]}>{key}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.aiLabel}>AI suggestion</Text>
        <Text style={styles.suggestion}>"Sure, I'll send the file by 6 PM today."</Text>
      </>
    );
  }, [slide.art]);

  function next() {
    if (isLast) {
      navigation.replace('Login');
      return;
    }
    setIndex(index + 1);
  }

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: slide.bg}]}>
      <View style={styles.skip}>
        <GhostButton title="Skip" small onPress={() => navigation.replace('Login')} />
      </View>
      <View style={styles.center}>
        <GlassCard style={styles.art}>{illustration}</GlassCard>
      </View>
      <View style={styles.content}>
        <Text style={typography.eyebrow}>{slide.label}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
        <GradientButton title={isLast ? 'Get started' : 'Continue'} block onPress={next} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  skip: {alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 8},
  center: {flex: 1, justifyContent: 'center', paddingHorizontal: 30},
  art: {minHeight: 190, justifyContent: 'center'},
  content: {paddingHorizontal: 28, paddingBottom: 28},
  title: {...typography.h1, marginTop: 10, marginBottom: 10},
  body: {...typography.body, marginBottom: 26},
  keys: {flexDirection: 'row', gap: 7, marginBottom: 20},
  key: {paddingHorizontal: 14, paddingVertical: 10, borderRadius: 9, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line},
  keyActive: {backgroundColor: colors.primaryStart, borderColor: colors.primaryEnd},
  keyText: {fontWeight: '600', color: colors.inkSoft},
  keyActiveText: {color: colors.surface},
  aiLabel: {...typography.small, marginBottom: 8},
  suggestion: {...typography.title, lineHeight: 24},
  chatLeft: {alignSelf: 'flex-start', maxWidth: '78%', backgroundColor: colors.surface, borderRadius: 14, padding: 11, marginBottom: 12},
  chatRight: {alignSelf: 'flex-end', maxWidth: '82%', backgroundColor: colors.primaryStart, borderRadius: 14, padding: 11, marginBottom: 8},
  chatGhost: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line},
  chatText: {fontSize: 13, color: colors.ink},
  chatRightText: {fontSize: 13, color: colors.surface, fontWeight: '700'},
  langRow: {backgroundColor: colors.surface, borderRadius: 13, borderWidth: 1, borderColor: colors.line, padding: 13, flexDirection: 'row', justifyContent: 'space-between'},
  langActive: {backgroundColor: colors.primaryStart, borderColor: colors.primaryEnd},
  langLabel: {color: colors.inkSoft, fontSize: 12},
  langLabelLight: {color: 'rgba(255,255,255,0.75)', fontSize: 12},
  langTextLight: {color: colors.surface, fontWeight: '700'},
  down: {textAlign: 'center', color: colors.primaryStart, fontSize: 22, marginVertical: 8},
});
