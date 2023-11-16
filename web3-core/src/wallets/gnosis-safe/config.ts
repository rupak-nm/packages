import { Config, ConnectorNames } from "../../types.ts";
import GnosisSafeLogo from "../../logos/GnosisSafeLogo.tsx";
import { isIFrame } from "../../utils/iframe.ts";

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