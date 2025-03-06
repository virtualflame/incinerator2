import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DAppKitProvider } from '@vechain/dapp-kit'
import { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000, // Data considered fresh for 30 seconds
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    }
  }
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DAppKitProvider>
        {children}
      </DAppKitProvider>
    </QueryClientProvider>
  )
} 