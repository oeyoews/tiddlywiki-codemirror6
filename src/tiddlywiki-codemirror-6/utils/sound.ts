import cm6 from '../config';

let audioContext: AudioContext | null = null;

type AudioContextConstructor = typeof AudioContext;

function getAudioContextClass(): AudioContextConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window &
    typeof globalThis & { webkitAudioContext?: AudioContextConstructor };
  return window.AudioContext ?? w.webkitAudioContext ?? null;
}

function getOrCreateAudioContext(): AudioContext | null {
  const AudioCtx = getAudioContextClass();
  if (!AudioCtx) return null;

  if (!audioContext) {
    audioContext = new AudioCtx();
  }

  return audioContext;
}

/** Soft, gentle typing tap (~42ms). */
function scheduleTypeClick(ctx: AudioContext) {
  const now = ctx.currentTime;
  const len = 0.042;

  const high = ctx.createOscillator();
  const highGain = ctx.createGain();
  high.type = 'sine';
  high.frequency.setValueAtTime(920, now);
  high.frequency.exponentialRampToValueAtTime(720, now + len);
  highGain.gain.setValueAtTime(0.0001, now);
  highGain.gain.exponentialRampToValueAtTime(0.045, now + 0.01);
  highGain.gain.exponentialRampToValueAtTime(0.001, now + len);
  high.connect(highGain);

  const low = ctx.createOscillator();
  const lowGain = ctx.createGain();
  low.type = 'sine';
  low.frequency.setValueAtTime(480, now);
  low.frequency.exponentialRampToValueAtTime(380, now + len);
  lowGain.gain.setValueAtTime(0.0001, now);
  lowGain.gain.exponentialRampToValueAtTime(0.02, now + 0.014);
  lowGain.gain.exponentialRampToValueAtTime(0.001, now + len);
  low.connect(lowGain);

  const mix = ctx.createGain();
  mix.gain.value = 0.9;
  highGain.connect(mix);
  lowGain.connect(mix);

  const soften = ctx.createBiquadFilter();
  soften.type = 'lowpass';
  soften.frequency.value = 2800;
  mix.connect(soften);
  soften.connect(ctx.destination);

  high.start(now);
  high.stop(now + len + 0.01);
  low.start(now);
  low.stop(now + len + 0.01);
}

function playWhenReady(ctx: AudioContext) {
  const ready =
    ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();

  ready
    .then(() => {
      if (ctx.state === 'running') scheduleTypeClick(ctx);
    })
    .catch(() => {
      // ignore autoplay restrictions
    });
}

/** Unlock audio on first editor interaction. */
export function warmUpAudio() {
  const ctx = getOrCreateAudioContext();
  if (!ctx || ctx.state !== 'suspended') return;
  void ctx.resume();
}

export function playTypeSound() {
  const ctx = getOrCreateAudioContext();
  if (!ctx) return;
  playWhenReady(ctx);
}

/** @deprecated alias */
export const playCompletionSound = playTypeSound;

export function useSound() {
  if (!cm6.useSound()) return;
  playTypeSound();
}

declare global {
  interface Window {
    cm6Sound?: {
      play: typeof playTypeSound;
      use: typeof useSound;
      warmUp: typeof warmUpAudio;
    };
  }
}

if (typeof window !== 'undefined') {
  window.cm6Sound = {
    play: playTypeSound,
    use: useSound,
    warmUp: warmUpAudio
  };
}
