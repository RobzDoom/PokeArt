'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { getCardTheme } from './card-theme';

interface CardProps {
  card: {
    id: string;
    name: string;
    rarity: string;
    image_url: string;
    type: string;
    artist_name: string;
  };
  onClick?: () => void;
}

export default function HoloCard({ card, onClick }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = getCardTheme(card.rarity);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  

    // Dynamic 12-degree safe 3D tilt matrix
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -12; 
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;

    cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    cardEl.style.setProperty('--x', `${(x / rect.width) * 100}%`);
    cardEl.style.setProperty('--y', `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    // Reset smoothly back to a flat rest state
    cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    cardEl.style.setProperty('--x', '50%');
    cardEl.style.setProperty('--y', '50%');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        boxShadow: `0 16px 45px rgba(0, 0, 0, 0.28), 0 0 0 1px ${theme.border}`,
      }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border p-3 shadow-[0_16px_45px_rgba(0,0,0,0.28)] ring-1 ring-inset ring-white/5 transition-all duration-200 ease-out will-change-transform hover:shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl"
    >
      {/* Interactive Foil/Holo Glare Sheet */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" 
        style={{
          background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.18) 0%, ${theme.accentSoft} 28%, transparent 62%)`
        }}
      />

      {/* Optimized Next/Image Wrapper */}
      <div
        className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-2xl border select-none"
        style={{ backgroundColor: 'rgba(2, 6, 23, 0.78)', borderColor: theme.border }}
      >
        {card.image_url ? (
          <Image
            src={card.image_url}
            alt={card.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-contain pointer-events-none transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="text-xs text-slate-500">Image Missing</span>
        )}
      </div>

      {/* Typography Metadata Layer */}
      <div className="mt-4 flex flex-col flex-grow justify-between z-20">
        <div>
          <h3 className="truncate text-sm font-bold text-slate-50 transition duration-200 md:text-base" style={{ color: theme.accent }}>
            {card.name}
          </h3>
          <p className="mt-0.5 text-xs font-medium tracking-wide" style={{ color: theme.accent }}>
            🎨 {card.artist_name || 'Unknown Illustrator'}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between border-t pt-2" style={{ borderTopColor: theme.border }}>
          <span className="max-w-[70px] truncate text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.accent }}>
            {card.rarity}
          </span>
          {card.type && (
            <span
              className="rounded-full border px-2 py-0.5 text-[10px] font-bold"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.accentSoft,
                color: theme.accent,
              }}
            >
              {card.type}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}