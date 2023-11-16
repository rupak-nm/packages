import { rpcUrls } from '../config/rpcUrls.js'

const getRandomIntInclusive = (min, max) => {
  const randomBuffer = new Uint32Array(1)
  // @ts-ignore
  const crypto = window.crypto || window.msCrypto

  crypto.getRandomValues(randomBuffer)

  const randomNumber = randomBuffer[0] / (0xffffffff + 1)

  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(randomNumber * (max - min + 1)) + min
}

const getOne = (...opts) => {
  return opts[getRandomIntInclusive(0, opts.length - 1)]
}

// Used if user's wallet is not connected  or while using walletconnect
export const getNodeUrl = (networkId) => {
  const nodes = rpcUrls[networkId]

  return getOne(...nodes)
}
