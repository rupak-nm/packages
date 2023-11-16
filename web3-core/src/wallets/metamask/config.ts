import { Config, ConnectorNames } from "../../types.ts";
import { getProvider } from "./provider.ts";
import MetamaskLogo from "../../logos/MetamaskLogo.tsx";

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