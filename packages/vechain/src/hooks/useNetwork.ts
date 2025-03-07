"use client"

import { useState, useEffect } from 'react'
import { vechain } from '../connection'

export function useNetwork() {
  const [isTestnet, setIsTestnet] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const isTestnet = await vechain.verifyTestnet()
        setIsTestnet(isTestnet)
      } finally {
        setIsLoading(false)
      }
    }
    checkNetwork()
  }, [])

  return { isTestnet, isLoading }
} 