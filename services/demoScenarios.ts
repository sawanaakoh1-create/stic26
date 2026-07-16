import type { AfriVoiceResponse } from "./afrivoiceClient";

/**
 * Persona simulé — donne une âme humaine à chaque tour de la démo.
 */
export interface DemoPersona {
  /** Prénom court affiché dans la bulle utilisateur. */
  name: string;
  /** Métier / rôle. */
  role: string;
  /** Localisation géographique évocatrice (village, région). */
  location: string;
  /** Initiales pour l'avatar rond. */
  initials: string;
}

/**
 * Un tour de conversation = ce que la personne dit, puis ce que l'IA répond.
 * Tout est pré-écrit pour la démo — aucun ASR/TTS distant requis.
 */
export interface DemoTurn {
  id: string;
  persona: DemoPersona;
  languageCode: string;
  languageLabel: string;
  sector: string;
  /** Question de l'utilisateur en langue locale. */
  userLocalText: string;
  /** Traduction française de la question. */
  userFrenchText: string;
  /** Réponse de l'IA en langue locale. */
  aiLocalText: string;
  /** Traduction française de la réponse (celle qui sera lue par le TTS navigateur). */
  aiFrenchText: string;
  /** Hint de langue pour la Web Speech API. */
  ttsLangHint: string;
}

/**
 * Corpus scénarisé de la démonstration STIC'26.
 * Quatre langues d'Afrique de l'Ouest × quatre cas d'usage à fort impact
 * social : agriculture, santé, agriculture, inclusion financière.
 */
export const DEMO_TURNS: DemoTurn[] = [
  {
    id: "wolof-agri",
    persona: {
      name: "Aïcha",
      role: "Cultivatrice d'arachide",
      location: "Kaolack, Sénégal",
      initials: "AD",
    },
    languageCode: "wo",
    languageLabel: "Wolof",
    sector: "Agriculture",
    userLocalText:
      "Sama gerte gi, kañ laa ko war a jaay ci marché bi ngir am njëg bu baax?",
    userFrenchText:
      "Mon arachide, quand dois-je la vendre au marché pour obtenir un bon prix ?",
    aiLocalText:
      "Ndëpp mi, bëgg naa la wax : jaay sa gerte bi ci diggante ëllëg ak ëllëg-jotti, ndax njëg gi jog na ci béréb bi.",
    aiFrenchText:
      "Bonne nouvelle Aïcha : vends ton arachide entre demain et après-demain, les prix ont augmenté de 12 % sur le marché régional.",
    ttsLangHint: "fr-FR",
  },
  {
    id: "bambara-sante",
    persona: {
      name: "Fanta",
      role: "Mère de famille",
      location: "Ségou, Mali",
      initials: "FT",
    },
    languageCode: "bm",
    languageLabel: "Bambara",
    sector: "Santé maternelle",
    userLocalText:
      "N ka den bɛ farigan sɔrɔ kabini kunun sufɛ, n ka mun kɛ sisan?",
    userFrenchText:
      "Mon enfant a de la fièvre depuis hier soir, que dois-je faire maintenant ?",
    aiLocalText:
      "N'i den bɛ farigan sɔrɔ, i k'a min ji caman, ka a lasu ni finiw, ka taa dɔgɔtɔrɔso la ni farigan ma ban tile fila kɔfɛ.",
    aiFrenchText:
      "Fais-lui boire beaucoup d'eau, rafraîchis-le avec des linges humides, et emmène-le au dispensaire si la fièvre persiste plus de deux jours.",
    ttsLangHint: "fr-FR",
  },
  {
    id: "peul-agri",
    persona: {
      name: "Oumar",
      role: "Éleveur & agriculteur",
      location: "Dori, Burkina Faso",
      initials: "OB",
    },
    languageCode: "ff",
    languageLabel: "Peul (Fulfulde)",
    sector: "Agriculture pluviale",
    userLocalText:
      "Mi yiɗi rimndude gawri e ngesa am, ndeen kadi mi jaɓɓoo toɓo?",
    userFrenchText:
      "Je veux semer du mil dans mon champ, dois-je encore attendre la pluie ?",
    aiLocalText:
      "Ndiyam ngam remuru gawri maa : rem e balɗe tati garooje, ndeen ɓaawo lewru, sabu toɓo ina jokka e diiwaan maa.",
    aiFrenchText:
      "Pour ton champ de mil : sème dans les trois prochains jours, avant la fin du mois. Les pluies continuent régulièrement dans ta région.",
    ttsLangHint: "fr-FR",
  },
  {
    id: "moore-finance",
    persona: {
      name: "Salif",
      role: "Jeune entrepreneur",
      location: "Ouagadougou, Burkina Faso",
      initials: "SO",
    },
    languageCode: "mos",
    languageLabel: "Mooré",
    sector: "Inclusion financière",
    userLocalText:
      "Mam datame n paam ligd bilfu m tʋʋm yĩnga, tõe bɛ ne mobile money?",
    userFrenchText:
      "Je voudrais obtenir un petit crédit pour mon commerce, est-ce possible via mobile money ?",
    aiLocalText:
      "Yãmb tõe n paama ligd bilfu tɛka mobile money wã pʋgẽ. Yãmb sã n dat, m na n wilg-y-la sore fãa, tɩ y kõ dokman ba yembre.",
    aiFrenchText:
      "Oui Salif : vous pouvez obtenir un microcrédit directement depuis votre mobile money, sans aucun document papier. Si vous voulez, je vous guide étape par étape.",
    ttsLangHint: "fr-FR",
  },
];

/**
 * Convertit un `DemoTurn` en `AfriVoiceResponse` pour rester compatible
 * avec le contrat d'API destiné au futur backend FastAPI.
 */
export function toAfriVoiceResponse(turn: DemoTurn): AfriVoiceResponse {
  return {
    id: turn.id,
    languageCode: turn.languageCode,
    languageLabel: turn.languageLabel,
    sector: turn.sector,
    localText: turn.aiLocalText,
    frenchText: turn.aiFrenchText,
    ttsLangHint: turn.ttsLangHint,
  };
}
