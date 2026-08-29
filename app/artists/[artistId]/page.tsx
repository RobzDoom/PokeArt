import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { ArtistCard, type ArtistCardData } from '../../components/artist-card';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

async function getArtistCards(artistId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('Missing Supabase config for artist details page');
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('cards')
    .select('id, name, rarity, image_url, type, set_id, artist:artists ( name_en )')
    .eq('artist_id', artistId)
    .order('id', { ascending: true });

  if (error || !data) {
    console.log('Error fetching cards for artist', artistId, error);
    return [];
  }

  return (data as any[]).map((card) => ({
    id: card.id,
    name: card.name,
    image_url: card.image_url,
    rarity: card.rarity ?? 'Common',
    type: card.type,
    set_id: card.set_id,
    artist_name: Array.isArray(card.artist)
      ? card.artist[0]?.name_en ?? 'Unknown Artist'
      : card.artist?.name_en ?? 'Unknown Artist',
  }));
}

async function getArtistMeta(artistId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { name_en: 'Artist' };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('artists')
    .select('id, name_en')
    .eq('id', artistId)
    .maybeSingle();

  if (error || !data) {
    return { name_en: 'Artist' };
  }

  return data;
}

export default async function ArtistDetailPage({ params }: { params: Promise<{ artistId: string }> }) {
  const { artistId } = await params;
  const artist = await getArtistMeta(artistId);
  const cards = await getArtistCards(artistId);

  return (
    <div className="flex min-h-screen flex-col text-slate-100">
      <SiteHeader />

      <main className="mx-auto max-w-7xl flex-1 px-4 py-12 md:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-100/80">Artist</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">{artist.name_en}</h1>
          </div>

          <Link
            href="/artists"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/40 hover:bg-white/10"
          >
            ← Back to artists
          </Link>
        </div>

        <div className="mb-8 text-sm text-slate-300">{cards.length} cards by this artist</div>

        {cards.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">
            No cards found for this artist yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <ArtistCard
                key={card.id}
                card={card as ArtistCardData}
              />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
