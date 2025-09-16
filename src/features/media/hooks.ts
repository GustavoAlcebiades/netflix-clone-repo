import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getTrending, getDiscoverMovie, getDetails, searchMulti, getPopularMovies, getTopMovies, getPopularTv, getTopTv, getPopularMoviesPage, getPopularTvPage, getTopMoviesPage, getTopTvPage, discoverMovies, discoverTv, getMovieGenres, getTvGenres, getVideos, getRecommendations, getSimilar } from "./api";

const getNext = (lastPage: any, pages: any[]) => {
  if (!lastPage?.page || !lastPage?.total_pages) return undefined;
  return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
};


export const useTrending = () => useQuery({ queryKey: ["trending"], queryFn: getTrending });
export const useDiscoverMovie = () => useQuery({ queryKey: ["discover-movie"], queryFn: getDiscoverMovie });
export const useDetails = (id: number, type: "movie" | "tv") =>
  useQuery({ queryKey: ["details", type, id], queryFn: () => getDetails(id, type), enabled: !!id });

export const useSearch = (q: string, page = 1) =>
  useQuery({
    queryKey: ["search", q, page],
    queryFn: () => searchMulti(q, page),
    enabled: q.trim().length > 0,
  });

export const usePopularMovies = (page = 1) =>
  useQuery({ queryKey: ["popular-movies", page], queryFn: () => getPopularMovies(page) });

export const useTopMovies = (page = 1) =>
  useQuery({ queryKey: ["top-movies", page], queryFn: () => getTopMovies(page) });

export const usePopularTv = (page = 1) =>
  useQuery({ queryKey: ["popular-tv", page], queryFn: () => getPopularTv(page) });

export const useTopTv = (page = 1) =>
  useQuery({ queryKey: ["top-tv", page], queryFn: () => getTopTv(page) });

export const useInfinitePopularMovies = () =>
  useInfiniteQuery({
    queryKey: ["inf-popular-movies"],
    queryFn: ({ pageParam = 1 }) => getPopularMoviesPage(pageParam),
    getNextPageParam: getNext,
    initialPageParam: 1,
  });

export const useInfiniteTopMovies = () =>
  useInfiniteQuery({
    queryKey: ["inf-top-movies"],
    queryFn: ({ pageParam = 1 }) => getTopMoviesPage(pageParam),
    getNextPageParam: getNext,
    initialPageParam: 1,
  });

export const useInfinitePopularTv = () =>
  useInfiniteQuery({
    queryKey: ["inf-popular-tv"],
    queryFn: ({ pageParam = 1 }) => getPopularTvPage(pageParam),
    getNextPageParam: getNext,
    initialPageParam: 1,
  });

export const useInfiniteTopTv = () =>
  useInfiniteQuery({
    queryKey: ["inf-top-tv"],
    queryFn: ({ pageParam = 1 }) => getTopTvPage(pageParam),
    getNextPageParam: getNext,
    initialPageParam: 1,
  });

export const useMovieGenres = () =>
  useQuery({ queryKey: ["genres", "movie"], queryFn: getMovieGenres });

export const useTvGenres = () =>
  useQuery({ queryKey: ["genres", "tv"], queryFn: getTvGenres });

/** Trailer (só pega o YouTube key) */
export const useTrailerKey = (type: "movie" | "tv", id?: number) =>
  useQuery({
    queryKey: ["videos", type, id],
    queryFn: async () => {
      if (!id) return undefined;
      const vids = await getVideos(type, id);
      return vids.find((v: any) => v.site === "YouTube" && v.type === "Trailer")?.key as string | undefined;
    },
    enabled: !!id,
    staleTime: 60_000,
  });

/** Discover com filtros + infinite scroll */
const getNextFilter = (lastPage: any) =>
  lastPage?.page < lastPage?.total_pages ? lastPage.page + 1 : undefined;

export const useInfiniteDiscoverMovies = (filters: { with_genres?: string; sort_by?: string }) =>
  useInfiniteQuery({
    queryKey: ["discover-movies", filters],
    queryFn: ({ pageParam = 1 }) => discoverMovies({ page: pageParam, ...filters }),
    getNextPageParam: getNextFilter,
    initialPageParam: 1,
  });

export const useInfiniteDiscoverTv = (filters: { with_genres?: string; sort_by?: string }) =>
  useInfiniteQuery({
    queryKey: ["discover-tv", filters],
    queryFn: ({ pageParam = 1 }) => discoverTv({ page: pageParam, ...filters }),
    getNextPageParam: getNextFilter,
    initialPageParam: 1,
  });

export const useSimilar = (type: "movie"|"tv", id?: number) =>
  useQuery({ queryKey: ["similar", type, id], queryFn: () => getSimilar(type, id!), enabled: !!id });

export const useRecommendations = (type: "movie"|"tv", id?: number) =>
  useQuery({ queryKey: ["recs", type, id], queryFn: () => getRecommendations(type, id!), enabled: !!id });  
