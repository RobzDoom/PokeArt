'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getCardTheme } from './card-theme';
import CardLightbox, { type CardLightboxCard } from './card-lightbox';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

export interface Card {
  id: string;
  name: string;
  rarity: string;
  image_url: string | null;
  type: string | null;
  artist_name: string;
  card_number?: number | string | null;
  set_name?: string | null;
  set_series?: string | null;
}

interface HomePageProps {
  cards: Card[];
  featuredCard: Card | null;
}

export function HomePage({ cards, featuredCard }: HomePageProps) {
  const featuredTheme = featuredCard ? getCardTheme(featuredCard.rarity) : null;
  const galleryCards = cards.slice(0, 12);
  const [selectedCard, setSelectedCard] = useState<CardLightboxCard | null>(null);

  const openCard = (card: Card) => {
    setSelectedCard({
      id: card.id,
      name: card.name,
      rarity: card.rarity,
      image_url: card.image_url,
      type: card.type,
      artist_name: card.artist_name,
      card_number: card.card_number,
      set_name: card.set_name,
      set_series: card.set_series,
    });
  };

  return (
    <div className="flex min-h-screen flex-col text-slate-100">
      <SiteHeader />

      <main className="mx-auto max-w-7xl flex-1 px-4 pb-20 pt-10 md:px-8">
        <section id="featured" className="grid gap-10 pb-18 pt-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-yellow-300/30 bg-yellow-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-yellow-100">
              Scarlet & Violet
            </p>
            <h2 className="mt-5 max-w-xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              A holographic gallery of the art that defines the set.
            </h2>
            <p className="mt-5 max-w-xl text-base text-slate-300 md:text-lg">
              Browse iconic artwork, collectors’ favorites, and the artists behind each piece in one immersive display.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* <a href="#collection" className="rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-red-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_18px_50px_rgba(255,213,74,0.28)] transition hover:scale-[1.02]">
                View Collection
              </a> */}
              <a href="/sets" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10">
                Browse Sets
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-yellow-300/20 via-cyan-400/10 to-red-400/10 blur-3xl" />
            {featuredCard ? (
              <div
                className="overflow-hidden rounded-[2rem] border p-4 shadow-[0_30px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl"
                style={{
                  backgroundColor: featuredTheme?.accentSoft,
                  borderColor: featuredTheme?.border,
                }}
              >
                <div
                  className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem] border"
                  style={{
                    backgroundColor: featuredTheme?.accentSoft,
                    borderColor: featuredTheme?.border,
                  }}
                >
                  <Image
                    src={featuredCard.image_url ?? ''}
                    alt={featuredCard.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Card of the Day</p>
                    <h3 className="mt-2 text-2xl font-black text-white">{featuredCard.name}</h3>
                  </div>
                  <span className="rounded-full border border-yellow-300/30 bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-yellow-100">
                    {featuredCard.rarity}
                    <p className="text-sm text-slate-300">{featuredCard.artist_name}</p>
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-8 text-slate-300 shadow-[0_30px_100px_rgba(0,0,0,0.38)]">
                No featured card yet.
              </div>
            )}
          </div>
        </section>

        <section id="artists" className="mt-8 grid gap-6 border-t border-white/10 pt-10 md:grid-cols-3">
          {[
            { title: 'Master artists', value: '151+' },
            { title: 'Collector sets', value: '12' },
            { title: 'Curated scans', value: 'Live' },
          ].map((stat) => (
            <div key={stat.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{stat.title}</p>
              <p className="mt-3 text-3xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </section>

        <section id="collection" className="mt-16">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-100/75">Artist Cards</p>
            </div>
            <a href="/sets" className="text-sm font-semibold text-cyan-200 transition hover:text-white">
              View all sets →
            </a>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {galleryCards.map((card) => {
              const theme = getCardTheme(card.rarity);

              return (
                <article
                  key={card.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openCard(card)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openCard(card);
                    }
                  }}
                  className="group relative overflow-hidden rounded-2xl border p-3 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1"
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
                        className="object-contain transition duration-300 group-hover:scale-[1.03]"
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
        </section>
      </main>

      <SiteFooter />

      {selectedCard && (
        <CardLightbox
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
