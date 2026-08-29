export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-300 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-semibold text-white">Pokémon Art Gallery</p>
          <p className="mt-1 text-slate-400">A curated collection of collectible card artwork.</p>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <a href="#featured" className="transition hover:text-white">Featured</a>
          <a href="#collection" className="transition hover:text-white">Collection</a>
          <a href="#artists" className="transition hover:text-white">Artists</a>
        </div>
      </div>
    </footer>
  );
}
