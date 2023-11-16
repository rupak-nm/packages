import { Config, ConnectorNames } from '../../types/enum.js'
import { getProvider } from './provider.js'
import CoinbaseLogo from '../../logos/CoinbaseLogo.jsx'

const isInstalled = () => !!getProvider()

const getInstallationURL = () => 'https://www.coinbase.com/wallet/downloads'

const Icon = CoinbaseLogo

const name = 'Coinbase Wallet'

const connectorName = ConnectorNames.CoinbaseWallet

export const config: Config = {
  name,
  connectorName,
  Icon,
  isInstalled,
  getInstallationURL,
}