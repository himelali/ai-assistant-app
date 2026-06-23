export type TextReviewIssue = {
  type: 'spelling' | 'grammar' | 'punctuation' | 'spacing' | 'capitalization';
  message: string;
};

export type TextReviewResult = {
  correctedText: string;
  issues: TextReviewIssue[];
};

const typoCorrections: Record<string, string> = {
  accomodate: 'accommodate',
  adress: 'address',
  recieve: 'receive',
  seperate: 'separate',
  definately: 'definitely',
  grammer: 'grammar',
  teh: 'the',
  alot: 'a lot',
  dont: "don't",
  cant: "can't",
  wont: "won't",
  isnt: "isn't",
  doesnt: "doesn't",
  im: "I'm",
  ive: "I've",
  youre: "you're",
};

export function reviewUserText(input: string): TextReviewResult {
  const issues: TextReviewIssue[] = [];
  let text = input;

  if (/\s{2,}/.test(text)) {
    issues.push({type: 'spacing', message: 'Removed extra spaces.'});
    text = text.replace(/\s{2,}/g, ' ');
  }

  const beforeTypos = text;
  text = text.replace(/\b[A-Za-z']+\b/g, word => {
    const lower = word.toLowerCase();
    const replacement = typoCorrections[lower];
    if (!replacement) {
      return word;
    }
    return /^[A-Z]/.test(word) ? capitalize(replacement) : replacement;
  });
  if (text !== beforeTypos) {
    issues.push({type: 'spelling', message: 'Corrected common spelling mistakes and typos.'});
  }

  const grammarRules: Array<[RegExp, string, string]> = [
    [/\bi am agree\b/gi, 'I agree', 'Changed "I am agree" to "I agree".'],
    [/\bhe have\b/gi, 'he has', 'Fixed subject-verb agreement.'],
    [/\bshe have\b/gi, 'she has', 'Fixed subject-verb agreement.'],
    [/\bit have\b/gi, 'it has', 'Fixed subject-verb agreement.'],
    [/\bthere is many\b/gi, 'there are many', 'Fixed plural agreement.'],
    [/\bmore better\b/gi, 'better', 'Removed duplicate comparison.'],
    [/\bdid not went\b/gi, 'did not go', 'Fixed verb form after "did".'],
  ];

  grammarRules.forEach(([pattern, replacement, message]) => {
    if (pattern.test(text)) {
      issues.push({type: 'grammar', message});
      text = text.replace(pattern, replacement);
    }
  });

  const beforePunctuation = text;
  text = text
    .replace(/\s+([,.!?;:])/g, '$1')
    .replace(/([,.!?;:])(?=\S)/g, '$1 ');
  if (text !== beforePunctuation) {
    issues.push({type: 'punctuation', message: 'Fixed punctuation spacing.'});
  }

  const trimmed = text.trim();
  if (trimmed && /^[a-z]/.test(trimmed)) {
    text = capitalize(trimmed);
    issues.push({type: 'capitalization', message: 'Capitalized the first letter.'});
  } else {
    text = trimmed;
  }

  if (text && !/[.!?]$/.test(text)) {
    text = `${text}.`;
    issues.push({type: 'punctuation', message: 'Added ending punctuation.'});
  }

  return {correctedText: text, issues};
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
