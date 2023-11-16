import { Config, ConnectorNames } from "../../types.ts";
import { getProvider } from "./provider.ts";
import BitKeepLogo from "../../logos/BitKeepLogo.tsx";

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