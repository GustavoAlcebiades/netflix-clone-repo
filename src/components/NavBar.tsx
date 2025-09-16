import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMyList } from "../store/useMyList";
import { useSearch } from "../features/media/hooks";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export default function Navbar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const loc = useLocation();
  const [q, setQ] = useState(params.get("q") ?? "");

  const { items } = useMyList();
  const count = items.length;

  useEffect(() => {
    if (loc.pathname === "/search") setQ(params.get("q") ?? "");
  }, [loc.pathname, params]);

  const qDebounced = useDebouncedValue(q, 300);
  const { data: acData, isLoading: acLoading } = useSearch(qDebounced || "", 1);
  const acItems = (acData?.results || []).slice(0, 6);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  const goTo = (type: "movie"|"tv", id: number) => {
    navigate(`/details/${type}/${id}`);
    setQ("");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">Netflux</Link>

        <form onSubmit={onSubmit} className="search autocomplete" autoComplete="off">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar filmes e séries"
          />
          <button className="btn" type="submit">Buscar</button>

          {qDebounced && (
            <div className="ac-dropdown">
              {acLoading && <div className="ac-empty">Buscando…</div>}
              {!acLoading && acItems.length === 0 && <div className="ac-empty">Sem resultados</div>}
              {!acLoading && acItems.map((r: any) => {
                const type = (r.media_type ?? (r.title ? "movie" : "tv")) as "movie"|"tv";
                const img = r.poster_path ? `${process.env.REACT_APP_TMDB_IMG_BASE}/w92${r.poster_path}` : undefined;
                const title = r.title ?? r.name;
                return (
                  <div key={`${type}-${r.id}`} className="ac-item" onClick={() => goTo(type, r.id)}>
                    {img ? <img src={img} alt="" /> : <div style={{ width: 32, height: 48, background: "#111", borderRadius: 6 }} />}
                    <div style={{ display:"grid", lineHeight:1.2 }}>
                      <span>{title}</span>
                      <small style={{ opacity:.7 }}>{type === "movie" ? "Filme" : "Série"}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </form>

        <nav className="nav">
          <Link to="/">Início</Link>
          <Link to="/movies">Filmes</Link>
          <Link to="/series">Séries</Link>
          <Link to="/my-list" className="with-badge">
            Minha lista <span className="badge">{count}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
