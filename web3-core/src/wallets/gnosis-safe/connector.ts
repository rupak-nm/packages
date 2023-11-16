import { SafeAppConnector } from './package.ts'

export const getConnector = (chainId: number) => {
  return new SafeAppConnector({ supportedChainIds: [chainId] })
}
