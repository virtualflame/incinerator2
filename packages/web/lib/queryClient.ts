import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000, // 5 seconds
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})
