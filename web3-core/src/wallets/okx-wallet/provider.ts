export const getProvider = () => {
  if (typeof window === 'undefined' || !window || !window.okxwallet) {
    return undefined
  }

  if (window.okxwallet) {
    return window.okxwallet
  }

  return undefined
}