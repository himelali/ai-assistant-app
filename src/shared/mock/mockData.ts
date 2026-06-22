export const user = {
  name: 'Himel Khan',
  email: 'himel@typeai.com',
  initial: 'H',
};

export const usage = {
  dailyCredits: 238,
  totalCredits: 300,
  keyboardEnabled: true,
};

export const quickActions = [
  {title: 'Smart Reply', titleKey: 'quickSmartReply', subtitle: 'Keyboard suggestions', subtitleKey: 'quickSmartReplySub', icon: 'message-reply-text-outline', route: 'KeyboardPreview'},
  {title: 'Translate', titleKey: 'quickTranslate', subtitle: '4 languages', subtitleKey: 'quickTranslateSub', icon: 'translate', route: 'Translate'},
  {title: 'Voice Typing', titleKey: 'quickVoiceTyping', subtitle: 'Speak to text', subtitleKey: 'quickVoiceTypingSub', icon: 'microphone-outline', route: 'VoiceAi'},
  {title: 'Rewrite', titleKey: 'quickRewrite', subtitle: 'Tone & grammar', subtitleKey: 'quickRewriteSub', icon: 'pencil-outline', route: 'Rewrite'},
  {title: 'Voice Summary', titleKey: 'quickVoiceSummary', subtitle: 'Chats & notes', subtitleKey: 'quickVoiceSummarySub', icon: 'text-box-check-outline', route: 'VoiceSummary'},
  {title: 'Status Generator', titleKey: 'quickStatus', subtitle: 'Captions', subtitleKey: 'quickStatusSub', icon: 'star-four-points-outline', route: 'StatusGenerator'},
  {title: 'Email Writer', titleKey: 'quickEmail', subtitle: 'Draft faster', subtitleKey: 'quickEmailSub', icon: 'email-edit-outline', route: 'EmailWriter'},
  {title: 'Freelancer Assistant', titleKey: 'quickFreelancer', subtitle: 'Proposals', subtitleKey: 'quickFreelancerSub', icon: 'briefcase-outline', route: 'FreelancerAssistant'},
] as const satisfies ReadonlyArray<{
  title: string;
  titleKey: TranslationKey;
  subtitle: string;
  subtitleKey: TranslationKey;
  icon: string;
  route: string;
}>;

export const history = [
  {group: 'Today', type: 'Writing', icon: 'email-edit-outline', title: 'Email Writer', description: 'Write email about project delay', time: '2:14 PM', route: 'EmailWriter'},
  {group: 'Today', type: 'Replies', icon: 'message-reply-text-outline', title: 'External app smart reply', description: 'Incoming message suggestion preview', time: '1:48 PM', route: 'KeyboardPreview'},
  {group: 'Today', type: 'Replies', icon: 'message-text-outline', title: 'Client call reply', description: 'Could we push it to 2 PM instead?', time: '12:30 PM', route: 'KeyboardPreview'},
  {group: 'Today', type: 'Translate', icon: 'translate', title: 'Translate + Reply', description: 'Bangla milestone payment reply', time: '11:05 AM', route: 'Translate'},
  {group: 'Yesterday', type: 'Voice', icon: 'microphone-outline', title: 'Voice Note Summary', description: '2:14 audio · 3 key points extracted', time: '6:40 PM', route: 'VoiceSummary'},
  {group: 'Yesterday', type: 'Writing', icon: 'pencil-outline', title: 'AI Rewrite', description: 'I need this fast → Friendly tone', time: '4:12 PM', route: 'Rewrite'},
  {group: 'Yesterday', type: 'Writing', icon: 'star-four-points-outline', title: 'Status Generator', description: 'Motivation category · Facebook', time: '9:02 AM', route: 'StatusGenerator'},
] as const;

export const plans = [
  {id: 'free', name: 'Free', price: '৳0', note: '50 AI actions / day'},
  {id: 'pro', name: 'Pro', price: '৳299/mo', note: 'Unlimited AI + voice summary'},
  {id: 'business', name: 'Business', price: '৳899/mo', note: 'Team seats + priority AI'},
] as const;

export const suggestions = {
  incomingMessage: 'Bro can you send report?',
  smartReplies: {
    Professional: 'Sure, sending the report shortly. Thanks for the reminder.',
    Friendly: 'Yep, on it! Will share in 10 mins.',
    Short: 'Sending now.',
  },
  translatedReply: 'Milestone 2 আজকের মধ্যে পাঠিয়ে দিচ্ছি, কাজ প্রায় শেষ। ধন্যবাদ!',
};

export const statuses = [
  'Small steps every day still move the mountain. Keep going.',
  'Your only competition is who you were yesterday.',
  'Discipline is choosing what you want most over what you want now.',
  'Dream big, work hard, stay humble.',
  'Every sunset brings the promise of a new dawn.',
];

export const emailDraft = {
  subject: 'Update on Project Timeline',
  body: "Hi Team,\n\nI wanted to give you an early heads-up that the project will be delayed by approximately 3 days due to an unexpected scope change. We're adjusting the timeline now and will share a revised delivery date by Thursday.\n\nBest,\nHimel",
};

export const freelancerOutputs = {
  'Project proposal':
    "Hi! I read through your Laravel API integration job and it's right in my wheelhouse. I can support backend scaling, API design, and admin workflows while keeping communication clear throughout the project.",
  'Client reply':
    "Thanks for the details. That timeline works for me. I'll start with the API integration, then move into the admin panel and share updates every 2-3 days.",
  'Follow-up':
    "Hi, just following up on the proposal I sent. Happy to answer questions or jump on a quick call if that helps move things forward.",
};

export const translationOutputs = {
  Bangla: 'আজকে অফিসে একটু দেরি হবে, ট্রাফিক অনেক বেশি।',
  English: "I'll be a bit late to the office today, traffic is really heavy.",
  Hindi: 'आज ऑफिस आने में थोड़ी देर होगी, ट्रैफिक बहुत ज्यादा है।',
  Urdu: 'آج دفتر آنے میں تھوڑی دیر ہوگی، ٹریفک بہت زیادہ ہے۔',
};

export const rewriteOutputs = {
  Professional: "Could you please prioritize this when you get a moment? I'd appreciate a quick turnaround.",
  Friendly: 'Hey! Any chance you could speed this one up a bit? Would really help me out.',
  Formal: 'I would be grateful if this matter could be addressed at your earliest convenience.',
  Short: 'Please expedite. Urgent.',
};

export const aiReplies: Record<string, string> = {
  'Client follow-up': "Hi, hope you're doing well. Just a gentle reminder that the invoice is still pending. Could you let me know an expected payment date?",
  'Summarize chats': 'You have three important messages: one report request, one client call confirmation, and one payment milestone follow-up.',
  'Quick translate': '"আজকে মিটিং একটু দেরি হবে" means "Today’s meeting will be a little delayed."',
  'Generate status': 'Small steps every day still move the mountain. Keep going.',
};
import {TranslationKey} from '../localization/translations';
