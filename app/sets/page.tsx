import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';

interface CardSet {
  id: string;
  name: string;
  series: string | null;
}

function getSetAccent(set: CardSet) {
  const haystack = `${set.series ?? ''} ${set.name}`.toLowerCase();

  if (haystack.includes('scarlet') || haystack.includes('violet') || haystack.includes('paldea')) {
    return {
      border: 'rgba(168, 85, 247, 0.52)',
      glow: 'rgba(168, 85, 247, 0.18)',
      badge: 'rgba(168, 85, 247, 0.12)',
      text: '#e9d5ff',
      panel: 'linear-gradient(135deg, rgba(88, 28, 135, 0.24), rgba(12, 18, 42, 0.85))',
    };
  }

  if (haystack.includes('sun') || haystack.includes('moon') || haystack.includes('alola')) {
    return {
      border: 'rgba(251, 191, 36, 0.52)',
      glow: 'rgba(251, 191, 36, 0.16)',
      badge: 'rgba(251, 191, 36, 0.12)',
      text: '#fef3c7',
      panel: 'linear-gradient(135deg, rgba(146, 64, 14, 0.22), rgba(12, 18, 42, 0.86))',
    };
  }

  if (haystack.includes('sword') || haystack.includes('shield') || haystack.includes('galar')) {
    return {
      border: 'rgba(96, 165, 250, 0.52)',
      glow: 'rgba(96, 165, 250, 0.18)',
      badge: 'rgba(96, 165, 250, 0.12)',
      text: '#dbeafe',
      panel: 'linear-gradient(135deg, rgba(30, 64, 175, 0.24), rgba(12, 18, 42, 0.86))',
    };
  }

  if (haystack.includes('black') || haystack.includes('white') || haystack.includes('unova')) {
    return {
      border: 'rgba(74, 222, 128, 0.48)',
      glow: 'rgba(74, 222, 128, 0.15)',
      badge: 'rgba(74, 222, 128, 0.12)',
      text: '#dcfce7',
      panel: 'linear-gradient(135deg, rgba(20, 83, 45, 0.22), rgba(12, 18, 42, 0.86))',
    };
  }

  return {
    border: 'rgba(125, 211, 252, 0.5)',
    glow: 'rgba(125, 211, 252, 0.16)',
    badge: 'rgba(125, 211, 252, 0.12)',
    text: '#dbeafe',
    panel: 'linear-gradient(135deg, rgba(8, 47, 73, 0.22), rgba(12, 18, 42, 0.86))',
  };
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
    <div className="min-h-screen text-slate-100">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-100/80">Browse</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">All sets</h1>
        </div>

        {sets.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">
            No sets are available yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sets.map((set) => {
              const accent = getSetAccent(set);

              return (
                <Link
                  key={set.id}
                  href={`/sets/${encodeURIComponent(set.id)}`}
                  className="group relative overflow-hidden rounded-3xl border p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:-translate-y-1"
                  style={{
                    background: accent.panel,
                    borderColor: accent.border,
                    boxShadow: `0 24px 60px rgba(0,0,0,0.2), 0 0 0 1px ${accent.border}`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `radial-gradient(circle at 20% 20%, ${accent.glow} 0%, transparent 50%)` }}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: accent.text }}>
                          {set.series ?? 'Set'}
                        </p>
                        <h2 className="mt-2 text-2xl font-black text-white">{set.name}</h2>
                      </div>
                      <span
                        className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                        style={{
                          borderColor: accent.border,
                          backgroundColor: accent.badge,
                          color: accent.text,
                        }}
                      >
                        Open
                      </span>
                    </div>

                    <div className="mt-6 h-1.5 rounded-full" style={{ background: `linear-gradient(90deg, ${accent.border}, transparent)` }} />

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-300">
                      <span>{set.card_count ?? 0} cards</span>
                      <span>View cards →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
