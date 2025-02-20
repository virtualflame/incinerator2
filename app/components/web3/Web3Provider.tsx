"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const ConnexContext = createContext(null)

export function Web3Provider({ children }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Only initialize on client
    setIsReady(true)
  }, [])

  if (!isReady) return null

  return (
    <ConnexContext.Provider value={{}}>
      {children}
    </ConnexContext.Provider>
  )
} 