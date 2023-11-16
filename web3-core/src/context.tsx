import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { AddressZero } from '@ethersproject/constants'
import { Web3ReactProvider, useWeb3React } from './core/index.js'

import { useActivator } from './hooks/useActivator.jsx'
import { useDeactivator } from './hooks/useDeactivator.jsx'
import { useEagerConnect } from './hooks/useEagerConnect.jsx'
import { getLibrary, getProviderOrSigner } from './utils/web3.js'
import { setupMetamaskForFirefox } from './wallets/metamask-firefox.js'
import { getWallets } from './wallets/wallets.js'
import { ConnectorNames } from './types/enum.js'
import { useInactiveListener } from './hooks/useInactiveListener.jsx'

const Context = createContext<{
  isActive: boolean;
  logout: () => void;
  openPopup: () => void;
  login: (networkId: number, connectorName: ConnectorNames) => Promise<void>;
  signerOrProvider?: any;

  connectedChainId?: number;
  selectedChainId: number | null;
  setSelectedChainId: React.Dispatch<React.SetStateAction<number | null>>;
  account: string | null | undefined;
}>({
  isActive: false,
  logout: () => { },
  openPopup: () => { },
  login: async () => { },
  signerOrProvider: null,

  connectedChainId: undefined,
  selectedChainId: null,
  setSelectedChainId: () => {},
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
  Popup: React.FC<{
    wallets: any[];
    isOpen: boolean;
    setIsOpen: any;
  }>;
  connectors: any[]
}

function ConnectWalletProvider({ children, Popup, connectors }: ProviderProps) {
  const { active, chainId: connectedChainId, account, library } = useWeb3React()
  const login = useActivator()
  const logout = useDeactivator()

  const [selectedChainId, setSelectedChainId] = useState<number | null>(null)

  useEagerConnect(selectedChainId)
  useInactiveListener(logout)

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
  const wallets = useMemo(() => getWallets(connectors), [connectors])
  // Popup end

  const value = useMemo(() => ({
    isActive: active,
    connectedChainId,
    selectedChainId,
    setSelectedChainId,
    account,
    logout,
    login,
    signerOrProvider,
    openPopup: function () {
      if (active) {
        logout()
      }

      setIsOpen(true)
    }
  }), [account, active, connectedChainId, login, logout, selectedChainId, signerOrProvider])

  return (
    <Context.Provider value={value}>
      {children}

      <Popup
        wallets={wallets}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </Context.Provider>
  )
}

const ConnectWalletRoot = ({ children, Popup, connectors }: ProviderProps) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ConnectWalletProvider Popup={Popup} connectors={connectors}>
        {children}
      </ConnectWalletProvider>
    </Web3ReactProvider>
  )
}

export const ConnectWallet = {
  Root: ConnectWalletRoot
}