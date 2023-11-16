import { BscConnector } from './package.ts'

export const getConnector = (chainId) => {
  return new BscConnector({ supportedChainIds: [chainId] })
}
