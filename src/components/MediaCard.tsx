import { Link } from "react-router-dom";
import type { Media } from "../features/media/types";
import { useState } from "react";
import { useTrailerKey } from "../features/media/hooks";
import TrailerModal from "./TrailerModal";
import { usePlayback } from "../store/usePlayback";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getDetails, getVideos } from "../features/media/api";

const IMG = process.env.REACT_APP_TMDB_IMG_BASE as string;

export default function MediaCard({ m }: { m: Media }) {
  const title = m.title ?? m.name ?? "Untitled";
  const img = m.poster_path ? `${IMG}/w342${m.poster_path}` : undefined;
  const type = (m.media_type ?? (m.title ? "movie" : "tv")) as "movie" | "tv";


  // Modal trailer
  const [open, setOpen] = useState(false);
  const { data: yt } = useTrailerKey(type, m.id);

  // Playback (continuar assistindo) — medimos pelo trailer
  const { upsert } = usePlayback();
  const onProgress = (ratio: number) => {
    // salva 1..99 para aparecer em "Continuar assistindo"
    const pct = Math.max(1, Math.min(99, Math.round(ratio * 100)));
    upsert({ id: m.id, type, title, poster_path: m.poster_path, progress: pct, genres: (m as any).genre_ids });
  };

  return (
    <div className="card">
      <div className="card-wrap">
        <Link to={`/details/${type}/${m.id}`}>
          <div className="poster">{img ? <img src={img} alt={title} loading="lazy" /> : null}
           {img ? (
            <img
            src={img}
            srcSet={`${IMG}/w185${m.poster_path} 185w, ${IMG}/w342${m.poster_path} 342w, ${IMG}/w500${m.poster_path} 500w`}
            sizes="(max-width: 520px) 45vw, (max-width: 900px) 20vw, 180px"
            alt={title}
            loading="lazy"
            />
        ) : null} 
          </div>
          <div className="caption">{title}</div>
        </Link>
        <div className="card-play">
          <button className="playbtn" onClick={() => setOpen(true)} aria-label={`Assistir trailer de ${title}`}>▶</button>
        </div>
      </div>

      <TrailerModal
        open={open}
        onClose={() => setOpen(false)}
        youtubeKey={yt}
        media={{ id: m.id, type, title, poster_path: m.poster_path, genres: (m as any).genre_ids }}
      />

      {/* Observação: não temos callback direto do ReactPlayer aqui.
          Vamos controlar progresso via página de Detalhes (player “principal”)
          e manter aqui apenas o trailer em modal rápido. */}
    </div>
  );
}
