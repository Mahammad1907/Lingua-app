export interface SpokenAnswer { text: string; token: string; confidence?: number }
type Phase = 'idle' | 'listening' | 'processing';

// No native handles: late events and repeated finals cannot submit twice.
export class SpeechTurn {
  phase: Phase = 'idle';
  private started = 0;
  private lastSignal = 0;
  private processingSince = 0;
  private text = '';
  private final: SpokenAnswer | null = null;
  private serial = 0;
  private token = '';
  begin(now: number) {
    this.serial++; this.token = `speech:${now}:${this.serial}`;
    this.started = this.lastSignal = now; this.text = ''; this.final = null;
    this.phase = 'listening';
  }
  volume(value: number, now: number) {
    if (this.phase === 'listening' && Number.isFinite(value) && value > .5) this.lastSignal = now;
  }
  result(text: string, isFinal: boolean, confidence: number | undefined, now: number) {
    if (this.phase === 'idle') return;
    if (text.trim() && text !== this.text) this.lastSignal = now;
    this.text = text.trim();
    if (isFinal) { this.final = { text: this.text, confidence, token: this.token }; this.processing(now); }
  }
  processing(now: number) {
    if (this.phase !== 'listening') return;
    this.phase = 'processing'; this.processingSince = now;
  }
  tick(now: number): 'stop' | 'empty' | 'timeout' | null {
    if (this.phase === 'processing') return now - this.processingSince >= 5000 ? 'timeout' : null;
    if (this.phase !== 'listening') return null;
    if (!this.text && now - this.started >= 8000) return 'empty';
    if (now - this.started >= 20000 || this.text && now - this.lastSignal >= 1800) {
      this.processing(now); return 'stop';
    }
    return null;
  }
  finish(): SpokenAnswer | null {
    if (this.phase === 'idle') return null;
    const final = this.final; this.cancel();
    if (!final?.text || final.confidence !== undefined && final.confidence >= 0 && final.confidence < .35) return null;
    return final;
  }
  cancel() { this.phase = 'idle'; this.text = ''; this.final = null; }
}
