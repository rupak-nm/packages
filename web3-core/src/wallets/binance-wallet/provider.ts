export const getProvider = () => {
  if (typeof window === 'undefined' || !window || !window.BinanceChain) {
    return undefined
  }

  if (window.BinanceChain) {
    return window.BinanceChain
  }

  return undefined

}