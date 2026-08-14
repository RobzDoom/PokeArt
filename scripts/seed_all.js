/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const { loadEnvConfig } = require('@next/env');
const { createClient } = require('@supabase/supabase-js');

const projectRoot = path.resolve(__dirname, '..');
loadEnvConfig(projectRoot);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getOrCreateArtist(illustratorName) {
  const normalized = typeof illustratorName === 'string' ? illustratorName.trim() : '';

  if (!normalized || normalized.toLowerCase() === 'unknown') {
    return null;
  }

  let { data: artist, error: artistLookupError } = await supabase
    .from('artists')
    .select('id')
    .eq('name_en', normalized)
    .maybeSingle();

  if (artistLookupError) {
    throw artistLookupError;
  }

  if (artist) {
    return artist.id;
  }

  const { data: newArtist, error: artistInsertError } = await supabase
    .from('artists')
    .insert({ name_en: normalized })
    .select('id')
    .single();

  if (artistInsertError) {
    throw artistInsertError;
  }

  return newArtist.id;
}

async function seedAllCardsOptimized() {
  console.log('🚀 Starting full card ingestion for all sets...');

  try {
    const { data: sets, error: setsErr } = await supabase.from('card_sets').select('id, name');
    if (setsErr) throw setsErr;

    if (!sets || sets.length === 0) {
      console.log('No sets found in card_sets table. Fetching all set metadata from TCGdex...');

      const setListResponse = await fetch('https://api.tcgdex.net/v2/en/sets');
      if (!setListResponse.ok) {
        throw new Error(`TCGdex set list failed: ${setListResponse.statusText}`);
      }

      const setList = await setListResponse.json();
      for (const set of setList) {
        await supabase.from('card_sets').upsert({
          id: set.id,
          name: set.name,
          series: set.series || null,
        });
      }
    }

    const { data: refreshedSets, error: refreshedSetsErr } = await supabase.from('card_sets').select('id, name');
    if (refreshedSetsErr) throw refreshedSetsErr;

    console.log(`📂 Processing cards for ${refreshedSets.length} total sets sequentially...`);

    for (const currentSet of refreshedSets) {
      console.log(`\n📥 Fetching full details for set: ${currentSet.name} (${currentSet.id})...`);

      const url = `https://api.tcgdex.net/v2/en/sets/${currentSet.id}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.log(`❌ API Rejected [Status ${response.status}] for set ID: ${currentSet.id}`);
          continue;
        }

        const setData = await response.json();
        const cardsSummary = Array.isArray(setData.cards) ? setData.cards : [];

        if (!cardsSummary.length) {
          console.log(`⚠️ No cards found in set ${currentSet.name}.`);
          continue;
        }

        console.log(`📸 Found ${cardsSummary.length} cards. Fetching individual card details...`);

        for (const cardSummary of cardsSummary) {
          const cardRes = await fetch(`https://api.tcgdex.net/v2/en/cards/${cardSummary.id}`);
          if (!cardRes.ok) continue;

          const card = await cardRes.json();
          const illustratorName = typeof card.illustrator === 'string' ? card.illustrator.trim() : '';
          const rarity = typeof card.rarity === 'string' && card.rarity.trim() ? card.rarity.trim() : null;
          const typeValue = Array.isArray(card.types) && card.types.length ? card.types[0] : null;
          const imageUrl = card.image ? `${card.image}/high.webp` : null;
          const artistId = await getOrCreateArtist(illustratorName);

          const { error: cardErr } = await supabase.from('cards').upsert({
            id: card.id,
            name: card.name || cardSummary.name || 'Unknown Card',
            image_url: imageUrl,
            artist_id: artistId,
            set_id: currentSet.id,
            rarity,
            type: typeValue,
          }, { onConflict: 'id' });

          if (cardErr) {
            console.error(`❌ Database rejected card [${card.name || cardSummary.name}] in set [${currentSet.id}]:`, cardErr.message);
          }

          await delay(35);
        }

        console.log(`✅ Finished processing set: ${currentSet.name}`);
      } catch (fetchErr) {
        console.error(`💥 Network/Timeout error fetching set ${currentSet.id}:`, fetchErr.message);
      }

      await delay(200);
    }

    console.log('\n🎉 Global card database sync sequence completed!');
  } catch (error) {
    console.error('💥 Card seeding crashed:', error);
  }
}

seedAllCardsOptimized();