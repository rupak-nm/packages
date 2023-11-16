export const getProvider = () => {
  if (typeof window === 'undefined' || !window || !window.ethereum) {
    return undefined
  }

  if (
    (window.ethereum.providerMap &&
      !window.ethereum.providerMap.get('MetaMask') &&
      !window.ethereum.providerMap.get('CoinbaseWallet')) ||
    (!window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet)
  ) {
    return window.ethereum
  }

  return undefined
}