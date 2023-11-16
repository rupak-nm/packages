export const getProvider = () => {
  if (typeof window === 'undefined' || !window) {
    return undefined
  }

  if (window.bitkeep && window.bitkeep.ethereum) {
    return window.bitkeep.ethereum
  }

  return undefined
}