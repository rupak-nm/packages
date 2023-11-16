import { initializeProvider } from '@metamask/providers'
import { WindowPostMessageStream as LocalMessageDuplexStream } from '@metamask/post-message-stream'

// https://github.com/MetaMask/metamask-extension/issues/3133#issuecomment-1025641185
async function setupMetamaskForFirefox () {
  if (navigator.userAgent.includes('Firefox') && !window.ethereum) {

    // Create a stream to a remote provider:
    const metamaskStream = new LocalMessageDuplexStream({
      name: 'metamask-inpage',
      target: 'metamask-contentscript'
    })

    // this will initialize the provider and set it as window.ethereum
    initializeProvider({
      // @ts-ignore
      connectionStream: metamaskStream,
      shouldShimWeb3: true
    })
  }
}

export { setupMetamaskForFirefox }
