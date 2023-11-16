import { Config, ConnectorNames } from '../../types/enum.js'
import { getProvider } from './provider.js'
import OKXWalletLogo from '../../logos/OKXWalletLogo.jsx'

const isInstalled = () => !!getProvider()

const getInstallationURL = () => 'https://www.okx.com/download'

const Icon = OKXWalletLogo

const name = 'OKX Wallet'

const connectorName = ConnectorNames.OKXWallet

export const config: Config = {
  name,
  connectorName,
  Icon,
  isInstalled,
  getInstallationURL,
}