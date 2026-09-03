/**
 * Fallback natural language card filter parser.
 * Interprets prompts like "leaf type", "rare fire cards", etc.
 * without requiring an API key or external service.
 */

export interface FilterResult {
  search: string;
  type: string | null;
  rarity: string | null;
  raw: string;
}

/**
 * Common Pokémon type aliases and keywords
 */
const TYPE_KEYWORDS: Record<string, string> = {
  // Type names
  leaf: 'Grass',
  grass: 'Grass',
  fire: 'Fire',
  flame: 'Fire',
  water: 'Water',
  aqua: 'Water',
  electric: 'Lightning',
  lightning: 'Lightning',
  psychic: 'Psychic',
  mental: 'Psychic',
  fighting: 'Fighting',
  combat: 'Fighting',
  dark: 'Dark',
  shadow: 'Dark',
  metal: 'Metal',
  steel: 'Steel',
  fairy: 'Fairy',
  dragon: 'Dragon',
  ice: 'Ice',
  normal: 'Normal',
  flying: 'Flying',
  poison: 'Poison',
  ground: 'Ground',
  earth: 'Ground',
  rock: 'Rock',
  stone: 'Rock',
  bug: 'Bug',
  insect: 'Bug',
  
  // Color-based aliases
  red: 'Fire',
  blue: 'Water',
  yellow: 'Lightning',
  green: 'Grass',
  purple: 'Psychic',
  brown: 'Fighting',
  black: 'Dark',
  gray: 'Steel',
  grey: 'Steel',
  white: 'Normal',
  pink: 'Fairy',
  orange: 'Fire',
  cyan: 'Water',
  gold: 'Lightning',
  silver: 'Steel',
  bronze: 'Rock',
  light: 'Lightning',
};

/**
 * Common rarity keywords
 */
const RARITY_KEYWORDS: Record<string, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  holo: 'Rare Holo',
  holofoil: 'Rare Holo',
  holographic: 'Rare Holo',
  ex: 'Rare Holo EX',
  vmax: 'Rare Holo VMAX',
  vstar: 'Rare Holo V-Star',
  v: 'Rare Holo V',
};

/**
 * Parse a natural language filter prompt into structured filter parameters.
 *
 * Examples:
 * - "leaf type" → { type: 'Grass', search: '', ... }
 * - "rare fire cards" → { type: 'Fire', rarity: 'Rare', search: '', ... }
 * - "show me only electric" → { type: 'Electric', search: '', ... }
 * - "dark type rare" → { type: 'Dark', rarity: 'Rare', search: '', ... }
 */
export function parseNaturalLanguageFilter(prompt: string): FilterResult {
  const query = prompt.toLowerCase().trim();
  let detectedType: string | null = null;
  let detectedRarity: string | null = null;
  let searchTerm = '';

  // Try to match type keywords
  for (const [keyword, typeValue] of Object.entries(TYPE_KEYWORDS)) {
    if (query.includes(keyword)) {
      detectedType = typeValue;
      break;
    }
  }

  // Try to match rarity keywords
  for (const [keyword, rarityValue] of Object.entries(RARITY_KEYWORDS)) {
    if (query.includes(keyword)) {
      detectedRarity = rarityValue;
      break;
    }
  }

  // If we matched a type, check if there's a card name substring remaining
  if (detectedType) {
    // Remove type/rarity keywords from the query to see what's left
    let remaining = query;
    for (const keyword of Object.keys(TYPE_KEYWORDS)) {
      remaining = remaining.replace(keyword, '');
    }
    for (const keyword of Object.keys(RARITY_KEYWORDS)) {
      remaining = remaining.replace(keyword, '');
    }
    // Remove common filter words
    remaining = remaining
      .replace(/show\s+me/g, '')
      .replace(/only/g, '')
      .replace(/type/g, '')
      .replace(/cards?/g, '')
      .replace(/from/g, '')
      .trim()
      .replace(/\s+/g, ' ');

    searchTerm = remaining;
  } else {
    // No type detected; treat the whole query as a search term
    searchTerm = query.replace(/\btype\b/g, '').replace(/\bcards?\b/g, '').trim();
  }

  return {
    search: searchTerm,
    type: detectedType,
    rarity: detectedRarity,
    raw: prompt,
  };
}
