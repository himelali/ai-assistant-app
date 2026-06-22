export type KeyboardSuggestionRequest = {
  copiedText: string;
  tone?: 'Professional' | 'Friendly' | 'Short';
};

export type KeyboardSuggestionResponse = {
  source: 'mock-api';
  suggestions: Record<'Professional' | 'Friendly' | 'Short', string>;
};

export async function requestKeyboardSuggestions({
  copiedText,
}: KeyboardSuggestionRequest): Promise<KeyboardSuggestionResponse> {
  await new Promise(resolve => setTimeout(resolve, 850));

  const context = copiedText.toLowerCase();

  if (context.includes('report')) {
    return {
      source: 'mock-api',
      suggestions: {
        Professional: 'Sure, I will send the report shortly. Thanks for the reminder.',
        Friendly: 'Yep, on it! I will share it in 10 minutes.',
        Short: 'Sending now.',
      },
    };
  }

  if (context.includes('payment') || context.includes('milestone')) {
    return {
      source: 'mock-api',
      suggestions: {
        Professional: 'I will share the milestone update today and confirm once it is completed.',
        Friendly: 'I will sort it out today and update you soon.',
        Short: 'I will update you today.',
      },
    };
  }

  if (context.includes('call') || context.includes('meeting')) {
    return {
      source: 'mock-api',
      suggestions: {
        Professional: 'Yes, the meeting is confirmed. I will join on time.',
        Friendly: 'Yes, we are still on. See you then.',
        Short: 'Confirmed.',
      },
    };
  }

  return {
    source: 'mock-api',
    suggestions: {
      Professional: 'Thanks for your message. I will review it and get back to you shortly.',
      Friendly: 'Thanks! I will check and reply soon.',
      Short: 'I will check.',
    },
  };
}
