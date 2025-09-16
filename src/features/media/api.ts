import { tmdb } from "../../lib/axios";
import type { Paged, Media } from "./types";

export async function getTrending(): Promise<Paged<Media>> {
  const { data } = await tmdb.get("/trending/all/week");
  return data;
}

export async function getDiscoverMovie(): Promise<Paged<Media>> {
  const { data } = await tmdb.get("/discover/movie");
  return data;
}

export async function getDetails(id: number, type: "movie" | "tv") {
  const { data } = await tmdb.get(`/${type}/${id}`, { params: { append_to_response: "videos" } });
  return data;
}

export async function searchMulti(query: string, page = 1) {
  if (!query.trim()) return { page: 1, results: [], total_pages: 1 };
  const { data } = await tmdb.get("/search/multi", {
    params: { query, include_adult: false, page },
  });

  data.results = (data.results || []).filter((r: any) => r.media_type === "movie" || r.media_type === "tv");
  return data;
}

// filmes populares / top rated
export async function getPopularMovies(page = 1) {
  const { data } = await tmdb.get("/movie/popular", { params: { page } });
  return data;
}
export async function getTopMovies(page = 1) {
  const { data } = await tmdb.get("/movie/top_rated", { params: { page } });
  return data;
}

// séries populares / top rated
export async function getPopularTv(page = 1) {
  const { data } = await tmdb.get("/tv/popular", { params: { page } });
  return data;
}
export async function getTopTv(page = 1) {
  const { data } = await tmdb.get("/tv/top_rated", { params: { page } });
  return data;
}
export async function getPopularMoviesPage(page = 1) {
  const { data } = await tmdb.get("/movie/popular", { params: { page } });
  return data;
}
export async function getTopMoviesPage(page = 1) {
  const { data } = await tmdb.get("/movie/top_rated", { params: { page } });
  return data;
}
export async function getPopularTvPage(page = 1) {
  const { data } = await tmdb.get("/tv/popular", { params: { page } });
  return data;
}
export async function getTopTvPage(page = 1) {
  const { data } = await tmdb.get("/tv/top_rated", { params: { page } });
  return data;
}

export async function getMovieGenres() {
  const { data } = await tmdb.get("/genre/movie/list", { params: { language: "pt-BR" } });
  return data.genres as Array<{ id: number; name: string }>;
}
export async function getTvGenres() {
  const { data } = await tmdb.get("/genre/tv/list", { params: { language: "pt-BR" } });
  return data.genres as Array<{ id: number; name: string }>;
}

/** Vídeos (para trailer no card sem carregar tudo) */
export async function getVideos(type: "movie" | "tv", id: number) {
  const { data } = await tmdb.get(`/${type}/${id}/videos`, { params: { language: "pt-BR" } });
  return data.results as any[];
}

/** Discover com filtros (gênero + ordenação), com paginação */
export async function discoverMovies({ page = 1, with_genres, sort_by }: { page?: number; with_genres?: string; sort_by?: string }) {
  const { data } = await tmdb.get("/discover/movie", {
    params: { page, with_genres, sort_by: sort_by || "popularity.desc", language: "pt-BR", include_adult: false },
  });
  return data;
}
export async function discoverTv({ page = 1, with_genres, sort_by }: { page?: number; with_genres?: string; sort_by?: string }) {
  const { data } = await tmdb.get("/discover/tv", {
    params: { page, with_genres, sort_by: sort_by || "popularity.desc", language: "pt-BR", include_adult: false },
  });
  return data;
}

export async function getSimilar(type: "movie"|"tv", id: number, page = 1) {
  const { data } = await tmdb.get(`/${type}/${id}/similar`, { params: { page, language: "pt-BR" } });
  return data;
}
export async function getRecommendations(type: "movie"|"tv", id: number, page = 1) {
  const { data } = await tmdb.get(`/${type}/${id}/recommendations`, { params: { page, language: "pt-BR" } });
  return data;
}


