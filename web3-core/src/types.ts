enum ChainId {
  Invalid = 0,
  Ethereum = 1,
  BSC = 56,
  BaseGoerli = 84531,
  Mumbai = 80001,
  Fuji = 43113,
  Arbitrum = 42161, // Arbitrum One
}

enum ConnectorNames {
  Injected = 'injected',
  MetaMask = 'metamask',
  OKXWallet = 'okx-wallet',
  CoinbaseWallet = 'coinbase-wallet',
  BitKeepWallet = 'bitkeep-wallet',
  Gnosis = 'gnosis',
  BSC = 'bsc'
}

interface Config {
  name: string;
  connectorName: ConnectorNames;
  Icon: any;
  isInstalled: () => boolean;
  getInstallationURL: () => string;
}

export { ChainId, ConnectorNames, Config}
