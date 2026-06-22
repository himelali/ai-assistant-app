import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {AiThinking} from '../../shared/components/AiThinking';
import {AppCard} from '../../shared/components/AppCard';
import {AppIcon} from '../../shared/components/AppIcon';
import {useToast} from '../../shared/components/Toast';
import {aiReplies} from '../../shared/mock/mockData';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

type Message = {role: 'user' | 'ai' | 'thinking'; text: string};
const prompts = ['Client follow-up', 'Summarize chats', 'Quick translate', 'Generate status'];
const promptIcons: Record<string, string> = {
  'Client follow-up': 'briefcase-outline',
  'Summarize chats': 'text-box-check-outline',
  'Quick translate': 'translate',
  'Generate status': 'star-four-points-outline',
};

export function AiHubScreen() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  const {showToast} = useToast();
  const {theme} = useAppTheme();

  function send(prompt = text.trim()) {
    if (!prompt) return;
    setText('');
    setMessages(prev => [...prev, {role: 'user', text: prompt}, {role: 'thinking', text: ''}]);
    setTimeout(() => {
      setMessages(prev => {
        const next = prev.filter(item => item.role !== 'thinking');
        return [...next, {role: 'ai', text: aiReplies[prompt] || 'Here is a quick mock draft. You can copy it, rewrite it, or use it in a future keyboard integration.'}];
      });
    }, 900);
  }

  function mockMic() {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      send('Generate status');
      showToast('Voice prompt captured');
    }, 1200);
  }

  return (
    <AppScreen style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.safe, {backgroundColor: theme.canvas}]}>
        <View style={styles.header}>
          <View style={styles.logo}><AppIcon name="star-four-points-outline" size={16} color={colors.surface} /></View>
          <Text style={[typography.title, {color: theme.text}]}>Ask AI</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {messages.length === 0 ? (
            <>
              <Text style={[typography.body, styles.question, {color: theme.textSoft}]}>What can I help you write today?</Text>
              <View style={styles.grid}>
                {prompts.map(prompt => (
                  <Pressable key={prompt} onPress={() => send(prompt)} style={[styles.prompt, {backgroundColor: theme.surface, borderColor: theme.line}]}>
                    <View style={styles.promptIconWrap}>
                      <AppIcon name={promptIcons[prompt]} size={20} color={colors.primaryStart} />
                    </View>
                    <Text style={[styles.promptText, {color: theme.text}]}>{prompt}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Recent AI activities</Text>
              {['Project delay email', 'Reply to Rashed Bhai'].map(item => (
                <AppCard key={item} style={styles.recent}><Text style={[typography.title, {color: theme.text}]}>{item}</Text><Text style={[typography.small, {color: theme.textFaint}]}>Mock activity · 2 hours ago</Text></AppCard>
              ))}
            </>
          ) : (
            messages.map((item, index) => {
              if (item.role === 'thinking') return <AiThinking key={index} />;
              return (
                <View key={index} style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                  <Text style={item.role === 'user' ? styles.userText : [styles.aiText, {color: theme.text}]}>{item.text}</Text>
                </View>
              );
            })
          )}
        </ScrollView>
        {listening ? <Text style={styles.listening}>● Listening...</Text> : null}
        <View style={[styles.composer, {backgroundColor: theme.surface, borderTopColor: theme.line}]}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Ask AI anything..."
            placeholderTextColor={theme.textFaint}
            style={[styles.input, {backgroundColor: theme.canvas, color: theme.text}]}
          />
          <Pressable onPress={mockMic} style={[styles.icon, {backgroundColor: theme.canvas}]}>
            <AppIcon name="microphone-outline" size={20} color={theme.text} />
          </Pressable>
          <Pressable onPress={() => send()} style={[styles.icon, styles.send]}>
            <AppIcon name="send" size={18} color={colors.surface} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  header: {height: 58, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 10},
  logo: {width: 34, height: 34, borderRadius: 11, backgroundColor: colors.primaryStart, alignItems: 'center', justifyContent: 'center'},
  content: {padding: 18, paddingBottom: 20, gap: 10},
  question: {marginBottom: 4},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 14},
  prompt: {width: '48.5%', minHeight: 94, backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: 16, padding: 13},
  promptIconWrap: {width: 34, height: 34, borderRadius: 11, backgroundColor: colors.softPurple, alignItems: 'center', justifyContent: 'center', marginBottom: 8},
  promptText: {fontWeight: '600', color: colors.ink, fontSize: 12},
  recent: {padding: 13, shadowOpacity: 0},
  bubble: {maxWidth: '84%', borderRadius: 16, padding: 13, marginBottom: 10},
  userBubble: {alignSelf: 'flex-end', backgroundColor: colors.primaryStart},
  aiBubble: {alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line},
  userText: {color: colors.surface, fontWeight: '500', lineHeight: 19, fontSize: 13},
  aiText: {color: colors.ink, lineHeight: 20},
  listening: {paddingHorizontal: 20, paddingBottom: 6, color: colors.error, fontWeight: '600', fontSize: 11},
  composer: {flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.surface, padding: 12, paddingBottom: 16},
  input: {flex: 1, minHeight: 40, borderRadius: 22, backgroundColor: colors.surfaceAlt, paddingHorizontal: 14, color: colors.ink, fontSize: 13},
  icon: {width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt},
  send: {backgroundColor: colors.primaryStart},
});
