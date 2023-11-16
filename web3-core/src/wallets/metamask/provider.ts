export const getProvider = () => {
  if (typeof window === 'undefined' || !window || !window.ethereum) {
    return undefined
  }

  if (window.ethereum.providerMap && window.ethereum.providerMap.get('MetaMask')) {
    return window.ethereum.providerMap.get('MetaMask')
  }

  if (window.ethereum.isMetaMask) {
    return window.ethereum
  }

  return undefined
}