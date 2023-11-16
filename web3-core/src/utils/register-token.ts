/**
 * Prompt the user to add a custom token to metamask
 * returns true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string,
  provider: any,
): Promise<boolean> => {
  try {
    if (!provider || !provider.request || typeof provider.request !== 'function') {
      return false
    }
  
    await provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage
        }
      }
    })

    return true
  } catch (error) {
    return false
  }
}
