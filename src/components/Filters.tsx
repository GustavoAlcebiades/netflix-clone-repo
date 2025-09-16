export type SortOpt = "popularity.desc" | "vote_average.desc" | "release_date.desc" | "first_air_date.desc";

export function Filters({
  genres, valueGenre, onGenre, valueSort, onSort, kind,
}: {
  genres: Array<{ id: number; name: string }>;
  valueGenre?: string;
  onGenre: (val?: string) => void;
  valueSort?: SortOpt;
  onSort: (val?: SortOpt) => void;
  kind: "movie" | "tv";
}) {
  const sortOpts: Array<{ v: SortOpt; label: string }> = kind === "movie"
    ? [
        { v: "popularity.desc", label: "Popularidade" },
        { v: "vote_average.desc", label: "Melhor nota" },
        { v: "release_date.desc", label: "Lançamento" },
      ]
    : [
        { v: "popularity.desc", label: "Popularidade" },
        { v: "vote_average.desc", label: "Melhor nota" },
        { v: "first_air_date.desc", label: "Estreia" },
      ];

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <select
        value={valueGenre || ""}
        onChange={(e) => onGenre(e.target.value || undefined)}
        className="btn"
        style={{ background: "transparent", border: "1px solid rgba(255,255,255,.2)" }}
      >
        <option value="">Todos os gêneros</option>
        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>

      <select
        value={valueSort || "popularity.desc"}
        onChange={(e) => onSort(e.target.value as SortOpt)}
        className="btn"
        style={{ background: "transparent", border: "1px solid rgba(255,255,255,.2)" }}
      >
        {sortOpts.map(opt => <option key={opt.v} value={opt.v}>{opt.label}</option>)}
      </select>
    </div>
  );
}
