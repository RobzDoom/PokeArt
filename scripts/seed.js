const { createClient } = require('@supabase/supabase-js');

// Pulls automatically from your secure local .env.local file
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing Supabase environment variables in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function seedPokemonData() {
  console.log('🚀 Starting data ingestion from TCGdex...');

  try {
    // Testing with a modern, beautifully illustrated set: Scarlet & Violet Base ('sv1')
    const setId = 'sv3pt5'; 
    const response = await fetch(`https://api.tcgdex.net/v2/en/sets/${setId}`);
    
    if (!response.ok) throw new Error(`TCGdex API error: ${response.statusText}`);
    
    const setData = await response.json();
    const cardsArray = setData.cards; 

    // 1. Sync the Set into card_sets first
    await supabase.from('card_sets').upsert({
      id: setData.id,
      name: setData.name,
      series: 'Scarlet & Violet',
    });

    console.log(`📦 Synced set: ${setData.name}. Processing ${cardsArray.length} cards...`);

    // 2. Loop through every card to extract illustrator profiles
    for (const basicCard of cardsArray) {
      const cardResponse = await fetch(`https://api.tcgdex.net/v2/en/cards/${basicCard.id}`);
      if (!cardResponse.ok) continue;
      
      const cardData = await cardResponse.json();
      const illustratorName = cardData.illustrator;

      if (illustratorName) {
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
            console.error(`❌ Error inserting artist ${illustratorName}:`, artistErr);
            continue;
          }
          artist = newArtist;
        }

        // 3. Now insert the card, mapping the type column and artist foreign key
        const { error: cardErr } = await supabase.from('cards').upsert({
          id: cardData.id,
          name: cardData.name,
          rarity: cardData.rarity || 'Common',
          image_url: cardData.image ? `${cardData.image}/high.png` : null,
          artist_id: artist.id,
          set_id: setData.id,
          type: cardData.types ? cardData.types[0] : null
        });

        if (cardErr) {
          console.error(`❌ Error inserting card ${cardData.name}:`, cardErr);
        } else {
          console.log(`✅ Synced: ${cardData.name} (${illustratorName})`);
        }
      }
    }

    console.log('🎉 Seeding completed successfully!');

  } catch (error) {
    console.error('💥 Seeding crashed:', error);
  }
}

seedPokemonData();