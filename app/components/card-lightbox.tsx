'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { getCardTheme } from './card-theme';

interface Card {
  id: string;
  name: string;
  rarity: string;
  image_url: string;
  type: string;
  artist_name: string;
}

interface CardLightboxProps {
  card: Card;
  onClose: () => void;
}

export default function CardLightbox({ card, onClose }: CardLightboxProps) {
  const theme = getCardTheme(card.rarity);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040ef2] px-4 py-8 backdrop-blur-2xl"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border shadow-[0_30px_120px_rgba(0,0,0,0.65)] ring-1 ring-white/5"
        style={{
          backgroundColor: 'rgba(9, 14, 29, 0.92)',
          borderColor: theme.border,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border px-3 py-1 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
          style={{ borderColor: theme.border, backgroundColor: theme.accentSoft, color: theme.accent }}
          aria-label="Close enlarged card view"
        >
          Close
        </button>

        <div className="grid gap-0 md:grid-cols-[1.25fr_0.75fr]">
          <div
            className="relative aspect-[3/4]"
            style={{
              background: `radial-gradient(circle at top, ${theme.accentSoft}, transparent 45%), #08101f`,
            }}
          >
            {card.image_url ? (
              <Image
                src={card.image_url}
                alt={card.name}
                fill
                sizes="(max-width: 768px) 100vw, 70vw"
                className="object-contain p-4"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                Image Missing
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-6 border-t p-6 md:border-l md:border-t-0 md:p-8" style={{ borderColor: theme.border }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: theme.accent }}>
                {theme.label}
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white md:text-4xl" style={{ textShadow: `0 0 22px ${theme.accentGlow}` }}>
                {card.name}
              </h2>
              <p className="mt-2 text-sm text-slate-300" style={{ color: theme.accent }}>
                🎨 {card.artist_name}
              </p>
            </div>

            <div className="space-y-3 text-sm text-slate-200">
              <div className="flex items-center justify-between gap-4 border-b pb-3" style={{ borderColor: theme.border }}>
                <span className="text-slate-400">Rarity</span>
                <span style={{ color: theme.accent }}>{card.rarity}</span>
              </div>
              {card.type && (
                <div className="flex items-center justify-between gap-4 border-b pb-3" style={{ borderColor: theme.border }}>
                  <span className="text-slate-400">Type</span>
                  <span style={{ color: theme.accent }}>{card.type}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}