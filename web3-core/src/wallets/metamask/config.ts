import { Config, ConnectorNames } from '../../types/enum.js'
import { getProvider } from './provider.js'
import MetamaskLogo from '../../logos/MetamaskLogo.jsx'

const isInstalled = () => !!getProvider()

const getInstallationURL = () => `https://metamask.app.link/dapp/${typeof window === 'undefined' ? 'ethereum.neptunemutual.net' : window.location.host}`

const Icon = MetamaskLogo

const name = 'MetaMask'

const connectorName = ConnectorNames.MetaMask

export const config: Config = {
  name,
  connectorName,
  Icon,
  isInstalled,
  getInstallationURL,
}