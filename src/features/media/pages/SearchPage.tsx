import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useSearch } from "../hooks";
import MediaCard from "../../../components/MediaCard";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get("q") ?? "";
  const page = Number(params.get("page") ?? "1");

  const { data, isLoading, isError } = useSearch(q, page);

  const setPage = (p: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next, { replace: true });
  };

  return (
    <div>
      <div style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="btn" onClick={() => navigate(-1)}>← Voltar</button>
          <h1 style={{ margin: 0, fontSize: 20 }}>Resultados para: “{q}”</h1>
        </div>
      </div>

      <div className="container" style={{ padding: 16 }}>
        {isLoading && <p>Carregando…</p>}
        {isError && <p style={{ color: "#f66" }}>Erro ao buscar. Tente novamente.</p>}
        {!isLoading && !isError && data?.results?.length === 0 && q && (
          <p>Nenhum resultado encontrado.</p>
        )}

        <div className="row">
          {data?.results?.map((m: any) => (
            <MediaCard key={`${m.media_type}-${m.id}`} m={m} />
          ))}
        </div>

        {data && data.total_pages > 1 && (
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>◀ Anterior</button>
            <span style={{ opacity: .8, alignSelf: "center" }}>Página {page} de {data.total_pages}</span>
            <button className="btn" disabled={page >= data.total_pages} onClick={() => setPage(page + 1)}>Próxima ▶</button>
          </div>
        )}
      </div>
    </div>
  );
}
