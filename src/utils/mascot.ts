// Single source of truth; BirFox is only the current placeholder, not a final choice.
export const MASCOT_NAME: string = 'BirFox';

// Azerbaijani suffixes follow the last vowel; override them here for names with
// unusual pronunciation. The default preserves the existing lesson text exactly.
export function mascotText(text: string, name = MASCOT_NAME): string {
  if (name === 'BirFox') return text;
  const last = Array.from(name.toLocaleLowerCase('az')).reverse().find(c => 'aıoueiöüə'.includes(c)) || 'a';
  const back = 'aıou'.includes(last);
  const vowelEnd = /[aıoueiöüə]$/iu.test(name);
  const genitive: Record<string, string> = { a: 'ın', ı: 'ın', o: 'un', u: 'un', e: 'in', i: 'in', ö: 'ün', ü: 'ün', ə: 'in' };
  const endings: Record<string, string> = {
    un: `${vowelEnd ? 'n' : ''}${genitive[last]}`,
    a: `${vowelEnd ? 'y' : ''}${back ? 'a' : 'ə'}`,
    am: back ? 'am' : 'əm', dur: back ? 'dır' : 'dir', dan: back ? 'dan' : 'dən',
  };
  return text.replace(/BirFox(?:-(un|am|dur|dan|a)|(?=(?:am|dur)\b)(am|dur))?/g,
    (_all, hyphen, joined) => hyphen || joined ? `${name}-${endings[hyphen || joined]}` : name);
}

// Transform both values and keys: audio-text translation dictionaries use text as keys.
export function resolveMascot<T>(value: T, name = MASCOT_NAME): T {
  if (typeof value === 'string') return mascotText(value, name) as T;
  if (Array.isArray(value)) return value.map(item => resolveMascot(item, name)) as T;
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [mascotText(key, name), resolveMascot(item, name)]),
  ) as T;
  return value;
}
