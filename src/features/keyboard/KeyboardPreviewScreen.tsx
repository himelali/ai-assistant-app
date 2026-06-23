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
  const chatApps = ['WhatsApp', 'Messenger', 'Telegram'] as const;
  const [chatApp, setChatApp] = useState<(typeof chatApps)[number]>('WhatsApp');
  const [copiedText, setCopiedText] = useState('');
  const [mockSuggestions, setMockSuggestions] = useState(suggestions.smartReplies);
  const [selectedReply, setSelectedReply] = useState<(typeof replyTypes)[number]>('Professional');
  const [loading, setLoading] = useState(false);
  const [insertedReply, setInsertedReply] = useState('');
  const [previewSuggestion, setPreviewSuggestion] = useState('');
  const {showToast} = useToast();
  const {theme} = useAppTheme();

  async function simulateCopy() {
    copyToClipboard(suggestions.incomingMessage);
    setCopiedText(suggestions.incomingMessage);
    setInsertedReply('');
    setPreviewSuggestion('');
    showToast('Incoming message copied to clipboard');
    await generateSuggestions(suggestions.incomingMessage);
  }

  async function generateSuggestions(contextOverride?: string) {
    const context = contextOverride || copiedText || suggestions.incomingMessage;
    setLoading(true);
    setCopiedText(context);
    const response = await requestKeyboardSuggestions({copiedText: context});
    setMockSuggestions(response.suggestions);
    setSelectedReply('Professional');
    setPreviewSuggestion(response.suggestions.Professional);
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
          <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Chat app</Text>
          <View style={styles.chatApps}>
            {chatApps.map(app => (
              <GhostButton
                key={app}
                title={app}
                small
                style={[styles.chatAppButton, chatApp === app && styles.chatAppSelected]}
                onPress={() => setChatApp(app)}
              />
            ))}
          </View>
          <Text style={[typography.eyebrow, {color: theme.textFaint}]}>{chatApp} message</Text>
          <CopyableText
            text={suggestions.incomingMessage}
            toastMessage="Copied incoming message"
            containerStyle={[styles.chatBubble, {backgroundColor: theme.canvas}]}
            style={[styles.chatText, {color: theme.text}]}
          />
          <Text style={[styles.contextNote, {color: theme.textFaint}]}>
            Current flow: on Android, {chatApp} may show TypeAI Add-on beside its own text actions if that screen supports Process Text. Otherwise, copy a message, open the TypeAI keyboard, then use Copy, Deselect, Remove, or Suggestion. TypeAI does not replace {chatApp}'s own selection popover.
          </Text>
          <GhostButton title="Simulate copy text" small block onPress={simulateCopy} style={styles.cardButton} />
        </View>

        <View style={[styles.aiPanel, {backgroundColor: theme.surface, borderColor: theme.line}]}>
          <View style={styles.aiHeader}>
            <View style={styles.aiMark}><AppIcon name="star-four-points-outline" size={13} color={colors.surface} /></View>
            <Text style={[typography.eyebrow, {color: theme.textFaint}]}>TypeAI keyboard tooltip</Text>
          </View>
          <View style={styles.selectionToolbar}>
            {['Copy', 'Deselect', 'Remove', 'Suggestion'].map(action => (
              <GhostButton
                key={action}
                title={action}
                small
                style={styles.selectionAction}
                onPress={
                  action === 'Copy'
                    ? simulateCopy
                    : action === 'Suggestion'
                      ? () => generateSuggestions()
                      : () => {
                          if (action === 'Remove') {
                            setCopiedText('');
                            setInsertedReply('');
                            setPreviewSuggestion('');
                            showToast('Selected text removed in preview');
                            return;
                          }
                          setCopiedText('');
                          setPreviewSuggestion('');
                          showToast('Selection cleared in preview');
                        }
                }
              />
            ))}
          </View>
          <View style={[styles.copiedBox, {backgroundColor: theme.canvas, borderColor: theme.line}]}>
            <Text style={[typography.small, {color: theme.textFaint}]}>Copied context</Text>
            <CopyableText
              text={copiedText || 'No copied text yet'}
              toastMessage="Copied context"
              style={[styles.copiedText, {color: copiedText ? theme.text : theme.textFaint}]}
            />
          </View>
          {previewSuggestion ? (
            <View style={[styles.suggestionTooltip, {backgroundColor: theme.canvas, borderColor: theme.line}]}>
              <Text style={[styles.suggestionText, {color: theme.text}]}>{previewSuggestion}</Text>
              <View style={styles.suggestionActions}>
                <GradientButton
                  title="Copy"
                  small
                  style={styles.suggestionAction}
                  onPress={() => {
                    copyToClipboard(previewSuggestion);
                    showToast('Copied suggestion');
                  }}
                />
                <GhostButton
                  title="Cancel"
                  small
                  style={styles.suggestionAction}
                  onPress={() => setPreviewSuggestion('')}
                />
              </View>
            </View>
          ) : null}
          <GradientButton
            title={loading ? 'Requesting AI...' : 'Request AI suggestion'}
            small
            block
            onPress={() => generateSuggestions()}
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
          <CopyableText
            text={`${insertedReply || mockSuggestions[selectedReply]}|`}
            toastMessage="Copied typed reply"
            style={[styles.typingText, {color: theme.textSoft}]}
          />
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
  chatApps: {flexDirection: 'row', gap: 8, marginTop: 8, marginBottom: 12},
  chatAppButton: {flex: 1},
  chatAppSelected: {backgroundColor: colors.softPurple, borderColor: colors.primaryStart},
  chatBubble: {alignSelf: 'flex-start', maxWidth: '78%', padding: 12, borderRadius: 15, backgroundColor: colors.surfaceAlt, marginTop: 10, marginBottom: 10},
  chatText: {color: colors.ink, fontSize: 13},
  contextNote: {fontSize: 12, lineHeight: 18, color: colors.inkFaint},
  cardButton: {marginTop: 10},
  aiPanel: {backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', padding: 14},
  aiHeader: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12},
  aiMark: {width: 24, height: 24, borderRadius: 8, backgroundColor: colors.primaryStart, borderWidth: 1, borderColor: colors.primaryEnd, alignItems: 'center', justifyContent: 'center'},
  selectionToolbar: {flexDirection: 'row', gap: 6, marginBottom: 10},
  selectionAction: {flex: 1},
  copiedBox: {borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10},
  copiedText: {fontSize: 13, lineHeight: 19, marginTop: 4},
  suggestionTooltip: {borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10},
  suggestionText: {fontSize: 13, lineHeight: 19},
  suggestionActions: {flexDirection: 'row', gap: 8, marginTop: 10},
  suggestionAction: {flex: 1},
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
