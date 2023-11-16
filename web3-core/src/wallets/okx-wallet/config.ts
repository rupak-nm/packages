import { Config, ConnectorNames } from "../../types.ts";
import { getProvider } from "./provider.ts";
import OKXWalletLogo from "../../logos/OKXWalletLogo.tsx";

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