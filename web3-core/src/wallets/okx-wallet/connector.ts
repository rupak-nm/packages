import { OkxConnector } from './package.ts'

export const getConnector = (chainId: number) => {
  return new OkxConnector({ supportedChainIds: [chainId] })
}
