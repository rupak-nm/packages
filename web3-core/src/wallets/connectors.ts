import { ConnectorNames } from '../types/enum.js'
import { BscConnector } from './binance-wallet/package.js'
import { BitKeepConnector } from './bitkeep-wallet/package.js'
import { CoinbaseConnector } from './coinbase-wallet/package.js'
import { SafeAppConnector } from './gnosis-safe/package.js'
import { InjectedConnector } from './injected/package.js'
import { MetamaskConnector } from './metamask/package.js'
import { OkxConnector } from './okx-wallet/package.js'

/**
 * Asynchronously load the selected connector only
 */
// export function getConnectorByName(name: ConnectorNames.BSC, chainId: number): Promise<BscConnector>;

// export function getConnectorByName(name: ConnectorNames.BitKeepWallet, chainId: number): Promise<BitKeepConnector>;

// export function getConnectorByName(name: ConnectorNames.CoinbaseWallet, chainId: number): Promise<CoinbaseConnector>;

// export function getConnectorByName(name: ConnectorNames.Injected, chainId: number): Promise<InjectedConnector>;

// export function getConnectorByName(name: ConnectorNames.MetaMask, chainId: number): Promise<MetamaskConnector>;

// export function getConnectorByName(name: ConnectorNames.Gnosis, chainId: number): Promise<SafeAppConnector>;

// export function getConnectorByName(name: ConnectorNames.OKXWallet, chainId: number): Promise<OkxConnector>;

export async function getConnectorByName(name: ConnectorNames, chainId: number): Promise<BscConnector | BitKeepConnector | CoinbaseConnector | InjectedConnector | MetamaskConnector | SafeAppConnector | OkxConnector | null> {
  if (!name) {
    return null
  }
  
  switch (name) {
    case ConnectorNames.BSC: {
      const {BscConnector} = await import('./binance-wallet/package.js')
      const connector = new BscConnector({ supportedChainIds: [chainId] })
      
      return connector
    }
    
    case ConnectorNames.BitKeepWallet: {
      const {BitKeepConnector} = await import('./bitkeep-wallet/package.js')
      const connector = new BitKeepConnector({ supportedChainIds: [chainId] })
      
      return connector
    }
    
    case ConnectorNames.CoinbaseWallet: {
      const {CoinbaseConnector} = await import('./coinbase-wallet/package.js')
      const connector = new CoinbaseConnector({ supportedChainIds: [chainId] })
      
      return connector
    }
    
    case ConnectorNames.Injected: {
      const {InjectedConnector} = await import('./injected/package.js')
      const connector = new InjectedConnector({ supportedChainIds: [chainId] })
      
      return connector
    }
    
    case ConnectorNames.MetaMask: {
      const {MetamaskConnector} = await import('./metamask/package.js')
      const connector = new MetamaskConnector({ supportedChainIds: [chainId] })
      
      return connector
    }
    case ConnectorNames.OKXWallet: {
      const {OkxConnector} = await import('./okx-wallet/package.js')
      const connector = new OkxConnector({ supportedChainIds: [chainId] })
      
      return connector
    }
    

    case ConnectorNames.Gnosis: {
      const {SafeAppConnector} = await import('./gnosis-safe/package.js')
      const connector = new SafeAppConnector({ supportedChainIds: [chainId] })

      return connector
    }

    default:
      console.log('Invalid Connector', name, chainId);
    }

  return null
}
