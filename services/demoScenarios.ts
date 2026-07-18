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
 * Corpus scénarisé de la démonstration STIC'26 — PHASE 1 : MOORÉ.
 *
 * Le MVP se concentre volontairement sur une seule langue — le Mooré,
 * parlée par ~8 millions de personnes au Burkina Faso — pour prouver
 * la profondeur sectorielle de la solution avant l'extension multilingue.
 *
 * Quatre personas incarnent quatre cas d'usage à fort impact social :
 *   1. Salif    · Ouagadougou    · Inclusion financière (mobile money)
 *   2. Rasmane  · Koudougou      · Agriculture pluviale
 *   3. Awa      · Kaya           · Santé maternelle & infantile
 *   4. Fatimata · Bobo-Dioulasso · Éducation & démarches administratives
 */
export const DEMO_TURNS: DemoTurn[] = [
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
  {
    id: "moore-agriculture",
    persona: {
      name: "Rasmane",
      role: "Cultivateur de mil",
      location: "Koudougou, Burkina Faso",
      initials: "RK",
    },
    languageCode: "mos",
    languageLabel: "Mooré",
    sector: "Agriculture pluviale",
    userLocalText:
      "Mam sã n dat n bʋd m ka-yood m pʋʋgẽ wã, wakat bʋg n zems n bʋd?",
    userFrenchText:
      "Je veux semer mon sorgho dans mon champ, quel est le meilleur moment pour le faire ?",
    aiLocalText:
      "Rasmane, saag na n niig raar a tãabo pʋgẽ. Bʋd f ka-yood beoogo bɩ vugri, tɩ tẽng-koomã paam n sɩɩse.",
    aiFrenchText:
      "Rasmane, la pluie arrivera dans les trois prochains jours. Sème ton sorgho demain ou après-demain, afin que le sol garde bien l'humidité.",
    ttsLangHint: "fr-FR",
  },
  {
    id: "moore-sante",
    persona: {
      name: "Awa",
      role: "Mère de famille",
      location: "Kaya, Burkina Faso",
      initials: "AK",
    },
    languageCode: "mos",
    languageLabel: "Mooré",
    sector: "Santé maternelle",
    userLocalText:
      "M biig tara wʋgd zaame, m maa wãn?",
    userFrenchText:
      "Mon enfant a de la fièvre depuis hier soir, que dois-je faire ?",
    aiLocalText:
      "Awa, kõ f biigã koom wʋsg, la f ling-a ne peend sẽn tar koom. Wʋgdã sã n paas rasem a yiibu, tall-a n kẽng laafi-yiri.",
    aiFrenchText:
      "Awa, donne beaucoup d'eau à ton enfant et rafraîchis-le avec un linge humide. Si la fièvre dure plus de deux jours, emmène-le au centre de santé.",
    ttsLangHint: "fr-FR",
  },
  {
    id: "moore-education",
    persona: {
      name: "Fatimata",
      role: "Commerçante",
      location: "Bobo-Dioulasso, Burkina Faso",
      initials: "FB",
    },
    languageCode: "mos",
    languageLabel: "Mooré",
    sector: "Éducation & administration",
    userLocalText:
      "Mam datame n kẽes m biig lekoolẽ, m sã n dɩk sɛb-bʋs la m rat n tʋme?",
    userFrenchText:
      "Je veux inscrire mon enfant à l'école, quels documents dois-je préparer ?",
    aiLocalText:
      "Fatimata, y rat-a-la biigã dogem sebre, yãmb meng kartã, la biigã laafi sebre. Yãmb tõe n paam-b-la mairie wã pʋgẽ, zaalem.",
    aiFrenchText:
      "Fatimata, il vous faut l'acte de naissance de l'enfant, votre carte d'identité et son carnet de santé. Vous pouvez les obtenir gratuitement à la mairie de votre commune.",
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
