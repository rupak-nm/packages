import { SafeAppProvider, getNewSDK } from '../../vendor/gnosis.js'
import { AbstractConnector } from '../../vendor/web3-react.js'
import { CustomException } from '../../utils/CustomException.js'

class NoSafeContext extends Error {
  constructor () {
    super()
    this.name = this.constructor.name
    this.message = 'The app is loaded outside safe context'
  }
}

class UserRejectedRequestError extends Error {
  constructor () {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

class SafeAppConnector extends AbstractConnector {
  public readonly NAME = 'Gnosis Safe Wallet'
  private sdk;
  private safe;
  private provider;

  constructor (opts) {
    super()
    this.sdk = getNewSDK(opts)    
  }

  async activate () {
    const runningAsSafeApp = await this.isSafeApp()
    if (!runningAsSafeApp) {
      throw new NoSafeContext()
    }

    return { provider: await this.getProvider(), chainId: await this.getChainId(), account: await this.getAccount() }
  }

  async getSafeInfo () {
    if (!this.safe) {
      this.safe = await this.sdk.safe.getInfo()
    }

    return this.safe
  }

  async getProvider () {
    if (!this.provider) {
      const safe = await this.getSafeInfo()
      this.provider = new SafeAppProvider(safe, this.sdk)
    }

    return this.provider
  }

  async getChainId (): Promise<number | string> {
    const provider = await this.getProvider()

    return provider.chainId
  }

  async getAccount (): Promise<null | string> {
    const safe = await this.getSafeInfo()

    return safe.safeAddress
  }

  deactivate () {

  }

  async isSafeApp () {
    // check if we're in an iframe
    if ((window === null || window === undefined ? undefined : window.parent) === window) {
      return false
    }
    const safe = await Promise.race([
      this.getSafeInfo(),
      new Promise((resolve) => setTimeout(resolve, 300))
    ])

    return !!safe
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setupNetwork (_networkId: number): Promise<boolean> { return false }

  handleError (error: any): never {
    if (error instanceof NoSafeContext) {
      throw CustomException({
        type: 'error',
        title: 'Provider Error',
        message: error.message,
        error: error
      })
    }
  
    if (error instanceof UserRejectedRequestError) {
      throw CustomException({
        type: 'error',
        title: 'Authorization Error',
        message: 'Please authorize to access your account',
        error: error
      })
    }
  
    throw CustomException({
      type: 'error',
      title: 'Error',
      message: `${this.NAME}: ${error.message || 'Something went wrong'}`,
      error: error
    })
  }
}

export { SafeAppConnector }
