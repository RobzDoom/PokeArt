'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

interface CardSet {
  id: string;
  name: string;
  series: string | null;
  card_count?: number;
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

export function SetSearch({ sets }: { sets: CardSet[] }) {
  const [search, setSearch] = useState('');

  const filteredSets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sets.filter((set) => {
      if (!query) {
        return true;
      }

      const haystack = `${set.name} ${set.series ?? ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [search, sets]);

  return (
    <>
      <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <label htmlFor="set-search" className="sr-only">
              Search sets
            </label>
            <input
              id="set-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search sets by name or series"
              className="w-full rounded-full border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300/60"
            />
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span>{filteredSets.length} visible</span>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white transition hover:border-cyan-300/40 hover:bg-white/10"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredSets.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">
          No sets match your search.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredSets.map((set) => {
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
    </>
  );
}
