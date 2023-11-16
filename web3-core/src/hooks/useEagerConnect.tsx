import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { ConnectorNames } from '../types/enum.js'
import { useActivator } from './useActivator.jsx'

import { walletTrackerLS } from '../utils/local-storage.js'
import { delay } from '../utils/delay.js'

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

// This hook tries to connect to last used wallet on mount
// Makes sure that this hook is called only once
export const useEagerConnect = (networkId: number | null) => {
  const [tried, setTried] = useState(false)
  const login = useActivator()

  const autoConnect = useCallback(async (connectorName: ConnectorNames) => {
    if (!networkId) {
      return
    }
    
    if (connectorName === ConnectorNames.MetaMask) {
      try {
        // @ts-ignore
        const isUnlocked = await window.ethereum._metamask.isUnlocked()
        if (!isUnlocked) {
          return
        }
        if (!isUnlocked) {
          return
        }
      } catch (error) { /* swallow */ }
    }
    
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

    // delay to avoid stale error issue
    // https://github.com/Uniswap/web3-react/issues/78
    await delay(500)

    login(networkId, connectorName)
      .catch(() => console.log('Could not auto connect'))
  }, [login, networkId])

  useEffect(() => {
    if (tried) {
      return
    }

    const connectorName = walletTrackerLS.getConnector()

    if (!connectorName) {
      setTried(true)

      return
    }
    
    // @ts-ignore
    autoConnect(connectorName)
  }, [autoConnect, tried])
}
