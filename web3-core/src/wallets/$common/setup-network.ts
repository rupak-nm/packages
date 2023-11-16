import { chains } from '../../config/chains.js'

/**
 * @param {number} networkId
 */
function getNetworkParams (networkId) {
  return chains.find((x) => x.chainId === `0x${networkId.toString(16)}`)
}

/**
 * @param {number} networkId
 */
async function addChain (provider, networkId) {
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [getNetworkParams(networkId)]
    })

    return true
  } catch (addError) {
    // handle "add" error
    console.error(addError)
  }

  return false
}

/**
 * @param {number} networkId
 */
export async function commonSetupNetwork (provider, networkId) {
  try {
    const chainParams = getNetworkParams(networkId)

    if (!chainParams) {
      throw Error(`No configuration found for network: ${networkId}`);
    }

    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainParams.chainId }]
    })

    return true
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      return addChain(provider, networkId)
    }
    // handle other "switch" errors
    console.error(switchError)
  }

  return false
}
