import {
  useCallback,
  useEffect
} from 'react'
import {ConnectorEvent} from '@web3-react/types'

import { useWeb3React } from '../core/index.js'

import { walletTrackerLS } from '../utils/local-storage.js'

export function useDeactivator () {
  const { deactivate, connector } = useWeb3React()

  useEffect(() => {
    if (!connector) {
      return
    }

    connector.on(ConnectorEvent.Deactivate, walletTrackerLS.clear)
    
    return () => {
      connector.off(ConnectorEvent.Deactivate, walletTrackerLS.clear)
    }
  }, [connector])

  const logout = useCallback(() => {
    walletTrackerLS.clear()
    deactivate()
  }, [deactivate])

  return logout
}
