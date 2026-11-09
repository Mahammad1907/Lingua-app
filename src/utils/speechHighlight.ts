export type SpeechHighlight = { text: string; start: number; end: number };
export function speechBoundary(text: string, index: number, length: number): SpeechHighlight | null {
  if (!Number.isInteger(index) || !Number.isInteger(length) || index < 0 || length <= 0 || index + length > text.length) return null;
  return { text, start: index, end: index + length };
}
export function highlightedSpeechRange(display: string, focus?: SpeechHighlight | null) {
  if (!focus) return null;
  const offset = display.toLocaleLowerCase('en').indexOf(focus.text.toLocaleLowerCase('en'));
  return offset < 0 ? null : { start: offset + focus.start, end: offset + focus.end };
}
