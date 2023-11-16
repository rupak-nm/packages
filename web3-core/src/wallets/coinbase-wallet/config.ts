import { Config, ConnectorNames } from "../../types.ts";
import { getProvider } from "./provider.ts";
import CoinbaseLogo from "../../logos/CoinbaseLogo.tsx";

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