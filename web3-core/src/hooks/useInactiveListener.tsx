import { useEffect } from 'react'

import { useWeb3React } from '../core/index.js'
import { normalizeChainId } from '../core/normalizers.js'

// This hook adds event listeners for wallet related events
// Makes sure that this hook is called only once
export function useInactiveListener (logout: () => void) {
  const { active, activate, connector, chainId } = useWeb3React()

  useEffect(() => {
    if (!connector || !active) {
      return
    }

    // Because 'chainChanged' event is emitted slowly, we check chainId before performing any action
    const handleChainChanged = async (_chainId: string) => {
      console.log("[Received] 'chainChanged' event with payload", _chainId)

      if (chainId === normalizeChainId(_chainId)) {
        console.log('[Ignored]')

        return
      }

      await logout()

      // TODO: Reload as recommended https://docs.metamask.io/wallet/reference/provider-api/#chainchanged
      // AWAITING: Discussion about UX
      // window.location.reload()
    }

    const handleAccountsChanged = async (accounts: Array<string>) => {
      console.log("[Received] 'accountsChanged' event with payload", accounts)

      if (accounts.length <= 0) {
        await logout()
        await activate(connector, console.error, false)
      }
    }

    let removeListeners = () => {}

    connector.getProvider().then(provider => {
      if (!provider || !provider.on || !provider.off) {
        return
      }

      provider.on('chainChanged', handleChainChanged)
      provider.on('accountsChanged', handleAccountsChanged)

      removeListeners = () => {
        provider.removeListener('chainChanged', handleChainChanged)
        provider.removeListener('accountsChanged', handleAccountsChanged)
      }
    })

    // Should not be `return removeListeners` because the value is changed inside a promise callback
    return () => {
      removeListeners()
    }

  }, [activate, logout, connector, active, chainId])
}
