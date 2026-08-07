/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const { loadEnvConfig } = require('@next/env');
const { createClient } = require('@supabase/supabase-js');

// Synchronize environment variables using Next.js config loader
const projectRoot = path.resolve(__dirname, '..');
loadEnvConfig(projectRoot);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function seedAllCardsOptimized() {
  console.log('🚀 Starting optimized set-by-set card ingestion...');

  try {
    // 1. Read the fully populated card_sets table
    const { data: sets, error: setsErr } = await supabase.from('card_sets').select('id, name');
    if (setsErr) throw setsErr;

    console.log(`📂 Processing cards for ${sets.length} total sets sequentially...`);

    for (const currentSet of sets) {
      console.log(`\n📥 Fetching full details for set: ${currentSet.name} (${currentSet.id})...`);
      
      const url = `https://api.tcgdex.net/v2/en/sets/${currentSet.id}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.log(`❌ API Rejected [Status ${response.status}] for set ID: ${currentSet.id} (URL: ${url})`);
          continue;
        }

        const setData = await response.json();
        const cardsArray = setData.cards;

        if (!cardsArray || cardsArray.length === 0) {
          console.log(`⚠️ No cards found in set ${currentSet.name}.`);
          continue;
        }

        console.log(`📸 Found ${cardsArray.length} cards. Syncing artists and card records...`);

        // 2. Process every card inside this set
        for (const card of cardsArray) {
          // Fallback gracefully if the API hasn't mapped an illustrator for this card yet
          const illustratorName = card.illustrator || 'Unknown';

          // Find or create the artist record
          let { data: artist } = await supabase
            .from('artists')
            .select('id')
            .eq('name_en', illustratorName)
            .maybeSingle();

          if (!artist) {
            const { data: newArtist, error: artistErr } = await supabase
              .from('artists')
              .insert({ name_en: illustratorName })
              .select('id')
              .single();
            
            if (artistErr) {
              console.error(`❌ Error creating artist [${illustratorName}]:`, artistErr.message);
              continue;
            }
            artist = newArtist;
          }

          // Upsert the card with image URLs and mapped artist IDs
          const { error: cardErr } = await supabase.from('cards').upsert({
            id: card.id,
            name: card.name,
            image_url: card.image ? `${card.image}/high.webp` : null,
            artist_id: artist.id,
            set_id: currentSet.id,
            rarity: card.rarity || 'Common'
          });

          if (cardErr) {
            console.error(`❌ Database rejected card [${card.name}] in set [${currentSet.id}]:`, cardErr.message);
          }
        }

        console.log(`✅ Finished processing set: ${currentSet.name}`);
      } catch (fetchErr) {
        console.error(`💥 Network/Timeout error fetching set ${currentSet.id}:`, fetchErr.message);
      }

      // Brief sleep interval to keep connection lanes completely clear
      await delay(200);
    }

    console.log('\n🎉 Global card database sync sequence completed!');
  } catch (error) {
    console.error('💥 Card seeding crashed:', error);
  }
}

seedAllCardsOptimized();