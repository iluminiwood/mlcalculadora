export default function CoinLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer coin ring */}
      <circle cx="50" cy="50" r="48" fill="#1A1916" stroke="#1A1916" strokeWidth="1"/>
      <circle cx="50" cy="50" r="45" fill="#1A1916"/>
      {/* Dotted inner border */}
      <circle cx="50" cy="50" r="41" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 3"/>
      {/* Head silhouette - Roman warrior facing left */}
      {/* Neck */}
      <path d="M48 78 L44 72 Q43 68 45 65 L55 65 Q57 68 56 72 L52 78 Z" fill="#fff"/>
      {/* Head */}
      <ellipse cx="50" cy="52" rx="13" ry="15" fill="#fff"/>
      {/* Helmet dome */}
      <path d="M37 52 Q37 33 50 32 Q63 33 63 52 L60 50 Q58 38 50 37 Q42 38 40 50 Z" fill="#fff"/>
      {/* Crest plume - flowing back */}
      <path d="M50 32 Q55 28 62 22 Q68 16 72 10 Q70 14 67 19 Q63 25 60 30 Q57 34 55 36 Q52 34 50 32Z" fill="#fff"/>
      <path d="M50 32 Q54 27 60 21 Q65 15 70 8 Q67 13 63 18 Q59 24 56 29 Q53 32 51 33Z" fill="#1A1916" opacity="0.3"/>
      {/* Cheek guard */}
      <path d="M37 52 Q35 56 36 60 Q38 63 41 63 Q43 61 43 58 L40 50 Z" fill="#fff"/>
      <path d="M63 52 Q65 56 64 60 Q62 63 59 63 Q57 61 57 58 L60 50 Z" fill="#fff"/>
      {/* Face details - eye */}
      <ellipse cx="44" cy="50" rx="2" ry="1.5" fill="#1A1916"/>
      {/* Nose bridge */}
      <path d="M50 45 Q52 50 51 55" stroke="#1A1916" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Lips hint */}
      <path d="M46 61 Q50 63 54 61" stroke="#1A1916" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Chin line */}
      <path d="M41 65 Q50 70 59 65" stroke="#1A1916" strokeWidth=".5" fill="none"/>
      {/* Laurel on helmet */}
      <path d="M38 42 Q36 38 39 36 Q41 39 40 42" fill="#fff" opacity=".7"/>
      <path d="M41 39 Q40 35 43 33 Q44 37 43 40" fill="#fff" opacity=".7"/>
      <path d="M44 37 Q44 33 47 32 Q47 36 46 39" fill="#fff" opacity=".6"/>
    </svg>
  )
}
