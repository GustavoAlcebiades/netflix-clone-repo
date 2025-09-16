import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 120_000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});
