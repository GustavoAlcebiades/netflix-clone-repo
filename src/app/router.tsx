import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("../features/media/pages/HomePage"));
const DetailsPage = lazy(() => import("../features/media/pages/DetailsPage"));
const SearchPage = lazy(() => import("../features/media/pages/SearchPage"));
const MyListPage = lazy(() => import("../features/media/pages/MyListPage"));
const MoviesPage = lazy(() => import("../features/media/pages/MoviesPage"));
const SeriesPage = lazy(() => import("../features/media/pages/SeriesPage"));

const Fallback = <div style={{ padding: 24 }}>Carregando…</div>;

export const router = createBrowserRouter([
  { path: "/", element: <Suspense fallback={Fallback}><HomePage /></Suspense> },
  { path: "/details/:type/:id", element: <Suspense fallback={Fallback}><DetailsPage /></Suspense> },
  { path: "/search", element: <Suspense fallback={Fallback}><SearchPage /></Suspense> },
  { path: "/my-list", element: <Suspense fallback={Fallback}><MyListPage /></Suspense> },
  { path: "/movies", element: <Suspense fallback={Fallback}><MoviesPage /></Suspense> },
  { path: "/series", element: <Suspense fallback={Fallback}><SeriesPage /></Suspense> },
]);
