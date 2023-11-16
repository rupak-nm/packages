import { Config, ConnectorNames } from '../types/enum.js'
import { config as binanceWallet } from './binance-wallet/config.js'
import { config as bitkeepWallet } from './bitkeep-wallet/config.js'
import { config as coinbaseWallet } from './coinbase-wallet/config.js'
import { config as gnosisWallet } from './gnosis-safe/config.js'
import { config as injectedWallet } from './injected/config.js'
import { config as metamaskWallet } from './metamask/config.js'
import { config as okxWallet } from './okx-wallet/config.js'

const ConfigMap = {
  [ConnectorNames.BSC]: binanceWallet,
  [ConnectorNames.BitKeepWallet]: bitkeepWallet,
  [ConnectorNames.CoinbaseWallet]: coinbaseWallet,
  [ConnectorNames.Gnosis]: gnosisWallet,
  [ConnectorNames.Injected]: injectedWallet,
  [ConnectorNames.MetaMask]: metamaskWallet,
  [ConnectorNames.OKXWallet]: okxWallet,
}

export const getWallets = (connectorNames: ConnectorNames[]): ((Config & {id: number}) | undefined)[]  => {
  const result = connectorNames.map((connectorName, id) => {
    const config = ConfigMap[connectorName]
    
    if (!config) return
    
    return {
      id,
      ...config,
    }
  }).filter(Boolean)

  return result
}
