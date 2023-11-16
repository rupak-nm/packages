import { Config, ConnectorNames } from '../../types/enum.js'
import { getProvider } from './provider.js'
import BitKeepLogo from '../../logos/BitKeepLogo.jsx'

const isInstalled = () => !!getProvider()

const getInstallationURL = () => 'https://bitkeep.com/en/download?type=2'

const Icon = BitKeepLogo

const name = 'BitKeep Wallet'

const connectorName = ConnectorNames.BitKeepWallet

export const config: Config = {
  name,
  connectorName,
  Icon,
  isInstalled,
  getInstallationURL,
}