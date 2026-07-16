/**
 * Illustration hero d'AfriVoice AI :
 * silhouette humaine en buste qui « parle » — ondes vocales rayonnantes
 * dans les tons crépuscule. Rendu SVG 100 % scalable.
 */
export default function VoiceHero({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <svg
        viewBox="0 0 500 500"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="hero_bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4b942" stopOpacity="0.28" />
            <stop offset="55%" stopColor="#e88a4a" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#c8632a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero_sun" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fce8b6" />
            <stop offset="100%" stopColor="#e88a4a" />
          </linearGradient>
          <linearGradient id="hero_figure" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c1e17" />
            <stop offset="100%" stopColor="#0d0705" />
          </linearGradient>
          <linearGradient id="hero_wave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f2ad6b" stopOpacity="0" />
            <stop offset="50%" stopColor="#f2ad6b" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f2ad6b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Halo circulaire de fond */}
        <circle cx="250" cy="250" r="230" fill="url(#hero_bg)" />

        {/* Anneau extérieur fin */}
        <circle
          cx="250"
          cy="250"
          r="210"
          stroke="#f2ad6b"
          strokeOpacity="0.18"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="250"
          cy="250"
          r="180"
          stroke="#f2ad6b"
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeDasharray="2 6"
          fill="none"
        />

        {/* Soleil derrière la figure */}
        <circle cx="250" cy="230" r="95" fill="url(#hero_sun)" opacity="0.85" />

        {/* Ondes vocales rayonnantes à droite (voix qui sort) */}
        <g strokeLinecap="round" fill="none">
          <path
            d="M 340 250 Q 370 240 400 250"
            stroke="url(#hero_wave)"
            strokeWidth="3"
          />
          <path
            d="M 335 275 Q 380 260 425 275"
            stroke="url(#hero_wave)"
            strokeWidth="2.5"
            opacity="0.8"
          />
          <path
            d="M 340 225 Q 375 215 415 225"
            stroke="url(#hero_wave)"
            strokeWidth="2.5"
            opacity="0.8"
          />
          <path
            d="M 330 295 Q 385 280 445 300"
            stroke="url(#hero_wave)"
            strokeWidth="2"
            opacity="0.55"
          />
          <path
            d="M 335 205 Q 380 195 425 205"
            stroke="url(#hero_wave)"
            strokeWidth="2"
            opacity="0.55"
          />
          <path
            d="M 325 315 Q 395 305 465 325"
            stroke="url(#hero_wave)"
            strokeWidth="1.6"
            opacity="0.35"
          />
        </g>

        {/* Silhouette humaine (buste) — profil orienté vers la droite */}
        <g fill="url(#hero_figure)">
          {/* Épaules & torse */}
          <path d="M 130 500 L 130 400 Q 130 340 190 320 Q 220 315 245 320 Q 275 315 300 320 Q 340 335 340 400 L 340 500 Z" />
          {/* Cou */}
          <rect x="215" y="285" width="45" height="45" rx="6" />
          {/* Tête (profil légèrement vers la droite) */}
          <path
            d="M 200 280
               Q 195 235 210 210
               Q 225 185 260 185
               Q 300 185 310 230
               Q 315 260 305 285
               Q 300 300 285 305
               L 285 300
               Q 280 290 285 285
               Q 293 275 293 265
               Q 293 258 288 258
               L 285 260
               Q 280 245 265 245
               Q 250 250 245 260
               L 245 290
               Q 240 305 225 305
               Q 210 305 205 295
               Z"
          />
        </g>

        {/* Petit reflet chaud sur le visage */}
        <circle cx="285" cy="245" r="18" fill="#f4b942" opacity="0.18" />
      </svg>
    </div>
  );
}