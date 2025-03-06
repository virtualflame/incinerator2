import { useWallet } from '@incinerator/vechain'
import { useBalance } from '@incinerator/vechain'
import { LoadingSpinner } from './LoadingSpinner'

export function WalletConnect() {
  const { connect, disconnect, isConnected, address } = useWallet()
  const { balances, isLoading, error } = useBalance()

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>
  }

  return (
    <div className="p-4">
      {!isConnected ? (
        <button 
          onClick={connect}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              <p>VET: {balances.vet}</p>
              <p>VTHO: {balances.vtho}</p>
              <p>B3TR: {balances.b3tr}</p>
            </div>
          )}
          <button 
            onClick={disconnect}
            className="bg-red-500 text-white px-4 py-2 rounded mt-2"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
} 