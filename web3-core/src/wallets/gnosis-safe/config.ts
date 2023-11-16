import { Config, ConnectorNames } from '../../types/enum.js'
import GnosisSafeLogo from '../../logos/GnosisSafeLogo.jsx'
import { isIFrame } from '../../utils/iframe.js'

const isInstalled = () => !!isIFrame()

const getInstallationURL = () => undefined

const Icon = GnosisSafeLogo

const name = 'Gnosis Wallet'

const connectorName = ConnectorNames.Gnosis

export const config: Config = {
  name,
  connectorName,
  Icon,
  isInstalled,
  getInstallationURL,
}