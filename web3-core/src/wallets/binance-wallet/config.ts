import { Config, ConnectorNames } from '../../types/enum.js'
import { getProvider } from './provider.js'
import BinanceWalletLogo from '../../logos/BinanceWalletLogo.jsx'
import { isMobile } from '../../utils/userAgent.js'

const isInstalled = () => !!getProvider()

const getInstallationURL = () => {
  if (isMobile()) {
    return
  }
   
  return 'https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp'
}

const Icon = BinanceWalletLogo

const name = 'Binance Chain Wallet'

const connectorName = ConnectorNames.BSC

export const config: Config = {
  name,
  connectorName,
  Icon,
  isInstalled,
  getInstallationURL,
}