import { useEffect } from 'react'

import { useWeb3React } from '../core/index.ts'

import { useDeactivator } from './useDeactivator.tsx'

export function useInactiveListener () {
  const { active, error, activate, connector } = useWeb3React()
  const logout = useDeactivator()

  useEffect(() => {
    if (!connector || !connector.on) {
      return
    }
    
    const handleChainChanged = async (chainId) => {
      console.log("Handling 'chainChanged' event with payload", chainId)

      await logout()
      await activate(connector, undefined, false)
    }

    const handleAccountsChanged = async (accounts) => {
      console.log("Handling 'accountsChanged' event with payload", accounts)

      if (accounts.length > 0) {
        await logout()
        await activate(connector, undefined, false)
      }
    }

    connector.on('chainChanged', handleChainChanged)
    connector.on('accountsChanged', handleAccountsChanged)

    return () => {
      if (connector.off) {
        connector.off('chainChanged', handleChainChanged)
        connector.off('accountsChanged', handleAccountsChanged)
      }
    }
  }, [activate, active, connector, error, logout])
}
