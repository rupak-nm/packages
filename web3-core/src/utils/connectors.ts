import { ConnectorNames } from '../types.ts'
import { BscConnector } from '../wallets/binance-wallet/package.ts';
import { BitKeepConnector } from '../wallets/bitkeep-wallet/package.ts';
import { CoinbaseConnector } from '../wallets/coinbase-wallet/package.ts';
import { SafeAppConnector } from '../wallets/gnosis-safe/package.ts';
import { InjectedConnector } from '../wallets/injected/package.ts';
import { MetamaskConnector } from '../wallets/metamask/package.ts';
import { OkxConnector } from '../wallets/okx-wallet/package.ts';

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
    case ConnectorNames.Injected: {
      const module = await import('../wallets/injected/connector.ts')
      const connector = module.getConnector(chainId)

      return connector
    }

    case ConnectorNames.MetaMask: {
      const module = await import('../wallets/metamask/connector.ts')
      const connector = module.getConnector(chainId)

      return connector
    }

    case ConnectorNames.CoinbaseWallet: {
      const module = await import('../wallets/coinbase-wallet/connector.ts')
      const connector = module.getConnector(chainId)

      return connector
    }

    case ConnectorNames.OKXWallet: {
      const module = await import('../wallets/okx-wallet/connector.ts')
      const connector = module.getConnector(chainId)

      return connector
    }

    case ConnectorNames.BitKeepWallet: {
      const module = await import('../wallets/bitkeep-wallet/connector.ts')
      const connector = module.getConnector(chainId)

      return connector
    }

    case ConnectorNames.BSC: {
      const module = await import('../wallets/binance-wallet/connector.ts')
      const connector = module.getConnector(chainId)

      return connector
    }

    case ConnectorNames.Gnosis: {
      const module = await import('../wallets/gnosis-safe/connector.ts')
      const connector = module.getConnector(chainId)

      return connector
    }

    default:
      console.log('Invalid Connector', name, chainId);
    }

  return null
}
