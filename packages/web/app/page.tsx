"use client"

import { WalletConnect } from '../components/WalletConnect'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">VFS Incinerator</h1>
      <WalletConnect />
    </main>
  )
} 