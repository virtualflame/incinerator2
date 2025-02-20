"use client"

import { useState, useEffect } from 'react'
import { getConnex } from '@/lib/vechain/connex'
import { isTestnet } from '@/lib/vechain/connex'

// Testnet B3TR token contract - we'll need to deploy this
const TESTNET_B3TR_CONTRACT = '0x0000000000000000000000000000000000000000' // Replace with actual testnet contract
const MAINNET_B3TR_CONTRACT = '0x0000000000000000000000000000000000000000' // Replace with actual mainnet contract

export function TokenBalances({ address }: { address: string }) {
  const [balances, setBalances] = useState({
    vet: '0',
    vtho: '0',
    b3tr: '0'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const connex = getConnex()
        if (!connex || !address) return

        // Get VET balance
        const vetBalance = await connex.thor.account(address).get()
        const vet = (parseInt(vetBalance.balance) / 1e18).toFixed(2)

        // Get VTHO balance
        const vthoBalance = await connex.thor.account(address).get()
        const vtho = (parseInt(vthoBalance.energy) / 1e18).toFixed(2)

        // Get B3TR balance (ERC20 token)
        const b3trContract = isTestnet() ? TESTNET_B3TR_CONTRACT : MAINNET_B3TR_CONTRACT
        const b3trInstance = connex.thor.account(b3trContract)
        const b3trABI = {
          "constant": true,
          "inputs": [{"name": "_owner","type": "address"}],
          "name": "balanceOf",
          "outputs": [{"name": "balance","type": "uint256"}],
          "type": "function"
        }

        let b3tr = '0'
        try {
          const b3trMethod = b3trInstance.method(b3trABI)
          const b3trResult = await b3trMethod.call(address)
          b3tr = (parseInt(b3trResult.decoded.balance) / 1e18).toFixed(2)
        } catch (error) {
          console.log('B3TR contract not deployed on testnet yet')
        }

        setBalances({ vet, vtho, b3tr })
      } catch (error) {
        console.error('Error fetching balances:', error)
        if (isTestnet()) {
          console.log('Make sure you have testnet tokens')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBalances()
  }, [address])

  if (loading) return <div className="text-center text-sm">Loading balances...</div>

  return (
    <div className="grid grid-cols-3 gap-2 mt-2 bg-black/20 p-4 rounded-lg">
      <div className="text-center">
        <p className="text-xs text-gray-400">VET (Test)</p>
        <p className="font-bold text-[#ff6600]">{balances.vet}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-400">VTHO (Test)</p>
        <p className="font-bold text-[#ff9933]">{balances.vtho}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-400">B3TR (Test)</p>
        <p className="font-bold text-[#ff3300]">{balances.b3tr}</p>
      </div>
    </div>
  )
} 