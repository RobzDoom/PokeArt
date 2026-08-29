import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { SetCardFilter, type CardRow } from '../../components/set-card-filter';

async function getSetCards(setId: string): Promise<CardRow[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('Missing Supabase config for set details page');
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
      set:card_sets ( id, name, series )
    `)
    .eq('set_id', setId)
    .order('card_number', { ascending: true })
    .order('id', { ascending: true });

  if (error || !data) {
    console.log('Error fetching cards for set', setId, error);
    return [];
  }

  return (data as any[]).map((card) => ({
    id: card.id,
    name: card.name,
    image_url: card.image_url,
    rarity: card.rarity ?? 'Common',
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

async function getSetMeta(setId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return { name: setId, series: null };

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('card_sets')
    .select('id, name, series')
    .eq('id', setId)
    .maybeSingle();

  if (error || !data) {
    return { name: setId, series: null };
  }

  return data;
}

export default async function SetDetailPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = await params;
  const cards = await getSetCards(setId);
  const setMeta = await getSetMeta(setId);

  return (
    <div className="flex min-h-screen flex-col text-slate-100">
      <SiteHeader />

      <main className="mx-auto max-w-7xl flex-1 px-4 py-12 md:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-100/80">{setMeta.series ?? 'Set'}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">{setMeta.name}</h1>
          </div>

          <Link
            href="/sets"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/40 hover:bg-white/10"
          >
            ← Back to sets
          </Link>
        </div>

        <div className="mb-8 text-sm text-slate-300">{cards.length} cards in this set</div>

        {cards.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">
            No cards found for this set yet.
          </div>
        ) : (
          <SetCardFilter cards={cards} />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
