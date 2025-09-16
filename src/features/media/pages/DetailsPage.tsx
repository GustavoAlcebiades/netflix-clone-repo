import { useNavigate, useParams } from "react-router-dom";
import { useDetails, useRecommendations, useSimilar } from "../hooks";
import ReactPlayer from "react-player";
import { useMyList } from "../../../store/useMyList";
import TrailerModal from "../../../components/TrailerModal";
import { useState } from "react";
import { usePlayback } from "../../../store/usePlayback";
import MediaCard from "../../../components/MediaCard";


const IMG = process.env.REACT_APP_TMDB_IMG_BASE as string;

export default function DetailsPage() {
  const { id, type } = useParams(); // "movie" | "tv"
  const nid = Number(id);
  const kind = (type as "movie" | "tv") ?? "movie";
  const { data, isLoading, isError } = useDetails(nid, kind);

  const title = data?.title ?? data?.name ?? "";
  const backdrop = data?.backdrop_path ? `${IMG}/w1280${data.backdrop_path}` : undefined;
  const poster = data?.poster_path ? `${IMG}/w500${data.poster_path}` : undefined;
  const genres: Array<{ id: number; name: string }> = data?.genres ?? [];
  const runtime = data?.runtime || data?.episode_run_time?.[0];
  const date = data?.release_date || data?.first_air_date;
  const score = data?.vote_average ? Math.round(data.vote_average * 10) / 10 : null;
  const yt = data?.videos?.results?.find((v: any) => v.site === "YouTube" && v.type === "Trailer")?.key;

  const { add, remove, has } = useMyList();
  const inList = has(nid, kind);
  const navigate = useNavigate();
  const [openTrailer, setOpenTrailer] = useState(false);

  const sim = useSimilar(kind, nid);
  const recs = useRecommendations(kind, nid);

  const toggleList = () => {
    if (!title) return;
    if (inList) remove(nid, kind);
    else add({ id: nid, type: kind, title, poster_path: data?.poster_path });
  };

  const { upsert } = usePlayback();
  const onProgress = (ratio: number) => {
  const pct = Math.max(1, Math.min(99, Math.round(ratio * 100)));
  const genres = Array.isArray(data?.genres) ? data.genres.map((g: any) => g.id) : [];
  upsert({ id: nid, type: kind, title, poster_path: data?.poster_path, progress: pct, genres });
};
const markFinished = () => {
  upsert({ id: nid, type: kind, title, poster_path: data?.poster_path, progress: 100, genres: (data?.genres||[]).map((g:any)=>g.id) });
};
  

  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", height: "46vh", minHeight: 320, background: "#111" }}>
        {backdrop ? <img src={backdrop} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .55 }} /> : null}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, black, rgba(0,0,0,.3))" }} />
        <div className="container" style={{ position: "absolute", bottom: 20 }}>
          <h1 style={{ margin: 0 }}>{title}</h1>
          {data?.tagline ? <p style={{ margin: "6px 0", opacity: .8, fontStyle: "italic" }}>{data.tagline}</p> : null}
        </div>
        <div className="container" style={{ position: "absolute", bottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn" onClick={() => navigate(-1)}>← Voltar</button>
            <h1 style={{ margin: 0 }}>{title}</h1>
        </div>

      </div>


      <div className="container">
        {isLoading && (
          <div style={{ padding: 24 }}>
            <div className="skel skel-card" style={{ width: 240 }} />
            <div style={{ height: 12 }} />
            <div className="skel" style={{ height: 120, borderRadius: 12 }} />
          </div>
        )}
        {isError && <p style={{ color: "#f66", padding: 24 }}>Erro ao carregar detalhes.</p>}

        {!isLoading && !isError && data && (
          <div className="details-wrap">
            <div>
              {/* Sinopse + trailer */}
              <div className="chips" style={{ marginBottom: 12 }}>
                {genres.map((g) => <span key={g.id} className="chip">{g.name}</span>)}
              </div>
              <p style={{ opacity: .9, lineHeight: 1.6 }}>{data.overview}</p>

              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <button className="btn" onClick={toggleList}>
                    {inList ? "Remover da minha lista" : "+ Minha lista"}
                </button>
                <button className="btn" onClick={() => setOpenTrailer(true)} disabled={!yt}>
                    Trailer ▶
                </button>
                <button className="btn" onClick={markFinished}>Marcar como concluído ✓</button>
              </div>

              <div style={{ marginTop: 24 }}>
                {yt ? (
                  <div style={{ aspectRatio: "16/9" }}>
                    <TrailerModal open={openTrailer} onClose={() => setOpenTrailer(false)} youtubeKey={yt} />
                  </div>
                ) : null}
              </div>
            </div>

            <aside>
              {/* Poster + metadados */}
              <div className="details-poster">
                {poster ? <img src={poster} alt={title} style={{ width: "100%", display: "block" }} /> : <div className="skel skel-card" />}
              </div>

              <div style={{ marginTop: 16 }}>
                <div className="meta-line"><strong>Lançamento:</strong> <span>{date || "—"}</span></div>
                <div className="meta-line"><strong>Duração:</strong> <span>{runtime ? `${runtime} min` : "—"}</span></div>
                <div className="meta-line"><strong>Tipo:</strong> <span>{kind === "movie" ? "Filme" : "Série"}</span></div>
                {score !== null && (
                  <div className="meta-line"><strong>Nota:</strong> <span className="score">{score}</span></div>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
        <div className="section">
  <div className="title"><h2 style={{ margin:0, fontSize:18 }}>Semelhantes</h2></div>
  <div className="scroller">
    <div className="row">
      {sim.data?.results?.slice(0, 12).map((m: any) => (
        <MediaCard key={`sim-${m.id}`} m={{ ...m, media_type: kind }} />
      ))}
    </div>
  </div>
</div>

<div className="section">
  <div className="title"><h2 style={{ margin:0, fontSize:18 }}>Recomendados</h2></div>
  <div className="scroller">
    <div className="row">
      {recs.data?.results?.slice(0, 12).map((m: any) => (
        <MediaCard key={`rec-${m.id}`} m={{ ...m, media_type: kind }} />
      ))}
    </div>
  </div>
</div>

    </div>
  );
}
