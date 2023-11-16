import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { AddressZero } from '@ethersproject/constants'
import { Web3ReactProvider, useWeb3React } from './core/index.ts'

import { useActivator } from './hooks/useActivator.tsx'
import { useDeactivator } from './hooks/useDeactivator.tsx'
import { useEagerConnect } from './hooks/useEagerConnect.tsx'
import { getLibrary, getProviderOrSigner } from './utils/web3.ts'
import { setupMetamaskForFirefox } from './wallets/metamask-firefox.ts'
import { getWallets } from './config/wallets.ts'
import { ConnectorNames } from './types.ts'
import { registerToken } from './utils/register-token.ts'
import { useInactiveListener } from './hooks/useInactiveListener.tsx'

const Context = createContext<{
  isActive: boolean;
  logout: () => void;
  openPopup: () => void;
  login: (networkId: number, connectorName: ConnectorNames) => Promise<void>;
  signerOrProvider?: any;

  connectedChainId?: number;
  selectedChainId?: number;
  account?: string;
  registerToken: (tokenAddress: string, tokenSymbol: string, tokenDecimals: number, tokenImage?: string) => Promise<any>
}>({
  isActive: false,
  logout: () => { },
  openPopup: () => { },
  login: async () => { },
  registerToken: async () => false,
  signerOrProvider: null,

  connectedChainId: undefined,
  selectedChainId: undefined,
  account: undefined,
})

export function useConnectWallet() {
  const context = useContext(Context)

  if (!context) {
    console.error('Use useConnectWallet inside the ConnectWalletProvider')
  }

  return context
}

interface ProviderProps {
  children?: ReactNode;
  selectedChainId: number;
  Popup: React.FC<{
    wallets: any[];
    isOpen: boolean;
    setIsOpen: any;
    isConnecting: boolean;
    setIsConnecting: any;
  }>;
  connectors: any[]
}

function ConnectWalletProvider({ children, selectedChainId, Popup, connectors }: ProviderProps) {
  const { active, chainId: connectedChainId, account, library } = useWeb3React()
  const login = useActivator()
  const logout = useDeactivator()

  useEagerConnect(selectedChainId)
  useInactiveListener()

  useEffect(() => {
    setupMetamaskForFirefox()
  }, [])
  useEffect(() => {
    if (active && connectedChainId !== selectedChainId) {
      logout()
    }
  }, [active, connectedChainId, logout, selectedChainId])

  const signerOrProvider = useMemo(() => {
    let signerOrProvider = null

    if (account && connectedChainId && connectedChainId === selectedChainId) {
      signerOrProvider = getProviderOrSigner(library, account || AddressZero, selectedChainId)
    }

    return signerOrProvider
  }, [account, connectedChainId, library, selectedChainId])

  // Popup start
  const [isOpen, setIsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsConnecting(false)
    }

  }, [isOpen])

  useEffect(() => {
    if (active) {
      setIsConnecting(false)
      setIsOpen(false)
    }
  }, [active])

  const wallets = useMemo(() => getWallets(connectors), [connectors])
  // Popup end

  const value = useMemo(() => ({
    isActive: active,
    connectedChainId,
    selectedChainId,
    account,
    logout,
    login,
    registerToken: (a, b, c, d) => registerToken(a, b, c, d, signerOrProvider),
    signerOrProvider,
    openPopup: function () {
      if (active) {
        logout()
      }

      setIsOpen(true)
    }
  }), [active, login, logout, signerOrProvider, selectedChainId, connectedChainId, account])

  return (
    <Context.Provider value={value}>
      {children}

      <Popup
        wallets={wallets}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isConnecting={isConnecting}
        setIsConnecting={setIsConnecting}
      />
    </Context.Provider>
  )
}

const ConnectWalletRoot = ({ children, selectedChainId, Popup, connectors }: ProviderProps) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ConnectWalletProvider selectedChainId={selectedChainId} Popup={Popup} connectors={connectors}>
        {children}
      </ConnectWalletProvider>
    </Web3ReactProvider>
  )
}

export const ConnectWallet = {
  Root: ConnectWalletRoot
}