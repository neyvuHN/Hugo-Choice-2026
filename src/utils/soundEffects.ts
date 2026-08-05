class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Audio context policy fallback
    }
  }

  public playSelect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(880, now + 0.16); // A5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Ignore
    }
  }

  public playFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } catch {
      // Ignore
    }
  }

  public playPaperSlide() {
    if (this.isMuted) return;
    try {
      const audio = new Audio('/assets/paper_slide.wav');
      audio.volume = 0.9;
      // Reset currentTime if already created or clone for overlapping clicks
      audio.currentTime = 0;
      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn('Audio play failed:', err);
        });
      }
    } catch (e) {
      console.warn('Paper slide sound error:', e);
    }
  }

  public playNomineeClick() {
    if (this.isMuted) return;
    try {
      const audio = new Audio('/click%20next.mp3');
      audio.volume = 0.7;
      audio.currentTime = 0;
      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn('Nominee click sound play failed:', err);
        });
      }
    } catch (e) {
      console.warn('Nominee click sound error:', e);
    }
  }

  public playSubmit() {
    if (this.isMuted) return;
    try {
      const audio = new Audio('/submit%20form.mp3');
      audio.volume = 0.9;
      audio.currentTime = 0;
      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn('Submit sound play failed:', err);
        });
      }
    } catch (e) {
      console.warn('Submit sound error:', e);
    }
  }
}

export const soundFx = new SoundManager();
