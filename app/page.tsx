import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { HomePage, type Card } from './components/home-page';

async function getCardsForSet(setId: string): Promise<Card[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('Missing Supabase config for server page');
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
      card_number,
      artist:artists ( name_en ),
      set:card_sets ( name, series )
    `)
    .eq('set_id', setId)
    .order('id', { ascending: true });

  if (error || !data) {
    console.log('Supabase query error for set', setId, error);
    return [];
  }

  return data.map((card: any) => ({
    id: card.id,
    name: card.name,
    rarity: card.rarity ?? 'Common',
    image_url: card.image_url,
    type: card.type,
    card_number: card.card_number,
    artist_name: Array.isArray(card.artist)
      ? card.artist[0]?.name_en ?? 'Unknown Artist'
      : card.artist?.name_en ?? 'Unknown Artist',
    set_name: Array.isArray(card.set)
      ? card.set[0]?.name ?? null
      : card.set?.name ?? null,
    set_series: Array.isArray(card.set)
      ? card.set[0]?.series ?? null
      : card.set?.series ?? null,
  }));
}

function shuffleCards(cards: Card[]) {
  return [...cards].sort(() => Math.random() - 0.5);
}

export default async function Home() {
  noStore();
  const cards = await getCardsForSet('sv03.5');
  const shuffledCards = shuffleCards(cards);
  const ultraRareCards = cards.filter((card) => card.rarity.toLowerCase().includes('ultra rare'));
  const featuredCard = shuffleCards(ultraRareCards)[0] ?? null;

  return <HomePage cards={shuffledCards} featuredCard={featuredCard} />;
}