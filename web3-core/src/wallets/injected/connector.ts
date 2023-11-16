import { InjectedConnector } from './package.ts'

export const getConnector = (chainId: number) => {
  return new InjectedConnector({ supportedChainIds: [chainId] })
}
