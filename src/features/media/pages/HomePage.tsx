import Navbar from "../../../components/NavBar";
import Row from "../../../components/Row";
import MediaCard from "../../../components/MediaCard";
import { useTrending, useDiscoverMovie, useInfiniteDiscoverMovies } from "../hooks";
import { usePlayback } from "../../../store/usePlayback";
import { Link } from "react-router-dom";

const IMG = process.env.REACT_APP_TMDB_IMG_BASE as string;

export default function HomePage() {
  const { data: trending, isLoading: loadT, isError: errT } = useTrending();
  const { data: discover, isLoading: loadD, isError: errD } = useDiscoverMovie();

  const { items } = usePlayback();
  const continueWatching = items.filter((it) => it.progress > 0 && it.progress < 100).slice(0, 12);

  const topGenres = usePlayback.getState().topGenres(); // gêneros mais assistidos
  const recFilters = topGenres.length ? { with_genres: topGenres.join(",") } : {};
  const rec = useInfiniteDiscoverMovies(recFilters);


  // item em destaque (primeiro do trending que tiver backdrop)
  const featured = trending?.results?.find((m: any) => m.backdrop_path);

  const backdrop = featured?.backdrop_path ? `${IMG}/w1280${featured.backdrop_path}` : undefined;
  const title = featured?.title ?? featured?.name ?? "Assista o que é tendência";
  const overview = featured?.overview ?? "Conteúdos populares da semana e descobertas para você.";

  return (
    <>
      <Navbar />

      <main>
        <section className="hero">
          {backdrop ? (
            <img
              src={backdrop}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .55 }}
            />
          ) : null}
          <div className="overlay" />
          <div className="container content">
            <div className="kicker">Em destaque</div>
            <h1>{title}</h1>
            <p>{overview}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <a className="btn" href="#rows">Explorar</a>
            </div>
          </div>
        </section>

        <div id="rows" className="container">
        {continueWatching.length > 0 && (
          <section className="section">
            <div className="title">
              <h2 style={{ margin: 0, fontSize: 18 }}>Continuar assistindo</h2>
            </div>
            <div className="scroller">
              <div className="row">
                {continueWatching.map((it) => (
                    <Link key={`${it.type}-${it.id}`} to={`/details/${it.type}/${it.id}`} className="card">
                        <div className="poster">
                        {it.poster_path ? (
                            <img
                            src={`${IMG}/w342${it.poster_path}`}
                            srcSet={`${IMG}/w185${it.poster_path} 185w, ${IMG}/w342${it.poster_path} 342w, ${IMG}/w500${it.poster_path} 500w`}
                            sizes="(max-width: 520px) 45vw, (max-width: 900px) 20vw, 180px"
                            alt={it.title} loading="lazy"
                            />
                        ) : null}
                        </div>
                        <div className="caption">{it.title}</div>
                        <div className="progress"><span style={{ width: `${it.progress}%` }} /></div>
                    </Link>
                    ))}
              </div>
            </div>
          </section>
        )}
        {rec.data?.pages?.[0]?.results?.length > 0 && (
    <section className="section">
        <div className="title">
        <h2 style={{ margin: 0, fontSize: 18 }}>Recomendados para você</h2>
        </div>
        <div className="scroller">
        <div className="row">
            {rec.data?.pages?.[0]?.results?.map((m: any) => (
            <MediaCard key={`rec-${m.id}`} m={{ ...m, media_type: "movie" }} />
            ))}
        </div>
        </div>
    </section>
    )}
    </div>



        <div id="rows" className="container">
          <Row title="Em alta">
            {loadT && <p>Carregando…</p>}
            {errT && <p style={{ color: "#f66" }}>Erro ao carregar.</p>}
            {!loadT && !errT && trending?.results?.map((m) => (
              <MediaCard key={`${m.media_type}-${m.id}`} m={m} />
            ))}
          </Row>

          <Row title="Descubra filmes">
            {loadD && <p>Carregando…</p>}
            {errD && <p style={{ color: "#f66" }}>Erro ao carregar.</p>}
            {!loadD && !errD && discover?.results?.map((m) => (
              <MediaCard key={m.id} m={m} />
            ))}
          </Row>
        </div>
      </main>
    </>
  );
}
