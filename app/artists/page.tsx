import { createClient } from '@supabase/supabase-js';
import { ArtistSearch } from '../components/artist-search';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';

interface Artist {
  id: string;
  name_en: string;
  card_count?: number;
}

async function getArtists(): Promise<Artist[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('Missing Supabase config for artists page');
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('artists')
    .select('id, name_en, cards(count)')
    .order('name_en', { ascending: true });

  if (error || !data) {
    console.log('Error fetching artist list', error);
    return [];
  }

  return (data as any[]).map((artist) => ({
    id: artist.id,
    name_en: artist.name_en,
    card_count: Array.isArray(artist.cards)
      ? Number(artist.cards[0]?.count ?? 0)
      : 0,
  }));
}

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="flex min-h-screen flex-col text-slate-100">
      <SiteHeader />

      <main className="mx-auto max-w-7xl flex-1 px-4 py-12 md:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-100/80">Featured talent</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">All artists</h1>
        </div>

        {artists.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">
            No artists are available yet.
          </div>
        ) : (
          <ArtistSearch artists={artists} />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
