import { Config, ConnectorNames } from "../../types.ts";
import { getProvider } from "./provider.ts";
import BinanceWalletLogo from "../../logos/BinanceWalletLogo.tsx";
import { isMobile } from "../../utils/userAgent.ts";

const isInstalled = () => !!getProvider()

const getInstallationURL = () => {
  if (isMobile()) {
    return
  }
   
  return 'https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp'
}

const Icon = BinanceWalletLogo

const name = 'Binance Chain Wallet'

const connectorName = ConnectorNames.BSC

export const config: Config = {
  name,
  connectorName,
  Icon,
  isInstalled,
  getInstallationURL,
}