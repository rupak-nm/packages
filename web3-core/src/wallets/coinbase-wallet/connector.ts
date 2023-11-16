import { CoinbaseConnector } from './package.ts'

export const getConnector = (chainId: number) => {
  return new CoinbaseConnector({ supportedChainIds: [chainId] })
}
