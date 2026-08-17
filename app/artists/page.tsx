import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
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
    <div className="min-h-screen text-slate-100">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-100/80">Featured talent</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">All artists</h1>
        </div>

        {artists.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">
            No artists are available yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${encodeURIComponent(artist.id)}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/40"
              >
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-100/70">Artist</p>
                      <h2 className="mt-2 text-2xl font-black text-white">{artist.name_en}</h2>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-200">
                      {artist.card_count ?? 0} cards
                    </span>
                  </div>

                  <div className="mt-6 h-1.5 rounded-full bg-gradient-to-r from-cyan-400/80 via-blue-400/60 to-transparent" />

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-300">
                    <span>Total cards worked: {artist.card_count ?? 0}</span>
                    <span>View profile →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
