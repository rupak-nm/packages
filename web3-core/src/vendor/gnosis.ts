import SafeAppsSDK from '@safe-global/safe-apps-sdk'

import { SafeAppProvider } from '@safe-global/safe-apps-provider'

const getNewSDK = (opts: SafeAppsSDK.Opts) => new SafeAppsSDK.default(opts)

export {
  SafeAppProvider,
  getNewSDK
}
