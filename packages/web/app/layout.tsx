import { RootWrapper } from '../components/RootWrapper'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <RootWrapper>
          {children}
        </RootWrapper>
      </body>
    </html>
  )
}
