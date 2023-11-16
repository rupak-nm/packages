export const getProvider = () => {
  if (typeof window === 'undefined' || !window || !window.ethereum) {
    return undefined
  }

  if (window.ethereum.providerMap && window.ethereum.providerMap.get('CoinbaseWallet')) {
    return window.ethereum.providerMap.get('CoinbaseWallet')
  }

  if (window.ethereum.isCoinbaseWallet) {
    return window.ethereum
  }

  if (window.coinbaseWalletExtension) {
    return window.coinbaseWalletExtension
  }

  return undefined
}
