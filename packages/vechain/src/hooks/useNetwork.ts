import { useState, useEffect } from 'react'
import { vechain } from '../connection'

export function useNetwork() {
  const [isTestnet, setIsTestnet] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkNetwork() {
      try {
        const isTestnet = await vechain.verifyTestnet()
        setIsTestnet(isTestnet)
      } finally {
        setIsChecking(false)
      }
    }
    checkNetwork()
  }, [])

  return {
    isTestnet,
    isChecking
  }
} 