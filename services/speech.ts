/**
 * Petit helper autour de la Web Speech API du navigateur.
 * Sert de moteur TTS pour le MVP tant que le backend FastAPI ne renvoie
 * pas d'audio pré-généré (audioUrl).
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
}
