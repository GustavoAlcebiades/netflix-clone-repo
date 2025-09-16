import Navbar from "../../../components/NavBar";
import MediaCard from "../../../components/MediaCard";
import { SkeletonGrid } from "../../../components/Skeletons";
import InfiniteSentinel from "../../../components/InfiniteSentinel";
import { useInfiniteDiscoverTv, useTvGenres } from "../hooks";
import { useMemo, useState } from "react";
import { Filters, SortOpt } from "../../../components/Filters";

export default function SeriesPage() {
  const { data: genres = [] } = useTvGenres();
  const [genre, setGenre] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<SortOpt>("popularity.desc");

  const filters = useMemo(
    () => ({ with_genres: genre, sort_by: sort }),
    [genre, sort]
  );

  const q = useInfiniteDiscoverTv(filters);

  const items = useMemo(
    () => q.data?.pages.flatMap((p: any) => p.results || []) || [],
    [q.data]
  );

  const onLoadMore = () => {
    if (q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage();
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
        <div className="container" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0 }}>Séries</h1>
          <div style={{ marginLeft: "auto" }}>
            <Filters
              kind="tv"
              genres={genres}
              valueGenre={genre}
              onGenre={setGenre}
              valueSort={sort}
              onSort={(s) => setSort(s || "popularity.desc")}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 16 }}>
        {(q.isLoading || !q.data) && <SkeletonGrid />}
        {q.isError && <p style={{ color: "#f66" }}>Erro ao carregar.</p>}

        {items.length > 0 && (
          <>
            <div className="grid">
              {items.map((m: any) => (
                <MediaCard key={`tv-${m.id}`} m={{ ...m, media_type: "tv" }} />
              ))}
            </div>

            <div style={{ marginTop: 12, opacity: .7, textAlign: "center" }}>
              {q.isFetchingNextPage ? "Carregando mais..." : "Role para carregar mais"}
            </div>

            <InfiniteSentinel
              onVisible={onLoadMore}
              disabled={!q.hasNextPage || q.isFetchingNextPage}
            />
          </>
        )}
      </div>
    </>
  );
}
