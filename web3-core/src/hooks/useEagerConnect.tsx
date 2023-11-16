import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { ConnectorNames } from '../types.ts'
import { walletTrackerLS } from '../utils/local-storage.ts'
import { useActivator } from './useActivator.tsx'

const _binanceChainListener = async () =>
  new Promise((resolve) =>
    Object.defineProperty(window, 'BinanceChain', {
      get () {
        return this.bsc
      },
      set (bsc) {
        this.bsc = bsc

        resolve(null)
      }
    })
  )

export const useEagerConnect = (networkId) => {
  // Makes sure that this hook only runs once
  const [tried, setTried] = useState(false)
  const login = useActivator()

  const autoConnect = useCallback((connectorName: ConnectorNames) => {
    setTried(true)

    if (connectorName === ConnectorNames.BSC) {
      const isConnectorBinanceChain = connectorName === ConnectorNames.BSC
      const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')
      
      if (isConnectorBinanceChain && !isBinanceChainDefined) {
        // window.BinanceChain might not be immediately available on page load
        // Therefore, wait for window.BinanceChain to be available
        _binanceChainListener()
          .then(() => login(networkId, connectorName))
          .catch(() => console.log('Could not auto connect'))

        return
      }
    }

    // added a slight delay in executing activate fx in connecting the wallet to prevent stale error issue
    setTimeout(() => {
      login(networkId, connectorName)
        .catch(() => console.log('Could not auto connect'))
    }, 500)
  }, [login, networkId])

  useEffect(() => {
    if (tried || !networkId) {
      return
    }

    const connectorName = walletTrackerLS.getConnector()

    if (!connectorName) {
      return
    }
    
    // @ts-ignore
    autoConnect(connectorName)
  }, [autoConnect, networkId, tried])
}
