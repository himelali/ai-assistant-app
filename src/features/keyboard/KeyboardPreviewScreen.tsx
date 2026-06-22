import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {AppHeader} from '../../shared/components/AppHeader';
import {AppIcon} from '../../shared/components/AppIcon';
import {GradientButton} from '../../shared/components/GradientButton';
import {SuggestionCard} from '../../shared/components/SuggestionCard';
import {useToast} from '../../shared/components/Toast';
import {suggestions} from '../../shared/mock/mockData';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const utilityKeys = [
  {label: '123'},
  {icon: 'web', label: 'Language'},
  {label: 'space', wide: true},
  {icon: 'emoticon-outline', label: 'Emoji'},
  {icon: 'keyboard-return', label: 'Return'},
];

export function KeyboardPreviewScreen() {
  const replyTypes = Object.keys(suggestions.smartReplies);
  const [selectedReply, setSelectedReply] = useState(replyTypes[0]);
  const {showToast} = useToast();
  const {theme} = useAppTheme();

  return (
    <AppScreen style={styles.safe}>
      <AppHeader title="Keyboard Preview" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.contextCard, {backgroundColor: theme.surface, borderColor: theme.line}]}>
          <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Keyboard context</Text>
          <View style={[styles.chatBubble, {backgroundColor: theme.canvas}]}>
            <Text style={[styles.chatText, {color: theme.text}]}>{suggestions.incomingMessage}</Text>
          </View>
          <Text style={[styles.contextNote, {color: theme.textFaint}]}>
            This is a mock preview of how TypeAI can suggest text from typed context. Server suggestions will be connected later.
          </Text>
        </View>

        <View style={[styles.aiPanel, {backgroundColor: theme.surface, borderColor: theme.line}]}>
          <View style={styles.aiHeader}>
            <View style={styles.aiMark}><AppIcon name="star-four-points-outline" size={13} color={colors.surface} /></View>
            <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Mock server suggestions</Text>
          </View>
          <View style={styles.options}>
            {replyTypes.map(replyType => (
              <SuggestionCard
                key={replyType}
                label={replyType}
                text={suggestions.smartReplies[replyType as keyof typeof suggestions.smartReplies]}
                selected={selectedReply === replyType}
                onPress={() => setSelectedReply(replyType)}
              />
            ))}
          </View>
          <GradientButton title="Insert selected reply" small block onPress={() => showToast('Reply inserted into mock typing area')} />
        </View>

        <View style={[styles.typing, {backgroundColor: theme.surface}]}>
          <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Typing area</Text>
          <Text style={[styles.typingText, {color: theme.textSoft}]}>
            {suggestions.smartReplies[selectedReply as keyof typeof suggestions.smartReplies]}|
          </Text>
        </View>
        <View style={styles.toolbar}>
          {['Reply', 'Translate', 'Fix', 'Rewrite', 'Voice'].map(item => <GradientButton key={item} title={item} small />)}
        </View>
        <View style={[styles.keyboard, {backgroundColor: theme.canvas}]}>
          {rows.map(row => (
            <View key={row} style={styles.keyRow}>
              {row.split('').map(key => <View key={key} style={[styles.key, {backgroundColor: theme.surface}]}><Text style={[styles.keyText, {color: theme.text}]}>{key}</Text></View>)}
            </View>
          ))}
          <View style={styles.keyRow}>
            {utilityKeys.map(key => (
              <View key={key.label} style={[styles.key, key.wide && styles.space, {backgroundColor: theme.surface}]}>
                {key.icon ? <AppIcon name={key.icon} size={18} color={theme.text} /> : <Text style={[styles.keyText, {color: theme.text}]}>{key.label}</Text>}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 18, paddingBottom: 0, gap: 12},
  contextCard: {backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.line, padding: 14},
  chatBubble: {alignSelf: 'flex-start', maxWidth: '78%', padding: 12, borderRadius: 15, backgroundColor: colors.surfaceAlt, marginTop: 10, marginBottom: 10},
  chatText: {color: colors.ink, fontSize: 13},
  contextNote: {fontSize: 12, lineHeight: 18, color: colors.inkFaint},
  aiPanel: {backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', padding: 14},
  aiHeader: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12},
  aiMark: {width: 24, height: 24, borderRadius: 8, backgroundColor: colors.primaryStart, borderWidth: 1, borderColor: colors.primaryEnd, alignItems: 'center', justifyContent: 'center'},
  options: {gap: 8, marginBottom: 12},
  typing: {borderWidth: 1, borderStyle: 'dashed', borderColor: colors.accent, borderRadius: 16, padding: 14, backgroundColor: colors.surface},
  typingText: {marginTop: 6, color: colors.inkSoft},
  toolbar: {flexDirection: 'row', gap: 8, flexWrap: 'wrap'},
  keyboard: {backgroundColor: colors.surfaceAlt, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 10, marginHorizontal: -18},
  keyRow: {flexDirection: 'row', gap: 5, justifyContent: 'center', marginBottom: 7},
  key: {height: 40, minWidth: 29, flex: 1, borderRadius: 8, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  space: {flex: 3},
  keyText: {fontWeight: '500', color: colors.ink},
});
