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
        <div className="absolute left-[-12%] top-[-10%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,91,91,0.56),transparent_62%)] blur-3xl" />
        <div className="absolute right-[-10%] top-[5%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,213,74,0.48),transparent_62%)] blur-3xl" />
        <div className="absolute bottom-[-14%] left-[18%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(100,210,255,0.34),transparent_64%)] blur-3xl" />
        <div className="absolute bottom-[10%] right-[18%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(123,255,143,0.26),transparent_64%)] blur-3xl" />
        <div className="absolute left-[30%] top-[28%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.10),transparent_60%)] blur-3xl" />
      </div>

      <header className="relative max-w-7xl mx-auto mb-12 text-center md:text-left">
        <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/95 backdrop-blur">
          Scarlet & Violet Collection
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl bg-gradient-to-r from-yellow-200 via-amber-400 to-red-400 bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(255,213,74,0.22)]">
          Scarlet & Violet: 151
        </h1>
        <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-200/90">
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