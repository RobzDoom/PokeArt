export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-yellow-300/35 bg-yellow-400/10 text-lg shadow-[0_0_18px_rgba(255,213,74,0.18)]">
            ✦
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-100/70">
              Pokémon Art
            </p>
            <h1 className="text-sm font-black tracking-tight text-white">
              Gallery
            </h1>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-slate-200/80 md:flex">
          <a href="#featured" className="transition hover:text-white">Featured</a>
          <a href="#collection" className="transition hover:text-white">Collection</a>
          <a href="#artists" className="transition hover:text-white">Artists</a>
        </nav>

        <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/40 hover:bg-white/10">
          Explore Set
        </button>
      </div>
    </header>
  );
}
