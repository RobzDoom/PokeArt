import { createClient } from '@supabase/supabase-js';
import GalleryClient, { type Card } from './components/gallery-client';

async function getCardsForSet(setId: string): Promise<Card[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('cards')
    .select(`
      id,
      name,
      rarity,
      image_url,
      type,
      artist:artists ( name_en )
    `)
    .eq('set_id', setId)
    .order('id', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((card: any) => ({
    id: card.id,
    name: card.name,
    rarity: card.rarity ?? 'Common',
    image_url: card.image_url,
    type: card.type,
    artist_name: Array.isArray(card.artist)
      ? card.artist[0]?.name_en ?? 'Unknown Artist'
      : card.artist?.name_en ?? 'Unknown Artist',
  }));
}

export default async function Home() {
  const cards = await getCardsForSet('sv03.5');
  return <GalleryClient initialCards={cards} />;
}