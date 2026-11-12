// Single source of truth for the names of the recurring lesson characters.
// The final names are not chosen yet, so every name is empty on purpose.
// Write a name here once and it is used in every lesson, audio text, explanation
// and vocabulary example. While a name is empty, Azerbaijani text uses the
// neutral fallback word and English examples simply leave the name out.

export type CharacterRole = 'mascot' | 'girl' | 'boy';
export type AzCase = 'nom' | 'gen' | 'dat' | 'acc' | 'abl' | 'loc';

interface CharacterConfig {
  /** Name in Azerbaijani text. Empty = not chosen yet. */
  az: string;
  /** Name in English text. Empty = same as `az`. */
  en: string;
  /** Write suffixes with a hyphen (foreign names: BirFox-un) or attach them (Leylanın). */
  hyphen: boolean;
  /** Neutral Azerbaijani words used while the name is empty. */
  fallback: Record<AzCase, string>;
}

export const CHARACTERS: Record<CharacterRole, CharacterConfig> = {
  // Main mascot: orange hood, brown face, yellow oval eyes.
  mascot: { az: '', en: '', hyphen: true, fallback: { nom: 'dostun', gen: 'dostunun', dat: 'dostuna', acc: 'dostunu', abl: 'dostundan', loc: 'dostunda' } },
  // Silver-haired girl in purple.
  girl: { az: '', en: '', hyphen: false, fallback: { nom: 'qız', gen: 'qızın', dat: 'qıza', acc: 'qızı', abl: 'qızdan', loc: 'qızda' } },
  // Boy in orange.
  boy: { az: '', en: '', hyphen: false, fallback: { nom: 'oğlan', gen: 'oğlanın', dat: 'oğlana', acc: 'oğlanı', abl: 'oğlandan', loc: 'oğlanda' } },
};

const VOWELS = 'aıoueəiöü';

/** Azerbaijani case suffix for a proper name, following vowel harmony. */
export function azSuffix(name: string, kind: AzCase): string {
  if (kind === 'nom' || !name) return '';
  const lower = Array.from(name.toLocaleLowerCase('az'));
  const last = [...lower].reverse().find(c => VOWELS.includes(c)) || 'a';
  const vowelEnd = VOWELS.includes(lower[lower.length - 1] ?? '');
  const four = ({ a: 'ı', ı: 'ı', o: 'u', u: 'u', e: 'i', ə: 'i', i: 'i', ö: 'ü', ü: 'ü' } as Record<string, string>)[last] ?? 'ı';
  const two = 'aıou'.includes(last) ? 'a' : 'ə';
  switch (kind) {
    case 'gen': return `${vowelEnd ? 'n' : ''}${four}n`;
    case 'acc': return `${vowelEnd ? 'n' : ''}${four}`;
    case 'dat': return `${vowelEnd ? 'y' : ''}${two}`;
    case 'abl': return `d${two}n`;
    case 'loc': return `d${two}`;
  }
}

const capitalize = (text: string) => text ? text.charAt(0).toLocaleUpperCase('az') + text.slice(1) : text;

export function characterAz(role: CharacterRole, kind: AzCase = 'nom', config = CHARACTERS): string {
  const c = config[role];
  if (!c.az.trim()) return c.fallback[kind];
  const suffix = azSuffix(c.az, kind);
  return suffix ? `${c.az}${c.hyphen ? '-' : ''}${suffix}` : c.az;
}

export function characterEn(role: CharacterRole, config = CHARACTERS): string {
  const c = config[role];
  return (c.en || c.az).trim();
}

export const hasCharacterName = (role: CharacterRole, config = CHARACTERS) => Boolean(config[role].az.trim());

const roles: Record<string, CharacterRole> = { m: 'mascot', g: 'girl', b: 'boy' };

/**
 * Replaces name tokens in lesson text:
 * - `{M}` / `{m}` (mascot), `{G}` / `{g}` (girl), `{B}` / `{b}` (boy): Azerbaijani,
 *   upper-case letter = capitalised. Optional case: `{M:gen}`, `{m:dat}`, `{m:acc}`, `{m:abl}`, `{m:loc}`.
 * - `{,G}`: Azerbaijani name with a leading comma (", Leyla"), or nothing while empty.
 * - `{en:M}`: English name, `{en,G}`: English name with a leading comma, or nothing while empty.
 */
export function withNames(text: string, config = CHARACTERS): string {
  return text
    .replace(/\{en(,)?:?([MGB])\}/g, (_all, comma: string, letter: string) => {
      const name = characterEn(roles[letter.toLowerCase()], config);
      return name ? `${comma ? ', ' : ''}${name}` : '';
    })
    .replace(/\{,([MGBmgb])\}/g, (_all, letter: string) => {
      const role = roles[letter.toLowerCase()];
      return hasCharacterName(role, config) ? `, ${characterAz(role, 'nom', config)}` : '';
    })
    .replace(/\{([MGBmgb])(?::(gen|dat|acc|abl|loc))?\}/g, (_all, letter: string, kind?: AzCase) => {
      const value = characterAz(roles[letter.toLowerCase()], kind ?? 'nom', config);
      return letter === letter.toUpperCase() ? capitalize(value) : value;
    });
}

/** Applies `withNames` to every string (and object key) of a data structure. */
export function resolveNames<T>(value: T, config = CHARACTERS): T {
  if (typeof value === 'string') return withNames(value, config) as T;
  if (Array.isArray(value)) return value.map(item => resolveNames(item, config)) as T;
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [withNames(key, config), resolveNames(item, config)]),
  ) as T;
  return value;
}
