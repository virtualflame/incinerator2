"use client"

import { WalletConnect } from '../components/WalletConnect'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          VFS Incinerator
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <WalletConnect />
        </div>
      </div>
    </main>
  )
} 