import {
  JsonRpcProvider,
  Web3Provider
} from '@ethersproject/providers'
import { getNodeUrl } from './rpc-url.ts'
import { POLLING_INTERVAL } from '../config/constants.ts'

// Fallback Provider
export const getProvider = (networkId) => {
  const rpcUrl = getNodeUrl(networkId)

  if (!rpcUrl) {
    console.log('RPC URL not found.')
  }

  const library = new JsonRpcProvider(rpcUrl)

  library.pollingInterval = POLLING_INTERVAL

  return library
}

// Used if wallet is connected
export const getLibrary = (provider) => {
  const library = new Web3Provider(provider)

  library.pollingInterval = POLLING_INTERVAL

  return library
}

export const getSigner = (library, account) => {
  return library.getSigner(account).connectUnchecked()
}

/**
 *
 * @param {Web3Provider | JsonRpcProvider} _library
 * @param {string} account
 * @param {number} networkId
 * @returns
 */
export const getProviderOrSigner = (_library, account, networkId) => {
  if (!networkId) {
    return
  }

  let library = _library

  if (!library) {
    library = getProvider(networkId)
  }

  if (!account) {
    return library
  }

  return getSigner(library, account)
}
