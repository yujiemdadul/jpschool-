/**
 * Audio and Japanese Pronunciation Utility
 * Uses the Web Speech API with lang='ja-JP' and Web Audio API for sound effects.
 */

const PRONUNCIATION_SOUND_KEY = 'chandu_sound_pronunciation_enabled';
const SOUND_EFFECTS_KEY = 'chandu_sound_effects_enabled';

let synth: SpeechSynthesis | null = null;
let jaVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
  
  const loadVoices = () => {
    if (!synth) return;
    const allVoices = synth.getVoices();
    jaVoices = allVoices.filter(v => v.lang.startsWith('ja') || v.lang.includes('JP'));
  };

  loadVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && synth !== null;
}

/**
 * Sound settings preferences (global + localStorage persisted)
 */
export function isPronunciationSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(PRONUNCIATION_SOUND_KEY);
  return stored !== 'false'; // Default: enabled (true)
}

export function setPronunciationSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRONUNCIATION_SOUND_KEY, enabled ? 'true' : 'false');
}

export function isSoundEffectsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(SOUND_EFFECTS_KEY);
  return stored !== 'false'; // Default: enabled (true)
}

export function setSoundEffectsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_EFFECTS_KEY, enabled ? 'true' : 'false');
}

/**
 * Speaks a Japanese character or word clearly
 */
export function playJapaneseAudio(text: string, onEnd?: () => void): boolean {
  // Check if global pronunciation sound is disabled
  if (!isPronunciationSoundEnabled()) {
    if (onEnd) {
      setTimeout(onEnd, 50);
    }
    return false;
  }

  if (!isSpeechSupported() || !synth) {
    console.warn('Speech synthesis not supported in this browser environment.');
    if (onEnd) onEnd();
    return false;
  }

  try {
    synth.cancel(); // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85; // Slightly slower for crisp beginner articulation
    utterance.pitch = 1.0;

    if (jaVoices.length > 0) {
      utterance.voice = jaVoices[0];
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = () => {
        onEnd();
      };
    }

    synth.speak(utterance);
    return true;
  } catch (error) {
    console.error('Error speaking Japanese audio:', error);
    if (onEnd) onEnd();
    return false;
  }
}

/**
 * Web Audio API synthesized feedback sounds
 */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSuccessSound() {
  if (!isSoundEffectsEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Pleasant chime chord
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.25); // G5

    osc2.frequency.setValueAtTime(1046.5, now + 0.15); // C6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.15);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch {
    // Graceful silent fallback
  }
}

export function playWrongSound() {
  if (!isSoundEffectsEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // Graceful silent fallback
  }
}

export function playFanfareSound() {
  if (!isSoundEffectsEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.1;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch {
    // Graceful silent fallback
  }
}

/**
 * Pleasant oriental wind chime for Kitsune Fox mascot interactions
 */
export function playKitsuneChime() {
  if (!isSoundEffectsEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Traditional Japanese Insen/Hirajoshi scale notes
    const bellNotes = [880, 1174.66, 1318.51, 1760]; // A5, D6, E6, A6
    bellNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  } catch {
    // Fallback silent
  }
}

/**
 * Sparkle celebratory sound effect for streak completion and daily goal accomplishments
 */
export function playFireSparkleChime() {
  if (!isSoundEffectsEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Harmonic sparkle notes (F#6, A6, C#7, E7, G#7)
    const sparkles = [1479.98, 1760.00, 2217.46, 2637.02, 3322.44];
    sparkles.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch {
    // Fallback silent
  }
}
