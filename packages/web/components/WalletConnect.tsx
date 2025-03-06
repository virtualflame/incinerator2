import { useWallet } from '@incinerator/vechain'
import { useBalance } from '@incinerator/vechain'
import { LoadingSpinner } from './LoadingSpinner'

export function WalletConnect() {
  const { connect, disconnect, isConnected, address, isLoading, error } = useWallet()
  const { balances } = useBalance()

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  return (
    <div className="p-4">
      {!isConnected ? (
        <button 
          onClick={connect}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center">
              <LoadingSpinner />
              <span className="ml-2">Connecting...</span>
            </div>
          ) : (
            'Connect Wallet'
          )}
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