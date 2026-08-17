import { getCardTheme } from './card-theme';

export interface ArtistCardData {
  id: string;
  name: string;
  rarity: string;
  image_url: string | null;
  type: string | null;
  set_id?: string | null;
  artist_name?: string;
}

export function ArtistCard({ card }: { card: ArtistCardData }) {
  const theme = getCardTheme(card.rarity ?? 'Common');

  return (
    <div
      className="overflow-hidden rounded-3xl border p-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)] transition hover:-translate-y-1"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        boxShadow: `0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px ${theme.border}`,
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80">
        {card.image_url ? (
          <img src={card.image_url} alt={card.name} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="mt-4">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.24em]"
          style={{ color: theme.accent }}
        >
          {card.type ?? 'Card'}
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">{card.name}</h2>

        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-300">Set: {card.set_id ?? 'Unknown'}</span>
          <span
            className="rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.accentSoft,
              color: theme.accent,
            }}
          >
            {card.rarity ?? 'Common'}
          </span>
        </div>
      </div>
    </div>
  );
}
