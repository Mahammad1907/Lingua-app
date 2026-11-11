import { vocabularyKey } from '../utils/vocabularyIdentity';
// UK IPA checked against Cambridge Dictionary on 2026-11-11.
// This metadata never supplies answers or changes lesson wording.
const entries: Record<string, { ipa: string; source: string; checkedAt: string; locale: 'en-GB' }> = {
  hello: { ipa: '/heˈləʊ/', source: 'https://dictionary.cambridge.org/us/pronunciation/english/hello', checkedAt: '2026-11-11', locale: 'en-GB' },
  hi: { ipa: '/haɪ/', source: 'https://dictionary.cambridge.org/pronunciation/english/hi', checkedAt: '2026-11-11', locale: 'en-GB' },
  goodbye: { ipa: '/ɡʊdˈbaɪ/', source: 'https://dictionary.cambridge.org/us/pronunciation/english/goodbye', checkedAt: '2026-11-11', locale: 'en-GB' },
  bye: { ipa: '/baɪ/', source: 'https://dictionary.cambridge.org/us/pronunciation/english/bye', checkedAt: '2026-11-11', locale: 'en-GB' },
};
export const verifiedPronunciation = (word: string) => entries[vocabularyKey(word)] ?? null;
