import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {AppHeader} from '../../shared/components/AppHeader';
import {AppIcon} from '../../shared/components/AppIcon';
import {CopyableText} from '../../shared/components/CopyableText';
import {GradientButton} from '../../shared/components/GradientButton';
import {GhostButton} from '../../shared/components/GhostButton';
import {SuggestionCard} from '../../shared/components/SuggestionCard';
import {useToast} from '../../shared/components/Toast';
import {suggestions} from '../../shared/mock/mockData';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';
import {copyToClipboard} from '../../shared/utils/clipboard';
import {requestKeyboardSuggestions} from '../../shared/utils/mockKeyboardSuggestionApi';

const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const utilityKeys = [
  {label: '123'},
  {icon: 'web', label: 'Language'},
  {label: 'space', wide: true},
  {icon: 'emoticon-outline', label: 'Emoji'},
  {icon: 'keyboard-return', label: 'Return'},
];

export function KeyboardPreviewScreen() {
  const replyTypes = ['Professional', 'Friendly', 'Short'] as const;
  const [copiedText, setCopiedText] = useState('');
  const [mockSuggestions, setMockSuggestions] = useState(suggestions.smartReplies);
  const [selectedReply, setSelectedReply] = useState<(typeof replyTypes)[number]>('Professional');
  const [loading, setLoading] = useState(false);
  const [insertedReply, setInsertedReply] = useState('');
  const {showToast} = useToast();
  const {theme} = useAppTheme();

  async function simulateCopy() {
    copyToClipboard(suggestions.incomingMessage);
    setCopiedText(suggestions.incomingMessage);
    setInsertedReply('');
    showToast('Incoming message copied to clipboard');
  }

  async function generateSuggestions() {
    const context = copiedText || suggestions.incomingMessage;
    setLoading(true);
    setCopiedText(context);
    const response = await requestKeyboardSuggestions({copiedText: context});
    setMockSuggestions(response.suggestions);
    setSelectedReply('Professional');
    setLoading(false);
    showToast('Mock API suggestions ready');
  }

  function insertReply() {
    const reply = mockSuggestions[selectedReply];
    copyToClipboard(reply);
    setInsertedReply(reply);
    showToast('Reply inserted and copied');
  }

  return (
    <AppScreen style={styles.safe}>
      <AppHeader title="Keyboard Preview" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.contextCard, {backgroundColor: theme.surface, borderColor: theme.line}]}>
          <Text style={[typography.eyebrow, {color: theme.textFaint}]}>External app message</Text>
          <CopyableText
            text={suggestions.incomingMessage}
            toastMessage="Copied incoming message"
            containerStyle={[styles.chatBubble, {backgroundColor: theme.canvas}]}>
            <Text style={[styles.chatText, {color: theme.text}]}>{suggestions.incomingMessage}</Text>
          </CopyableText>
          <Text style={[styles.contextNote, {color: theme.textFaint}]}>
            Current flow: user copies text from WhatsApp or any app, TypeAI reads copied context inside the keyboard helper, then requests an AI reply. This prototype uses a mock API response.
          </Text>
          <GhostButton title="Simulate copy text" small block onPress={simulateCopy} style={styles.cardButton} />
        </View>

        <View style={[styles.aiPanel, {backgroundColor: theme.surface, borderColor: theme.line}]}>
          <View style={styles.aiHeader}>
            <View style={styles.aiMark}><AppIcon name="star-four-points-outline" size={13} color={colors.surface} /></View>
            <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Mock API suggestions</Text>
          </View>
          <View style={[styles.copiedBox, {backgroundColor: theme.canvas, borderColor: theme.line}]}>
            <Text style={[typography.small, {color: theme.textFaint}]}>Copied context</Text>
            <CopyableText text={copiedText || 'No copied text yet'} toastMessage="Copied context">
              <Text style={[styles.copiedText, {color: copiedText ? theme.text : theme.textFaint}]}>
                {copiedText || 'No copied text yet'}
              </Text>
            </CopyableText>
          </View>
          <GradientButton
            title={loading ? 'Requesting AI...' : 'Request AI suggestion'}
            small
            block
            onPress={generateSuggestions}
            style={styles.generateButton}
          />
          <View style={styles.options}>
            {replyTypes.map(replyType => (
              <SuggestionCard
                key={replyType}
                label={replyType}
                text={mockSuggestions[replyType]}
                selected={selectedReply === replyType}
                onPress={() => setSelectedReply(replyType)}
              />
            ))}
          </View>
          <GradientButton title="Insert / paste selected reply" small block onPress={insertReply} />
        </View>

        <View style={[styles.typing, {backgroundColor: theme.surface}]}>
          <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Typing area</Text>
          <CopyableText text={insertedReply || mockSuggestions[selectedReply]} toastMessage="Copied typed reply">
            <Text style={[styles.typingText, {color: theme.textSoft}]}>
              {(insertedReply || mockSuggestions[selectedReply])}|
            </Text>
          </CopyableText>
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
  cardButton: {marginTop: 10},
  aiPanel: {backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', padding: 14},
  aiHeader: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12},
  aiMark: {width: 24, height: 24, borderRadius: 8, backgroundColor: colors.primaryStart, borderWidth: 1, borderColor: colors.primaryEnd, alignItems: 'center', justifyContent: 'center'},
  copiedBox: {borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10},
  copiedText: {fontSize: 13, lineHeight: 19, marginTop: 4},
  generateButton: {marginBottom: 12},
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
