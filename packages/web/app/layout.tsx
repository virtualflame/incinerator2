import { QueryClientProvider } from '@tanstack/react-query'
import { DAppKitProvider } from '@vechain/dapp-kit'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <DAppKitProvider>
            {children}
          </DAppKitProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
} 