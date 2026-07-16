/**
 * Petit helper autour de la Web Speech API du navigateur.
 * Sert de moteur TTS de secours pour le MVP tant que le backend
 * FastAPI ne renvoie pas d'audio pré-généré (audioUrl).
 */

export interface SpeakOptions {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak({
  text,
  lang = "fr-FR",
  rate = 1,
  pitch = 1,
  onStart,
  onEnd,
}: SpeakOptions): void {
  if (!isSpeechSynthesisSupported()) {
    onEnd?.();
    return;
  }

  // Annule toute lecture en cours pour éviter les chevauchements.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;

  // Sélectionne une voix compatible si disponible (meilleure qualité).
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase())) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("fr"));
  if (preferred) utterance.voice = preferred;

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
  stopAudioPlayback();
}

// ============================================================
//  Lecture d'un blob audio (TTS Mooré retourné par /api/voice)
// ============================================================

let currentAudio: HTMLAudioElement | null = null;

export interface PlayAudioOptions {
  base64: string;
  mimeType?: string | null;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Décode un audio base64 (renvoyé par Hugging Face TTS) et le joue.
 * Renvoie une fonction pour arrêter la lecture.
 */
export function playAudioBase64({
  base64,
  mimeType,
  onStart,
  onEnd,
}: PlayAudioOptions): (() => void) | null {
  if (typeof window === "undefined") return null;

  try {
    stopAudioPlayback();

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType || "audio/flac" });
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);
    currentAudio = audio;

    audio.onplay = () => onStart?.();
    audio.onended = () => {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      onEnd?.();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      onEnd?.();
    };

    void audio.play();

    return () => {
      audio.pause();
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      onEnd?.();
    };
  } catch (err) {
    console.warn("[speech] playAudioBase64 error", err);
    onEnd?.();
    return null;
  }
}

export function stopAudioPlayback(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
    } catch {
      /* noop */
    }
    currentAudio = null;
  }
}
