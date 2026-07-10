export type CardTheme = {
  accent: string;
  accentSoft: string;
  accentGlow: string;
  border: string;
  surface: string;
  label: string;
};

const defaultTheme: CardTheme = {
  accent: '#ffd54a',
  accentSoft: 'rgba(255, 213, 74, 0.12)',
  accentGlow: 'rgba(255, 213, 74, 0.28)',
  border: 'rgba(255, 255, 255, 0.10)',
  surface: 'rgba(10, 16, 35, 0.72)',
  label: 'Neutral',
};

export function getCardTheme(rarity: string): CardTheme {
  const normalized = rarity.toLowerCase();

  if (normalized.includes('special illustration rare')) {
    return {
      accent: '#ff6bd6',
      accentSoft: 'rgba(255, 107, 214, 0.14)',
      accentGlow: 'rgba(255, 107, 214, 0.34)',
      border: 'rgba(255, 107, 214, 0.28)',
      surface: 'rgba(22, 10, 35, 0.74)',
      label: 'Special Illustration Rare',
    };
  }

  if (normalized.includes('illustration rare')) {
    return {
      accent: '#a78bfa',
      accentSoft: 'rgba(167, 139, 250, 0.14)',
      accentGlow: 'rgba(167, 139, 250, 0.32)',
      border: 'rgba(167, 139, 250, 0.24)',
      surface: 'rgba(18, 12, 38, 0.74)',
      label: 'Illustration Rare',
    };
  }

  if (normalized.includes('secret rare')) {
    return {
      accent: '#7dd3fc',
      accentSoft: 'rgba(125, 211, 252, 0.14)',
      accentGlow: 'rgba(125, 211, 252, 0.32)',
      border: 'rgba(125, 211, 252, 0.24)',
      surface: 'rgba(9, 22, 32, 0.76)',
      label: 'Secret Rare',
    };
  }

  if (normalized.includes('double rare') || normalized.includes('ultra rare')) {
    return {
      accent: '#ffd54a',
      accentSoft: 'rgba(255, 213, 74, 0.14)',
      accentGlow: 'rgba(255, 213, 74, 0.34)',
      border: 'rgba(255, 213, 74, 0.26)',
      surface: 'rgba(22, 18, 9, 0.74)',
      label: rarity,
    };
  }

  if (normalized.includes('rare')) {
    return {
      accent: '#64d2ff',
      accentSoft: 'rgba(100, 210, 255, 0.14)',
      accentGlow: 'rgba(100, 210, 255, 0.30)',
      border: 'rgba(100, 210, 255, 0.24)',
      surface: 'rgba(9, 16, 33, 0.76)',
      label: rarity,
    };
  }

  if (normalized.includes('uncommon')) {
    return {
      accent: '#7bff8f',
      accentSoft: 'rgba(123, 255, 143, 0.14)',
      accentGlow: 'rgba(123, 255, 143, 0.30)',
      border: 'rgba(123, 255, 143, 0.22)',
      surface: 'rgba(8, 24, 18, 0.74)',
      label: rarity,
    };
  }

  if (normalized.includes('common')) {
    return {
      accent: '#cbd5e1',
      accentSoft: 'rgba(203, 213, 225, 0.10)',
      accentGlow: 'rgba(203, 213, 225, 0.18)',
      border: 'rgba(203, 213, 225, 0.12)',
      surface: 'rgba(9, 13, 27, 0.72)',
      label: rarity,
    };
  }

  if (normalized.includes('ace spec')) {
    return {
      accent: '#ff6b6b',
      accentSoft: 'rgba(255, 107, 107, 0.14)',
      accentGlow: 'rgba(255, 107, 107, 0.32)',
      border: 'rgba(255, 107, 107, 0.26)',
      surface: 'rgba(36, 11, 11, 0.74)',
      label: rarity,
    };
  }

  return defaultTheme;
}