"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { initConnex, getConnex } from '../../lib/vechain'

export const Web3Context = createContext<any>(null)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initConnex()
      setIsReady(true)
    }
  }, [])

  if (!isReady) return null

  return (
    <Web3Context.Provider value={{ connex: getConnex() }}>
      {children}
    </Web3Context.Provider>
  )
} 