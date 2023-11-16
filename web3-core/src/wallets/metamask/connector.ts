import { MetamaskConnector } from './package.ts'

export const getConnector = (chainId: number) => {
  return new MetamaskConnector({ supportedChainIds: [chainId] })
}
