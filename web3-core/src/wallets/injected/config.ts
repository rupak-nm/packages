import { Config, ConnectorNames } from '../../types/enum.js'
import { getProvider } from './provider.js'
import InjectedWalletLogo from '../../logos/InjectedWalletLogo.jsx'

const isInstalled = () => !!getProvider()

const getInstallationURL = () => undefined

const Icon = InjectedWalletLogo

const name = 'Injected Web3 Wallet' // Also can say (Browser Wallet)

const connectorName = ConnectorNames.Injected

export const config: Config = {
  name,
  connectorName,
  Icon,
  isInstalled,
  getInstallationURL,
}