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
  /**
   * Appelé à chaque frontière de mot pendant la lecture TTS.
   * Utilisé pour piloter le sous-titre karaoké (mise en surbrillance
   * synchrone du mot en cours). Certains navigateurs ne l'émettent pas
   * (Firefox partiel) — dans ce cas la surbrillance est simplement absente.
   */
  onBoundary?: (charIndex: number) => void;
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
  onBoundary,
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
  if (onBoundary) {
    utterance.onboundary = (event) => {
      // On ne s'intéresse qu'aux frontières de mot ; on ignore les phonèmes.
      if (event.name && event.name !== "word") return;
      onBoundary(event.charIndex);
    };
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
