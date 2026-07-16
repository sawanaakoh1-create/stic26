/**
 * Réponses multilingues pour AfriVoice AI — langues d'Afrique de l'Ouest.
 *
 * Chaque intention est disponible dans plusieurs langues locales. La langue
 * de la réponse est **automatiquement détectée** depuis les mots-clés
 * présents dans la transcription de l'utilisateur.
 *
 *   Exemple :
 *     - « j'ai farigan »   → détecté : Mooré  → réponse en Mooré  + trad. FR
 *     - « ma tanga bi »    → détecté : Wolof  → réponse en Wolof  + trad. FR
 *     - « j'ai de la fièvre » → détecté : FR → réponse Mooré (par défaut) + trad. FR
 *
 * ⚠️ Les formulations locales sont des ébauches à valider avec un·e
 * locuteur·rice natif·ve avant tout usage public.
 */

export type LanguageCode = "mos" | "wo" | "bm" | "ff" | "fr";

export type IntentId =
  | "greeting"
  | "health"
  | "health_location"
  | "health_prevention"
  | "health_medication"
  | "agriculture"
  | "agriculture_when"
  | "agriculture_market"
  | "finance"
  | "finance_how"
  | "finance_amount"
  | "education"
  | "education_topic"
  | "affirmative"
  | "thanks"
  | "fallback";

export interface LanguageMeta {
  label: string;
  ttsModel: string;
  /** Langue de fallback pour la Web Speech API du navigateur. */
  webSpeechHint: string;
  /** Voix Web Speech préférée si TTS backend indisponible. */
  webSpeechLang: string;
}

export const LANGUAGES: Record<LanguageCode, LanguageMeta> = {
  mos: {
    label: "Mooré",
    ttsModel: "facebook/mms-tts-mos",
    webSpeechHint: "fr-FR",
    webSpeechLang: "fr-FR",
  },
  wo: {
    label: "Wolof",
    ttsModel: "facebook/mms-tts-wol",
    webSpeechHint: "fr-FR",
    webSpeechLang: "fr-FR",
  },
  bm: {
    label: "Bambara",
    ttsModel: "facebook/mms-tts-bam",
    webSpeechHint: "fr-FR",
    webSpeechLang: "fr-FR",
  },
  ff: {
    label: "Peul (Fulfulde)",
    ttsModel: "facebook/mms-tts-fuh",
    webSpeechHint: "fr-FR",
    webSpeechLang: "fr-FR",
  },
  fr: {
    label: "Français",
    ttsModel: "facebook/mms-tts-fra",
    webSpeechHint: "fr-FR",
    webSpeechLang: "fr-FR",
  },
};

/** Langue par défaut du projet si aucune détection n'est possible. */
export const DEFAULT_LANGUAGE: LanguageCode = "mos";

interface LocalizedText {
  local: string;
  french: string;
}

export interface LocalIntent {
  id: string;
  intent: IntentId;
  parentIntent?: IntentId;
  sector: string;
  /** Mots-clés déclencheurs par langue. La langue du mot-clé matché devient la langue de réponse. */
  keywords: Partial<Record<LanguageCode, string[]>>;
  /** Réponses (texte local + traduction française) disponibles par langue. */
  answers: Partial<Record<LanguageCode, LocalizedText>>;
}

// ============================================================
//  Catalogue multilingue
// ============================================================

export const INTENTS: LocalIntent[] = [
  // -----------------------------------------------------------
  //  Accueil
  // -----------------------------------------------------------
  {
    id: "greeting",
    intent: "greeting",
    sector: "Accueil",
    keywords: {
      fr: ["bonjour", "salut", "bonsoir", "hello", "coucou"],
      mos: ["ne y windga", "ne y yibeoogo", "windga", "yibeoogo"],
      wo: ["nangeen def", "salamalekum", "asalaamalekum", "jamm ak jamm", "nanga def"],
      bm: ["i ni ce", "i ni sogoma", "aw ni ce"],
      ff: ["jam waali", "no ngoolu-ɗaa", "on jaaraama"],
    },
    answers: {
      mos: {
        local:
          "Ne y yibeoogo! Mam yaa AfriVoice AI. Sokr-y m sẽn tõe n sõng-y ne bũmb ninga : laafɩ, pʋʋgo, karengo bɩ ligd yɛlã.",
        french:
          "Bonjour ! Je suis AfriVoice AI. Dites-moi ce dont vous avez besoin : santé, agriculture, école ou argent.",
      },
      wo: {
        local:
          "Nangeen def! Man dama tudd AfriVoice AI. Waxal ma li nga bëgg : wér-gu-yaram, mbay, daara walla xaalis.",
        french:
          "Bonjour ! Je m'appelle AfriVoice AI. Dites-moi ce que vous voulez : santé, agriculture, école ou argent.",
      },
      bm: {
        local:
          "I ni ce! N tɔgɔ ye AfriVoice AI. A fɔ n ye i mago bɛ min na : kɛnɛya, sɛnɛkɛ, kalan wala wari.",
        french:
          "Bonjour ! Je m'appelle AfriVoice AI. Dites-moi ce dont vous avez besoin : santé, agriculture, école ou argent.",
      },
      ff: {
        local:
          "Jam waali! Miɗo wiyee AfriVoice AI. Wiyam ko haajaɗaa : cellal, ndema, ekkitagol walla ceede.",
        french:
          "Bonjour ! Je m'appelle AfriVoice AI. Dites-moi ce dont vous avez besoin : santé, agriculture, école ou argent.",
      },
      fr: {
        local:
          "Bonjour ! Je suis AfriVoice AI. Dites-moi ce dont vous avez besoin : santé, agriculture, école ou argent.",
        french:
          "Bonjour ! Je suis AfriVoice AI. Dites-moi ce dont vous avez besoin : santé, agriculture, école ou argent.",
      },
    },
  },

  // -----------------------------------------------------------
  //  Santé (racine)
  // -----------------------------------------------------------
  {
    id: "health",
    intent: "health",
    sector: "Santé",
    keywords: {
      fr: [
        "santé",
        "malade",
        "maladie",
        "docteur",
        "médecin",
        "hôpital",
        "dispensaire",
        "fièvre",
        "toux",
        "douleur",
      ],
      mos: ["bãag", "farigan", "dogtoor", "logtoro", "laafɩ"],
      wo: ["feebar", "tang", "tanga", "doktoor", "opitaan", "doktor", "wér"],
      bm: ["bana", "farigan", "dɔgɔtɔrɔ", "kɛnɛya"],
      ff: ["ñawu", "baɗe", "cafrirde", "cellal"],
    },
    answers: {
      mos: {
        local:
          "Yãmb sã n wʋm bãag toog-a, kẽng-y ne dogtoor bilfu. M tõe n wilg-y-la sɛn-doog sẽn pẽ ne yãmba, bɩ m yaool n togs-y sɛba n gũusa yĩngã.",
        french:
          "Si vous ressentez un malaise, consultez rapidement un professionnel de santé. Je peux vous indiquer le centre de santé le plus proche, ou vous donner des conseils de prévention.",
      },
      wo: {
        local:
          "Boo tanga walla nga feebar, dem ci wet doktoor bi bu gaaw. Man man laa la wax fu nga mëna ëgg dispensaire bi gëna jege, walla ma la joxe ay ndimbal ngir tere feebar.",
        french:
          "Si vous avez de la fièvre ou vous êtes malade, allez voir le médecin sans attendre. Je peux vous dire où trouver le dispensaire le plus proche, ou vous donner des conseils de prévention.",
      },
      bm: {
        local:
          "N'i bana, taa dɔgɔtɔrɔso la joona. N bɛ se ka dɔgɔtɔrɔso gɛrɛnin jira i la, walima ka bana taama-taama fɔ i ye.",
        french:
          "Si vous êtes malade, allez rapidement au dispensaire. Je peux vous indiquer le centre de santé le plus proche, ou vous expliquer comment prévenir la maladie.",
      },
      ff: {
        local:
          "So a nawii, yah cafrirde nde law. Miɗo waawi hollirde ma cafrirde ɓadiide, walla rokke ma feere ngam reennuɗi ñawu.",
        french:
          "Si vous êtes malade, rendez-vous rapidement au centre de santé. Je peux vous indiquer le plus proche, ou vous donner des conseils de prévention.",
      },
      fr: {
        local:
          "Si vous ressentez un malaise, consultez rapidement un professionnel de santé. Je peux vous indiquer le centre de santé le plus proche, ou vous donner des conseils de prévention.",
        french:
          "Si vous ressentez un malaise, consultez rapidement un professionnel de santé. Je peux vous indiquer le centre de santé le plus proche, ou vous donner des conseils de prévention.",
      },
    },
  },

  // Suivi santé — localisation
  {
    id: "health_location",
    intent: "health_location",
    parentIntent: "health",
    sector: "Santé",
    keywords: {
      fr: ["où", "près", "proche", "indique", "montre", "adresse", "centre", "chemin"],
      mos: ["yaa"],
      wo: ["fan", "fu"],
      bm: ["min", "fan"],
    },
    answers: {
      mos: {
        local:
          "Sɛn-doog sẽn pẽ ne yãmba bee kilometer a yiibu la pʋga. Kẽng-y sor kãseng zĩig sẽn yaa yaanga, la yãmb ne-a rɩtg-a.",
        french:
          "Le centre de santé le plus proche est à environ 2 kilomètres. Prenez la route principale vers l'est, il est sur votre droite. Ouvert de 8h à 17h.",
      },
      wo: {
        local:
          "Dispensaire bi gëna jege, mu ngi fii kilomeetar ñaar. Jël sa yoon wu mag wi, dem penku, mu ngi ci sa loxo ndijoor. Mu ngi ubbi diggante 8h ba 17h.",
        french:
          "Le dispensaire le plus proche est à 2 kilomètres. Prenez la route principale vers l'est, il est sur votre droite. Ouvert de 8h à 17h.",
      },
      bm: {
        local:
          "Dɔgɔtɔrɔso gɛrɛnin bɛ i la kilomɛtɛrɛ fila. Sira belebele ta ka taa kɔrɔn fan fɛ, a bɛ i kininbolo la. A bɛ da 8ɛrɛ ma fo 17ɛrɛ.",
        french:
          "Le dispensaire le plus proche est à 2 km. Prenez la route principale vers l'est, il est sur votre droite. Ouvert de 8h à 17h.",
      },
      fr: {
        local:
          "Le centre de santé le plus proche est à environ 2 kilomètres. Prenez la route principale vers l'est, il est sur votre droite. Ouvert de 8h à 17h.",
        french:
          "Le centre de santé le plus proche est à environ 2 kilomètres. Prenez la route principale vers l'est, il est sur votre droite. Ouvert de 8h à 17h.",
      },
    },
  },

  // Suivi santé — prévention
  {
    id: "health_prevention",
    intent: "health_prevention",
    parentIntent: "health",
    sector: "Santé",
    keywords: {
      fr: ["prévention", "prévenir", "éviter", "conseil", "protéger", "comment"],
      mos: ["gũus"],
      wo: ["moytu", "aar"],
    },
    answers: {
      mos: {
        local:
          "Farigan yell pʋgẽ : yɩ-y vʋʋs, yũ-y ko-noog wʋsgo, la ges-y y yĩnga toolem. Sã n loog-a degre 39, kẽng-y ne dogtoor tao-tao.",
        french:
          "En cas de fièvre : reposez-vous, buvez beaucoup d'eau et surveillez votre température. Si elle dépasse 39°C, consultez un médecin sans attendre.",
      },
      wo: {
        local:
          "Sooy tang : noflu, naan ndox lu bare, xool sa yaram bi. Bu jitee 39, dem doktoor bi ci saa si.",
        french:
          "En cas de fièvre : reposez-vous, buvez beaucoup d'eau, surveillez votre corps. Si elle dépasse 39°C, allez chez le médecin sur-le-champ.",
      },
      fr: {
        local:
          "En cas de fièvre : reposez-vous, buvez beaucoup d'eau et surveillez votre température. Si elle dépasse 39°C, consultez un médecin sans attendre.",
        french:
          "En cas de fièvre : reposez-vous, buvez beaucoup d'eau et surveillez votre température. Si elle dépasse 39°C, consultez un médecin sans attendre.",
      },
    },
  },

  // -----------------------------------------------------------
  //  Agriculture (racine)
  // -----------------------------------------------------------
  {
    id: "agriculture",
    intent: "agriculture",
    sector: "Agriculture",
    keywords: {
      fr: [
        "champ",
        "récolte",
        "pluie",
        "semis",
        "engrais",
        "mil",
        "sorgho",
        "arachide",
        "semer",
      ],
      mos: ["puug", "kã-goma", "wobre", "raagd", "saag", "ki"],
      wo: ["tool", "toolu", "gerte", "taw", "dugub", "mbay"],
      bm: ["foro", "sanji", "keninke", "tiga", "sɛnɛ"],
    },
    answers: {
      mos: {
        local:
          "Rasem a tãabo pʋgẽ, saag na n niig sõma yãmb tẽngã zĩiga. M tõe n togs-y wakat sẽn yaa sõma n bʋd, bɩ pilg-y ne raoã raagd.",
        french:
          "Selon les prévisions, les prochaines pluies devraient être bonnes dans votre zone. Je peux vous indiquer la meilleure période pour semer, ou vous donner les prix du marché.",
      },
      wo: {
        local:
          "Ci ëllëg ak ellëg-jotti, taw bi dina wàcc bu baax ci sa gox. Man na la wone waxtu wu gëna baax bii ngir ji, walla ma la wax njëg yi ci béréb bi.",
        french:
          "Entre demain et après-demain, les pluies devraient être bonnes dans votre zone. Je peux vous indiquer le meilleur moment pour semer, ou vous donner les prix du marché.",
      },
      bm: {
        local:
          "Tile saba kɔnɔ, sanji bɛna na kosɛbɛ i ka mara la. N bɛ se ka waati ɲuman fɔ i ye danni kama, walima ka daga sɔngɔw fɔ i ye.",
        french:
          "Dans les trois jours à venir, les pluies devraient être bonnes dans votre région. Je peux vous indiquer la meilleure période pour semer, ou vous donner les prix du marché.",
      },
      fr: {
        local:
          "Selon les prévisions, les prochaines pluies devraient être bonnes dans votre zone. Je peux vous indiquer la meilleure période pour semer, ou vous donner les prix du marché.",
        french:
          "Selon les prévisions, les prochaines pluies devraient être bonnes dans votre zone. Je peux vous indiquer la meilleure période pour semer, ou vous donner les prix du marché.",
      },
    },
  },

  // Suivi agriculture — prix marché
  {
    id: "agriculture_market",
    intent: "agriculture_market",
    parentIntent: "agriculture",
    sector: "Agriculture",
    keywords: {
      fr: ["prix", "vendre", "marché", "combien", "acheter", "acheteur"],
      mos: ["raagd", "koose"],
      wo: ["njëg", "jaay", "marse", "ñaata"],
      bm: ["sɔngɔ", "feere", "sugu", "joli"],
    },
    answers: {
      mos: {
        local:
          "Ki kilogaam-a yembr yaa CFA 350 rũndã raagd zĩiga. Baraar wakat sã n ta, ligdã na n paasa CFA 400 zĩig-zĩiga.",
        french:
          "Le kilo de mil est à 350 FCFA aujourd'hui sur le marché local. La semaine prochaine, il pourrait atteindre 400 FCFA.",
      },
      wo: {
        local:
          "Njëg dugub kilogaraam bi tey ci béréb bi mooy 350 CFA. Ci ayu-bés wu ñëw, mën na yékk ba 400 CFA.",
        french:
          "Le prix du kilo de mil aujourd'hui au marché local est de 350 FCFA. La semaine prochaine, il pourrait atteindre 400 FCFA.",
      },
      fr: {
        local:
          "Le kilo de mil est à 350 FCFA aujourd'hui sur le marché local. La semaine prochaine, il pourrait atteindre 400 FCFA.",
        french:
          "Le kilo de mil est à 350 FCFA aujourd'hui sur le marché local. La semaine prochaine, il pourrait atteindre 400 FCFA.",
      },
    },
  },

  // -----------------------------------------------------------
  //  Finance (racine)
  // -----------------------------------------------------------
  {
    id: "finance",
    intent: "finance",
    sector: "Inclusion financière",
    keywords: {
      fr: ["argent", "crédit", "prêt", "mobile money", "épargne", "banque"],
      mos: ["ligd", "ligdi", "sãnem", "kredi"],
      wo: ["xaalis", "alal", "ligëey", "banki"],
      bm: ["wari", "juru", "banki"],
    },
    answers: {
      mos: {
        local:
          "Yãmb tõe n paama ligd bilfu tɛka mobile money pʋgẽ. M tõe n wilg-y-la sore taab-taab, bɩ m togs-y ligd sẽn tɔe n paame.",
        french:
          "Vous pouvez obtenir un petit crédit directement via mobile money. Je peux vous guider étape par étape, ou vous indiquer le montant maximum disponible.",
      },
      wo: {
        local:
          "Man nga jënd xaalis ci sa mobile money ci saa si. Man na la wone yoon wi tam ba tam, walla ma la wax kañ nga mëna jënd.",
        french:
          "Vous pouvez obtenir un crédit via mobile money instantanément. Je peux vous guider étape par étape, ou vous dire le montant maximum.",
      },
      fr: {
        local:
          "Vous pouvez obtenir un petit crédit via mobile money. Je peux vous guider étape par étape, ou vous indiquer le montant maximum disponible.",
        french:
          "Vous pouvez obtenir un petit crédit via mobile money. Je peux vous guider étape par étape, ou vous indiquer le montant maximum disponible.",
      },
    },
  },

  // -----------------------------------------------------------
  //  Éducation (racine)
  // -----------------------------------------------------------
  {
    id: "education",
    intent: "education",
    sector: "Éducation",
    keywords: {
      fr: ["école", "étudier", "apprendre", "livre", "élève", "enfant"],
      mos: ["karengo", "biig", "kambã"],
      wo: ["daara", "jàng", "ndongo", "xale"],
      bm: ["lakɔli", "kalan", "kalanden", "den"],
    },
    answers: {
      mos: {
        local:
          "M tõe n zãms-y-la bũmb toɛy-toɛya : goamã, gʋlsg bɩ karengo. Yɩ-y bilg-m bũmb ninga y datame.",
        french:
          "Je peux vous apprendre différentes choses : la lecture, l'écriture ou d'autres savoirs. Précisez-moi ce que vous voulez apprendre.",
      },
      wo: {
        local:
          "Man na la jàngal ay yëf : jàng, bind, xayma. Waxal ma li nga bëgg jàng.",
        french:
          "Je peux vous apprendre plusieurs choses : lecture, écriture, calcul. Dites-moi ce que vous voulez apprendre.",
      },
      fr: {
        local:
          "Je peux vous apprendre différentes choses : la lecture, l'écriture ou d'autres savoirs. Précisez-moi ce que vous voulez apprendre.",
        french:
          "Je peux vous apprendre différentes choses : la lecture, l'écriture ou d'autres savoirs. Précisez-moi ce que vous voulez apprendre.",
      },
    },
  },

  // -----------------------------------------------------------
  //  Transverses (affirmation, remerciement)
  // -----------------------------------------------------------
  {
    id: "affirmative",
    intent: "affirmative",
    sector: "Général",
    keywords: {
      fr: ["oui", "d'accord", "ok", "vas-y", "montre-moi"],
      mos: ["nya", "ye", "yaa sõma"],
      wo: ["waaw", "nice", "dama"],
      bm: ["awo", "ɔhɔn"],
    },
    answers: {
      mos: {
        local:
          "Sõma! M na n togs-y bũmbã fãa taab-taab. Bilg-y m koɛɛgã sẽn yɩɩd yaa bũmb ninga.",
        french:
          "Très bien ! Je vous explique étape par étape. Précisez-moi maintenant ce qui vous intéresse le plus.",
      },
      wo: {
        local:
          "Baax na! Dama la wax loolu bépp tam ba tam. Wax ma leegi lan la nga gëna soxlaa.",
        french:
          "Très bien ! Je vais tout vous expliquer étape par étape. Dites-moi maintenant ce qui vous intéresse le plus.",
      },
      fr: {
        local: "Très bien ! Je vous explique étape par étape.",
        french: "Très bien ! Je vous explique étape par étape.",
      },
    },
  },
  {
    id: "thanks",
    intent: "thanks",
    sector: "Général",
    keywords: {
      fr: ["merci"],
      mos: ["barka", "beogo"],
      wo: ["jërëjëf", "jërëjef"],
      bm: ["i ni ce", "aw ni ce"],
    },
    answers: {
      mos: {
        local:
          "Barka wʋsgo! Sã n yaa yãmb ratame, sokr-y meng bũmb toɛy-toɛya. M bee ka.",
        french:
          "Avec plaisir ! N'hésitez pas à me poser d'autres questions, je suis là pour vous.",
      },
      wo: {
        local:
          "Jërëjëf! Bul jaaxle, laajteel ma yeneen yëf. Man ma nga fi ngir la dimbali.",
        french:
          "Avec plaisir ! N'hésitez pas à me poser d'autres questions, je suis là pour vous aider.",
      },
      fr: {
        local: "Avec plaisir ! N'hésitez pas à me poser d'autres questions.",
        french: "Avec plaisir ! N'hésitez pas à me poser d'autres questions.",
      },
    },
  },

  // -----------------------------------------------------------
  //  Fallback
  // -----------------------------------------------------------
  {
    id: "fallback",
    intent: "fallback",
    sector: "Général",
    keywords: {},
    answers: {
      mos: {
        local:
          "M wʋma yãmb koɛɛgã, la m pa reeg neer ye. Rɩk-y n bilg-y-l koɛɛgã. Sokr-y laafɩ, pʋʋgo, karengo bɩ ligd yɛlã.",
        french:
          "J'ai entendu votre voix mais je n'ai pas bien compris. Reformulez votre demande. Vous pouvez me parler de santé, d'agriculture, d'école ou d'argent.",
      },
      wo: {
        local:
          "Dégg naa sa baat waaye dégg-uma ko bu baax. Waxaat ko, man na la tontu. Man nga wax ci wér-gu-yaram, mbay, daara walla xaalis.",
        french:
          "J'ai entendu votre voix mais je n'ai pas bien compris. Reformulez, je vais y répondre. Vous pouvez me parler de santé, agriculture, école ou argent.",
      },
      fr: {
        local:
          "J'ai entendu votre voix mais je n'ai pas bien compris. Reformulez votre demande. Vous pouvez me parler de santé, d'agriculture, d'école ou d'argent.",
        french:
          "J'ai entendu votre voix mais je n'ai pas bien compris. Reformulez votre demande. Vous pouvez me parler de santé, d'agriculture, d'école ou d'argent.",
      },
    },
  },
];

// ============================================================
//  Matching multilingue
// ============================================================

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function contains(text: string, keyword: string): boolean {
  return normalize(text).includes(normalize(keyword));
}

/** Ordre de priorité pour la détection de langue (local avant français). */
const LANGUAGE_PRIORITY: LanguageCode[] = ["wo", "mos", "bm", "ff", "fr"];

export interface MatchResult {
  intent: LocalIntent;
  language: LanguageCode;
  matchedKeyword: string | null;
}

/**
 * Renvoie l'intent + la langue détectée à partir de la transcription.
 *
 * Algorithme :
 *  1. Si `previousIntent` fourni, on cherche d'abord un suivi (parentIntent === previousIntent).
 *  2. Sinon, on cherche parmi les intents racines.
 *  3. Pour chaque candidat, on scanne les mots-clés par langue dans l'ordre de priorité.
 *     La première langue matchée devient la langue de réponse.
 *  4. Si aucun match : fallback en langue par défaut (Mooré).
 */
export function matchIntent(
  text: string | undefined | null,
  previousIntent?: IntentId | null,
  previousLanguage?: LanguageCode | null
): MatchResult {
  const fallback = INTENTS.find((i) => i.intent === "fallback")!;

  // Texte vide → fallback poli (« je n'ai pas entendu »),
  // pas un greeting générique qui semble être une réponse par défaut.
  if (!text || !text.trim()) {
    return {
      intent: fallback,
      language: previousLanguage || DEFAULT_LANGUAGE,
      matchedKeyword: null,
    };
  }

  // 1. Chercher un suivi contextuel
  if (previousIntent) {
    const followUps = INTENTS.filter((i) => i.parentIntent === previousIntent);
    for (const candidate of followUps) {
      for (const lang of LANGUAGE_PRIORITY) {
        const keywords = candidate.keywords[lang] || [];
        for (const kw of keywords) {
          if (contains(text, kw)) {
            return {
              intent: candidate,
              // Un suivi hérite de la langue du parent si le mot-clé est en français
              // (pour rester cohérent avec la langue de la conversation)
              language: lang === "fr" && previousLanguage ? previousLanguage : lang,
              matchedKeyword: kw,
            };
          }
        }
      }
    }
  }

  // 2. Chercher un intent racine
  const roots = INTENTS.filter(
    (i) => !i.parentIntent && i.intent !== "fallback"
  );
  for (const candidate of roots) {
    for (const lang of LANGUAGE_PRIORITY) {
      const keywords = candidate.keywords[lang] || [];
      for (const kw of keywords) {
        if (contains(text, kw)) {
          return {
            intent: candidate,
            language: lang === "fr" ? previousLanguage || DEFAULT_LANGUAGE : lang,
            matchedKeyword: kw,
          };
        }
      }
    }
  }

  // 3. Fallback intelligent : on garde la langue précédente si connue,
  //    sinon on répond en français pour être compréhensible.
  return {
    intent: fallback,
    language: previousLanguage || "fr",
    matchedKeyword: null,
  };
}

/**
 * Résout le texte final (local + français) selon l'intent et la langue.
 * Fallback en cascade : langue demandée → Mooré → Français → fallback.
 */
export function resolveAnswer(
  intent: LocalIntent,
  language: LanguageCode
): { localText: string; frenchText: string; language: LanguageCode } {
  const answer =
    intent.answers[language] ??
    intent.answers[DEFAULT_LANGUAGE] ??
    intent.answers.fr;

  if (!answer) {
    return {
      localText: "…",
      frenchText: "Aucune réponse disponible pour cette combinaison.",
      language,
    };
  }

  const effectiveLanguage = intent.answers[language]
    ? language
    : intent.answers[DEFAULT_LANGUAGE]
      ? DEFAULT_LANGUAGE
      : "fr";

  return {
    localText: answer.local,
    frenchText: answer.french,
    language: effectiveLanguage,
  };
}

export function getTtsModel(language: LanguageCode): string {
  return LANGUAGES[language].ttsModel;
}
