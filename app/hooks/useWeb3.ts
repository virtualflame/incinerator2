"use client"

import { useContext, useEffect } from 'react'
import { ConnexContext } from '../components/web3/Web3Provider'

export function useWeb3() {
  const context = useContext(ConnexContext)
  if (!context) throw new Error('useWeb3 must be used within Web3Provider')
  return context
} 