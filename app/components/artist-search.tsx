'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

interface Artist {
  id: string;
  name_en: string;
  card_count?: number;
}

export function ArtistSearch({ artists }: { artists: Artist[] }) {
  const [search, setSearch] = useState('');

  const filteredArtists = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return artists;
    }

    return artists.filter((artist) => artist.name_en.toLowerCase().includes(query));
  }, [artists, search]);

  return (
    <>
      <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <label htmlFor="artist-search" className="sr-only">
              Search artists
            </label>
            <input
              id="artist-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search artists by name"
              className="w-full rounded-full border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300/60"
            />
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span>{filteredArtists.length} visible</span>
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

      {filteredArtists.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">
          No artists match your search.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredArtists.map((artist) => (
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
    </>
  );
}
