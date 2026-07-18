import type { AfriVoiceResponse } from "./afrivoiceClient";

/**
 * Persona simulé — donne une âme humaine à chaque scénario.
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
 * Un tour de conversation = une question de l'utilisateur, une réponse de l'IA.
 * Un scénario complet contient 3 tours enchaînés avec le même persona.
 */
export interface DemoTurn {
  /** Identifiant unique du tour (ex : `moore-sante-t1`). */
  id: string;
  /** Question en langue locale. */
  userLocalText: string;
  /** Traduction française de la question. */
  userFrenchText: string;
  /** Réponse IA en langue locale. */
  aiLocalText: string;
  /** Traduction française de la réponse (lue par le TTS navigateur). */
  aiFrenchText: string;
}

/**
 * Scénario de démonstration complet : un persona qui vit un cas d'usage
 * concret et pose 3 questions successives à AfriVoice AI.
 */
export interface DemoScenario {
  /** Identifiant court du scénario (ex : `moore-sante`). */
  id: string;
  /** Domaine sectoriel (ex : "Santé maternelle"). */
  sector: string;
  /** Sous-titre court affiché dans la carte du menu. */
  sectorTagline: string;
  /** Emoji illustratif pour le menu de sélection. */
  icon: string;
  /** Persona qui incarne le scénario. */
  persona: DemoPersona;
  /** Code ISO 639 de la langue locale. */
  languageCode: string;
  /** Libellé humain de la langue. */
  languageLabel: string;
  /** Hint TTS pour la Web Speech API. */
  ttsLangHint: string;
  /** 3 tours de conversation enchaînés. */
  turns: DemoTurn[];
}

/**
 * Tour prêt à afficher — combine un `DemoTurn` avec le contexte de son
 * scénario (persona, langue, secteur). Consommé par `ResponseBubble`.
 */
export interface ScenarioTurn extends DemoTurn {
  persona: DemoPersona;
  languageLabel: string;
  languageCode: string;
  sector: string;
  ttsLangHint: string;
}

// ==============================================================
//  Corpus scénarisé — Phase 1 · MOORÉ · 4 secteurs × 3 tours
// ==============================================================
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "moore-sante",
    sector: "Santé maternelle",
    sectorTagline: "Fièvre, symptômes, conseils du dispensaire.",
    icon: "🩺",
    persona: {
      name: "Awa",
      role: "Mère de famille",
      location: "Kaya, Burkina Faso",
      initials: "AK",
    },
    languageCode: "mos",
    languageLabel: "Mooré",
    ttsLangHint: "fr-FR",
    turns: [
      {
        id: "moore-sante-t1",
        userLocalText: "M biig tara wʋgd zaame, m maa wãn ?",
        userFrenchText:
          "Mon enfant a de la fièvre depuis hier soir, que dois-je faire ?",
        aiLocalText:
          "Awa, kõ f biigã koom wʋsg, la f ling-a ne peend sẽn tar koom. Wʋgdã sã n paas rasem a yiibu, tall-a n kẽng laafi-yiri.",
        aiFrenchText:
          "Awa, donne beaucoup d'eau à ton enfant et rafraîchis-le avec un linge humide. Si la fièvre dure plus de deux jours, emmène-le au centre de santé.",
      },
      {
        id: "moore-sante-t2",
        userLocalText: "Wakat bʋg la m segd n tall-a n kẽng laafi-yiri ?",
        userFrenchText:
          "À quel moment dois-je vraiment l'emmener au centre de santé ?",
        aiLocalText:
          "F sã n mik t'a pa dɩt, t'a tolgda, walla t'a sũurã ka noom, tall-a tao-tao. Bãag tʋlga bʋʋd a ye.",
        aiFrenchText:
          "Si tu vois qu'il ne mange plus, qu'il vomit, ou qu'il devient très faible, emmène-le immédiatement. Ne perds pas une minute.",
      },
      {
        id: "moore-sante-t3",
        userLocalText: "Mam segd n gũud-a-la wakat sẽn ta wana ?",
        userFrenchText:
          "Pendant combien de temps dois-je le surveiller à la maison ?",
        aiLocalText:
          "Ges-a rasem a yiibu. F sã n pa yã tɩ wʋgdã bʋgse, walla t'a paasda, kẽng laafi-yiri wakat kãnga.",
        aiFrenchText:
          "Observe-le pendant 48 heures. Si la fièvre ne baisse pas ou si elle augmente, va au dispensaire sans attendre.",
      },
    ],
  },

  {
    id: "moore-agriculture",
    sector: "Agriculture pluviale",
    sectorTagline: "Semis, variétés, protection du champ.",
    icon: "🌾",
    persona: {
      name: "Rasmane",
      role: "Cultivateur de mil",
      location: "Koudougou, Burkina Faso",
      initials: "RK",
    },
    languageCode: "mos",
    languageLabel: "Mooré",
    ttsLangHint: "fr-FR",
    turns: [
      {
        id: "moore-agri-t1",
        userLocalText:
          "Mam sã n dat n bʋd m ka-yood m pʋʋgẽ wã, wakat bʋg n zems n bʋd ?",
        userFrenchText:
          "Je veux semer mon sorgho dans mon champ, quel est le meilleur moment ?",
        aiLocalText:
          "Rasmane, saag na n niig raar a tãabo pʋgẽ. Bʋd f ka-yood beoogo bɩ vugri, tɩ tẽng-koomã paam n sɩɩse.",
        aiFrenchText:
          "Rasmane, la pluie arrivera dans les trois prochains jours. Sème ton sorgho demain ou après-demain, afin que le sol garde bien l'humidité.",
      },
      {
        id: "moore-agri-t2",
        userLocalText: "Ka-yood buud bʋg n so tɩ koom pa waoog ?",
        userFrenchText:
          "Quelle variété de sorgho résiste le mieux au manque d'eau ?",
        aiLocalText:
          "Ka-yood « Sariaso 14 » wã n so. A pa rat koom wʋsg la a wʋʋd rasem koabga la piiga pʋgẽ.",
        aiFrenchText:
          "La variété « Sariaso 14 » est la plus adaptée. Elle demande peu d'eau et arrive à maturité en 110 jours seulement.",
      },
      {
        id: "moore-agri-t3",
        userLocalText: "Mam maa wãn tɩ rũm ra dɩ m koodo ?",
        userFrenchText:
          "Comment protéger mes cultures des ravageurs ?",
        aiLocalText:
          "Tall neem tɩɩs vãad n keet ne koom, la f mɩɩsg ka-yoodã sasa a taabo. A na kogl-f-la ne tãmpuur la ratãame.",
        aiFrenchText:
          "Prépare une décoction de feuilles de neem avec de l'eau, et pulvérise-la sur ton sorgho deux fois par semaine. Cela le protège des chenilles et des criquets.",
      },
    ],
  },

  {
    id: "moore-finance",
    sector: "Inclusion financière",
    sectorTagline: "Microcrédit, mobile money, remboursement.",
    icon: "💰",
    persona: {
      name: "Salif",
      role: "Jeune entrepreneur",
      location: "Ouagadougou, Burkina Faso",
      initials: "SO",
    },
    languageCode: "mos",
    languageLabel: "Mooré",
    ttsLangHint: "fr-FR",
    turns: [
      {
        id: "moore-fin-t1",
        userLocalText:
          "Mam datame n paam ligd bilfu m tʋʋm yĩnga, tõe bɛ ne mobile money ?",
        userFrenchText:
          "Je voudrais obtenir un petit crédit pour mon commerce, est-ce possible via mobile money ?",
        aiLocalText:
          "Salif, y tõe n paama ligd bilfu tɛka mobile money wã pʋgẽ, y ka rat sɛb ye. Mam na n wilg-y-la sore fãa.",
        aiFrenchText:
          "Salif, vous pouvez obtenir un microcrédit directement depuis votre mobile money, sans aucun document papier. Je vous guide étape par étape.",
      },
      {
        id: "moore-fin-t2",
        userLocalText: "Ligd wakat bʋg m tõe n paame ?",
        userFrenchText:
          "Quel est le montant maximum que je peux emprunter ?",
        aiLocalText:
          "Piinga, y tõe n paama tɩ ta 50 000 F CFA. F sã n leb n taas neere, ligd wã tõe n paasa tɩ ta 200 000 F CFA.",
        aiFrenchText:
          "Pour votre premier prêt, vous pouvez emprunter jusqu'à 50 000 F CFA. Après un remboursement régulier, le plafond peut monter à 200 000 F CFA.",
      },
      {
        id: "moore-fin-t3",
        userLocalText: "M na n leb n taasa ligdã wakat bʋg ?",
        userFrenchText:
          "Sous combien de temps dois-je rembourser ?",
        aiLocalText:
          "Y tara kiuug a wãabo n leb n taas ligd wã. Y tõe n taasda bilf-bilfu semen fãa tɛka mobile money, tɩ ra keng-y ye.",
        aiFrenchText:
          "Vous avez trois mois pour rembourser. Vous pouvez payer petit à petit chaque semaine depuis le mobile money — sans vous déplacer, ni faire la queue.",
      },
    ],
  },

  {
    id: "moore-education",
    sector: "Éducation & administration",
    sectorTagline: "Inscription à l'école, papiers, mairie.",
    icon: "📘",
    persona: {
      name: "Fatimata",
      role: "Commerçante",
      location: "Bobo-Dioulasso, Burkina Faso",
      initials: "FB",
    },
    languageCode: "mos",
    languageLabel: "Mooré",
    ttsLangHint: "fr-FR",
    turns: [
      {
        id: "moore-edu-t1",
        userLocalText:
          "Mam datame n kẽes m biig lekoolẽ, m sã n dɩk sɛb-bʋs la m rat n tʋme ?",
        userFrenchText:
          "Je veux inscrire mon enfant à l'école, quels documents dois-je préparer ?",
        aiLocalText:
          "Fatimata, y rat-a-la biigã dogem sebre, yãmb meng kartã, la biigã laafi sebre. Yãmb tõe n paam-b-la mairie wã pʋgẽ, zaalem.",
        aiFrenchText:
          "Fatimata, il vous faut l'acte de naissance de l'enfant, votre carte d'identité et son carnet de santé. Vous pouvez les obtenir gratuitement à la mairie de votre commune.",
      },
      {
        id: "moore-edu-t2",
        userLocalText: "M sã n pa tar biigã dogem sebre, m maa wãn ?",
        userFrenchText:
          "Si je n'ai pas l'acte de naissance de mon enfant, que dois-je faire ?",
        aiLocalText:
          "Kẽng-y mairie wã ne kaset-rãmb a yiibu sẽn mi biigã. Bãmb na n pʋɩɩ-y-la seb-paalg zaalem, tɩ pa tar wakat wʋsg ye.",
        aiFrenchText:
          "Rendez-vous à la mairie avec deux témoins qui connaissent l'enfant. Ils vous délivreront un acte gratuitement, et la démarche ne prend que quelques jours.",
      },
      {
        id: "moore-edu-t3",
        userLocalText: "Kẽesg lekoolẽ wã yaa ligd wakat bʋg ?",
        userFrenchText:
          "L'inscription à l'école coûte combien ?",
        aiLocalText:
          "Lekool tɩrgã pʋgẽ, kẽesgã yaa zaalem. Yãmb na n yaa a ligd-y-la fõoto ne sɛb-vãoogo bal, tɩ pa yɩɩd 1 500 F CFA ye.",
        aiFrenchText:
          "Dans l'école publique, l'inscription elle-même est gratuite. Vous paierez uniquement la photo et le cahier de suivi — moins de 1 500 F CFA au total.",
      },
    ],
  },
];

// --------------------------------------------------------------
//  Helpers
// --------------------------------------------------------------

/**
 * Aplati un tour de scénario avec son contexte (persona, langue, secteur)
 * pour l'affichage dans `ResponseBubble`.
 */
export function withScenarioContext(
  scenario: DemoScenario,
  turn: DemoTurn
): ScenarioTurn {
  return {
    ...turn,
    persona: scenario.persona,
    languageLabel: scenario.languageLabel,
    languageCode: scenario.languageCode,
    sector: scenario.sector,
    ttsLangHint: scenario.ttsLangHint,
  };
}

/**
 * Retrocompat : liste plate des « premiers tours » de chaque scénario,
 * utilisée par `mockResponses.ts` pour alimenter le futur backend FastAPI.
 */
export const DEMO_TURNS: ScenarioTurn[] = DEMO_SCENARIOS.map((s) =>
  withScenarioContext(s, s.turns[0])
);

/**
 * Convertit un `ScenarioTurn` en `AfriVoiceResponse` (contrat backend).
 */
export function toAfriVoiceResponse(turn: ScenarioTurn): AfriVoiceResponse {
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
