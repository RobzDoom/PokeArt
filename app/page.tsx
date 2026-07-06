'use client';

import { useEffect, useState } from 'react';
import HoloCard from './components/holo-card';
import CardLightbox from '@/app/components/card-lightbox';

interface Card {
  id: string;
  name: string;
  rarity: string;
  image_url: string;
  type: string;
  artist_name: string;
};

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    async function fetch151Cards() {
      const response = await fetch('/api/cards?setId=sv03.5');

      if (!response.ok) {
        console.error('Error fetching cards:', response.statusText);
        setLoading(false);
        return;
      }

      const data = (await response.json()) as { cards: Card[] };
      setCards(data.cards);
      setLoading(false);
    }

    fetch151Cards();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="rounded-3xl border border-white/10 bg-[rgba(10,16,35,0.72)] px-6 py-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <p className="text-xl font-medium tracking-wide animate-pulse">Loading the Gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen px-4 py-8 text-slate-100 md:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="absolute right-[-8%] top-[10%] h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-80 w-80 rounded-full bg-rose-400/10 blur-3xl" />
      </div>

      <header className="relative max-w-7xl mx-auto mb-12 text-center md:text-left">
        <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200/90 backdrop-blur">
          Scarlet & Violet Collection
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(251,191,36,0.18)]">
          Scarlet & Violet: 151
        </h1>
        <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-300/85">
          An exhibition of card art and the master illustrators behind them.
        </p>
      </header>

      <div className="relative max-w-7xl mx-auto grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {cards.length === 0 && (
          <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300 backdrop-blur-xl shadow-2xl shadow-black/20">
            No cards loaded yet. Make sure the seed script ran successfully and Supabase contains rows for set <span className="text-slate-200">sv03.5</span>.
          </div>
        )}
        {cards.map((card) => (
          <HoloCard 
            key={card.id} 
            card={card}
            onClick={() => setSelectedCard(card)}
          />
        ))}
      </div>

      {selectedCard && (
        <CardLightbox
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </main>
  );
}