import { BitKeepConnector } from './package.ts'

export const getConnector = (chainId: number) => {
  return new BitKeepConnector({ supportedChainIds: [chainId] })
}
