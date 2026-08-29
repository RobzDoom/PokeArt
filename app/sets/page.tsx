import { createClient } from '@supabase/supabase-js';
import { SetSearch } from '../components/set-search';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';

interface CardSet {
  id: string;
  name: string;
  series: string | null;
  card_count?: number;
}

async function getSets(): Promise<Array<CardSet & { card_count?: number }>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('Missing Supabase config for sets page');
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('card_sets')
    .select('id, name, series, cards(count)')
    .order('name', { ascending: true });

  if (error || !data) {
    console.log('Error fetching set list', error);
    return [];
  }

  return (data as any[]).map((set) => ({
    id: set.id,
    name: set.name,
    series: set.series,
    card_count: Array.isArray(set.cards)
      ? Number(set.cards[0]?.count ?? 0)
      : 0,
  }));
}

export default async function SetsPage() {
  const sets = await getSets();

  return (
    <div className="flex min-h-screen flex-col text-slate-100">
      <SiteHeader />

      <main className="mx-auto max-w-7xl flex-1 px-4 py-12 md:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-100/80">Browse</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">All sets</h1>
        </div>

        {sets.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">
            No sets are available yet.
          </div>
        ) : (
          <SetSearch sets={sets} />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
