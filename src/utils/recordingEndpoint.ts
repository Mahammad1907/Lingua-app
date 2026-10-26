// Meter-based endpoint for untranscribed practice audio, not a speech or
// pronunciation assessment. Do not send silent recordings or short pauses.
export class RecordingEndpoint {
  private started = 0;
  private lastVoice = 0;
  private active = false;
  heardVoice = false;
  begin(now: number) { this.started = now; this.lastVoice = now; this.heardVoice = false; this.active = true; }
  sample(db: number | undefined, now: number): 'send' | 'empty' | null {
    if (!this.active) return null;
    if (typeof db === 'number' && Number.isFinite(db) && db > -42) { this.heardVoice = true; this.lastVoice = now; }
    if (this.heardVoice && now - this.lastVoice >= 1800 || now - this.started >= 20000) {
      this.active = false; return this.heardVoice ? 'send' : 'empty';
    }
    if (!this.heardVoice && now - this.started >= 8000) { this.active = false; return 'empty'; }
    return null;
  }
  cancel() { this.active = false; }
}
