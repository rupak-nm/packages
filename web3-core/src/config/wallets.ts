import { Config, ConnectorNames } from '../types.ts'
import { config as binanceWallet } from '../wallets/binance-wallet/config.ts'
import { config as bitkeepWallet } from '../wallets/bitkeep-wallet/config.ts'
import { config as coinbaseWallet } from '../wallets/coinbase-wallet/config.ts'
import { config as gnosisWallet } from '../wallets/gnosis-safe/config.ts'
import { config as injectedWallet } from '../wallets/injected/config.ts'
import { config as metamaskWallet } from '../wallets/metamask/config.ts'
import { config as okxWallet } from '../wallets/okx-wallet/config.ts'

export const ConfigMap = {
  [ConnectorNames.BSC]: binanceWallet,
  [ConnectorNames.BitKeepWallet]: bitkeepWallet,
  [ConnectorNames.CoinbaseWallet]: coinbaseWallet,
  [ConnectorNames.Gnosis]: gnosisWallet,
  [ConnectorNames.Injected]: injectedWallet,
  [ConnectorNames.MetaMask]: metamaskWallet,
  [ConnectorNames.OKXWallet]: okxWallet,
}

export const getWallets = (connectorNames: ConnectorNames[]): (Config & {id: number})[] => {
  return connectorNames.map((connectorName, id) => {
    const config = ConfigMap[connectorName]
    
    if (!config) return
    
    return {
      id,
      ...config,
    }
  }).filter(Boolean)
}
