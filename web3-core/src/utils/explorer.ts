import { explorer } from '../config/chains.js'

export const getTxLink = (networkId: number | string, tx) => {
  return (explorer.tx[networkId] || '').replace('%s', tx.hash)
}

export const getAddressLink = (networkId: number | string, address) => {
  return (explorer.address[networkId] || '').replace('%s', address)
}

export const getBlockLink = (networkId: number | string, blockNumber) => {
  return (explorer.block[networkId] || '').replace('%s', blockNumber)
}

export const getTokenLink = (networkId: number | string, tokenAddress, userAddress = '') => {
  if (!tokenAddress) {
    return '#'
  }
  
  let appendString = tokenAddress
  
  if (userAddress) {
    appendString += `'?a=${userAddress}`
  }

  return (explorer.token[networkId] || '').replace('%s', appendString)
}
