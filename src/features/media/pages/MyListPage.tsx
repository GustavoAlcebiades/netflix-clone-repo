import Navbar from "../../../components/NavBar";
import { useMyList } from "../../../store/useMyList";
import { Link } from "react-router-dom";

const IMG = process.env.REACT_APP_TMDB_IMG_BASE as string;

export default function MyListPage() {
  const { items, remove } = useMyList();

  return (
    <>
      <Navbar />
      <main>
        <div style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          <div className="container">
            <h1 style={{ margin: 0 }}>Minha lista</h1>
          </div>
        </div>

        <div className="container" style={{ padding: 16 }}>
          {items.length === 0 ? (
            <p>Sua lista está vazia. Adicione títulos pela Home ou pela Busca.</p>
          ) : (
            <div className="row">
              {items.map((it) => {
                const img = it.poster_path ? `${IMG}/w342${it.poster_path}` : undefined;
                return (
                  <div key={`${it.type}-${it.id}`} className="card">
                    <Link to={`/details/${it.type}/${it.id}`}>
                      <div className="poster">{img ? <img src={img} alt={it.title} /> : null}</div>
                      <div className="caption">{it.title}</div>
                    </Link>
                    <div style={{ marginTop: 6 }}>
                      <button className="btn" onClick={() => remove(it.id, it.type)}>Remover</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
