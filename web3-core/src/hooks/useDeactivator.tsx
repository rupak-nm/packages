import {
  useCallback,
  useEffect
} from 'react'

import { useWeb3React } from '../core/index.ts'

import { walletTrackerLS } from '../utils/local-storage.ts'

export function useDeactivator () {
  const { deactivate, connector } = useWeb3React()

  useEffect(() => {
    if (!connector) {
      return
    }

    connector?.addListener('Web3ReactDeactivate', walletTrackerLS.clear)

    return () => {
      connector?.removeListener('Web3ReactDeactivate', walletTrackerLS.clear)
    }
  }, [connector])

  const logout = useCallback(() => {
    walletTrackerLS.clear()
    deactivate()
  }, [deactivate])

  return logout
}
