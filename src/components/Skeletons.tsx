export function SkeletonHero() {
  return <div className="skel skel-hero" />;
}

export function SkeletonCard() {
  return <div className="skel skel-card" />;
}

/** Lista horizontal de skeleton cards (para rows) */
export function SkeletonRow({ count = 8 }: { count?: number }) {
  return (
    <div className="row">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <div className="skel skel-card" />
          <div className="caption" style={{ opacity: .5, height: 14, marginTop: 8 }} />
        </div>
      ))}
    </div>
  );
}

/** Grade de skeletons para páginas Filmes/Séries */
export function SkeletonGrid({ count = 18 }: { count?: number }) {
  return (
    <div className="grid" style={{ padding: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skel skel-card" />
      ))}
    </div>
  );
}
