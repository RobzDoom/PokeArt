/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const { loadEnvConfig } = require('@next/env');
const { createClient } = require('@supabase/supabase-js');

const projectRoot = path.resolve(__dirname, '..');
loadEnvConfig(projectRoot);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SET_ID = process.env.SET_ID || 'sv03.5';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function normalizeArtistName(name) {
  return (name || '').trim();
}

async function getOrCreateArtist(artistName) {
  const name = normalizeArtistName(artistName);
  if (!name || name.toLowerCase() === 'unknown') {
    return null;
  }

  let { data: existingArtist, error: lookupError } = await supabase
    .from('artists')
    .select('id')
    .eq('name_en', name)
    .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (existingArtist) {
    return existingArtist.id;
  }

  const { data: newArtist, error: insertError } = await supabase
    .from('artists')
    .insert({ name_en: name })
    .select('id')
    .single();

  if (insertError) {
    throw insertError;
  }

  return newArtist.id;
}

async function fixArtistsForSet(setId) {
  console.log(`🔎 Looking for cards in set ${setId} that are missing or have unknown artists...`);

  const { data: cards, error: cardsError } = await supabase
    .from('cards')
    .select('id, name, artist_id')
    .eq('set_id', setId);

  if (cardsError) {
    throw cardsError;
  }

  if (!cards || cards.length === 0) {
    console.log('No cards found for this set.');
    return;
  }

  let fixedCount = 0;
  let skippedCount = 0;

  for (const card of cards) {
    let shouldFix = false;

    if (!card.artist_id) {
      shouldFix = true;
    } else {
      const { data: artist, error: artistError } = await supabase
        .from('artists')
        .select('name_en')
        .eq('id', card.artist_id)
        .maybeSingle();

      if (artistError) {
        throw artistError;
      }

      if (!artist || normalizeArtistName(artist.name_en).toLowerCase() === 'unknown') {
        shouldFix = true;
      }
    }

    if (!shouldFix) {
      skippedCount += 1;
      continue;
    }

    const response = await fetch(`https://api.tcgdex.net/v2/en/cards/${card.id}`);
    if (!response.ok) {
      console.log(`⚠️ Could not fetch card ${card.id} (${card.name}) from TCGdex.`);
      continue;
    }

    const cardData = await response.json();
    const illustrator = normalizeArtistName(cardData.illustrator);

    if (!illustrator || illustrator.toLowerCase() === 'unknown') {
      console.log(`⚠️ Skipping ${card.name} because TCGdex has no illustrator.`);
      continue;
    }

    const artistId = await getOrCreateArtist(illustrator);
    if (!artistId) {
      console.log(`⚠️ No artist ID created for ${card.name}.`);
      continue;
    }

    const { error: updateError } = await supabase
      .from('cards')
      .update({ artist_id: artistId })
      .eq('id', card.id);

    if (updateError) {
      console.error(`❌ Failed to update ${card.name}:`, updateError.message);
      continue;
    }

    console.log(`✅ Updated ${card.name} -> ${illustrator}`);
    fixedCount += 1;
  }

  console.log(`
Finished artist repair for ${setId}
- fixed: ${fixedCount}
- already valid: ${skippedCount}
`);
}

async function main() {
  try {
    await fixArtistsForSet(SET_ID);
  } catch (error) {
    console.error('💥 Artist repair failed:', error);
    process.exit(1);
  }
}

main();
