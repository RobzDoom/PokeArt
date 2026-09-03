'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import CardLightbox, { type CardLightboxCard } from './card-lightbox';
import { getCardTheme } from './card-theme';
import { parseNaturalLanguageFilter } from '../lib/fallback-card-filter';

export interface CardRow {
  id: string;
  name: string;
  image_url: string | null;
  rarity: string | null;
  type: string | null;
  artist_name?: string | null;
  card_number?: number | string | null;
  set_name?: string | null;
  set_series?: string | null;
}

interface SetCardFilterProps {
  cards: CardRow[];
}

export function SetCardFilter({ cards }: SetCardFilterProps) {
  const [search, setSearch] = useState('');
  const [rarity, setRarity] = useState('All');
  const [type, setType] = useState('All');
  const [selectedCard, setSelectedCard] = useState<CardLightboxCard | null>(null);
  const [prompt, setPrompt] = useState('');

  const rarityOptions = useMemo(() => {
    const values = new Set(cards.map((card) => card.rarity).filter(Boolean) as string[]);
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [cards]);

  const typeOptions = useMemo(() => {
    const values = new Set(cards.map((card) => card.type).filter(Boolean) as string[]);
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [cards]);

  const handlePromptChange = (value: string) => {
    setPrompt(value);
  };

  const handleSearch = () => {
    if (!prompt.trim()) {
      // Clear all filters if prompt is empty
      setType('All');
      setRarity('All');
      setSearch('');
      return;
    }

    // Parse the natural language prompt
    const filter = parseNaturalLanguageFilter(prompt);

    // Apply parsed filters
    if (filter.type) {
      setType(filter.type);
    } else {
      setType('All');
    }

    if (filter.rarity) {
      setRarity(filter.rarity);
    } else {
      setRarity('All');
    }

    if (filter.search) {
      setSearch(filter.search);
    } else {
      setSearch('');
    }
  };

  const handleResetFilters = () => {
    setPrompt('');
    setSearch('');
    setRarity('All');
    setType('All');
  };

  const filteredCards = useMemo(() => {
    const query = search.trim().toLowerCase();

    return cards.filter((card) => {
      const matchesSearch = !query || card.name.toLowerCase().includes(query);
      const matchesRarity = rarity === 'All' || (card.rarity ?? 'Common') === rarity;
      const matchesType = type === 'All' || (card.type ?? '').toLowerCase() === type.toLowerCase();

      return matchesSearch && matchesRarity && matchesType;
    });
  }, [cards, search, rarity, type]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="prompt-filter" className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100/60">
              Try asking naturally
            </label>
            <div className="flex gap-3">
              <input
                id="prompt-filter"
                value={prompt}
                onChange={(event) => handlePromptChange(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
                placeholder="e.g., 'leaf type', 'rare fire cards', 'electric only'"
                className="flex-1 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none ring-0 transition focus:border-cyan-300/60"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="rounded-full border border-white/10 bg-cyan-600/20 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-600/30 active:bg-cyan-600/40"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-white/5 via-white/10 to-white/5" />

        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search cards"
            className="w-full rounded-full border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none ring-0 transition focus:border-cyan-300/60 md:max-w-xs"
          />

          <div className="relative w-full md:max-w-[220px]">
            <select
              value={rarity}
              onChange={(event) => setRarity(event.target.value)}
              className="w-full appearance-none rounded-full border border-white/10 bg-slate-950/70 px-4 py-2.5 pr-12 text-sm text-white outline-none transition focus:border-cyan-300/60"
            >
              <option value="All">All rarities</option>
              {rarityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-base text-slate-300">▾</span>
          </div>

          <div className="relative w-full md:max-w-[220px]">
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full appearance-none rounded-full border border-white/10 bg-slate-950/70 px-4 py-2.5 pr-12 text-sm text-white outline-none transition focus:border-cyan-300/60"
            >
              <option value="All">All types</option>
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-base text-slate-300">▾</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">{filteredCards.length} visible</span>
          {(search || rarity !== 'All' || type !== 'All' || prompt) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white transition hover:border-cyan-300/40 hover:bg-white/10"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-slate-300">
          No cards match those filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {filteredCards.map((card) => {
            const theme = getCardTheme(card.rarity ?? 'Common');

            return (
              <article
                key={card.id}
                onClick={() => setSelectedCard({
                  id: card.id,
                  name: card.name,
                  rarity: card.rarity ?? 'Common',
                  image_url: card.image_url,
                  type: card.type,
                  artist_name: card.artist_name ?? null,
                  card_number: card.card_number ?? null,
                  set_name: card.set_name ?? null,
                  set_series: card.set_series ?? null,
                })}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border p-3 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:-translate-y-1"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.22), 0 0 0 1px ${theme.border}`,
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 20%, ${theme.accentGlow} 0%, transparent 52%)`,
                  }}
                />

                <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-slate-950/80">
                  {card.image_url ? (
                    <Image
                      src={card.image_url}
                      alt={card.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">No image</div>
                  )}
                </div>

                <div className="relative mt-3 z-10">
                  <p className="truncate text-sm font-bold text-white" style={{ color: theme.accent }}>
                    {card.name}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400" style={{ color: theme.accent }}>
                    {card.artist_name}
                  </p>
                  <div
                    className="mt-3 flex items-center justify-between border-t pt-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ borderTopColor: theme.border, color: theme.accent }}
                  >
                    <span>{card.rarity}</span>
                    {card.type && <span>{card.type}</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedCard && (
        <CardLightbox
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
}
