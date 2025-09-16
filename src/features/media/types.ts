export type Media = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  media_type?: "movie" | "tv";
};

export type Paged<T> = { page: number; results: T[]; total_pages: number };
