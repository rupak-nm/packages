import { useCallback } from 'react'

import { UnsupportedChainIdError, useWeb3React } from '../core/index.ts'

import { NetworkNames } from '../config/chains.ts'
import { ConfigMap } from '../config/wallets.ts'

import { getConnectorByName } from '../utils/connectors.ts'
import { CustomException } from '../utils/CustomException.ts'
import { walletTrackerLS } from '../utils/local-storage.ts'

import { ConnectorNames } from '../types.ts'

const activateWithConnector = async (activate, connector) => {
  try {
    await activate(connector, undefined, true)

    return {
      activated: true,
      error: null
    }
  } catch (error) {
    return {
      activated: false,
      error
    }
  }
}

export function useActivator () {
  const { activate } = useWeb3React()

  const login = useCallback(
    async (networkId: number, connectorName: ConnectorNames) => {
      const connector = await getConnectorByName(connectorName, networkId)
      const config = ConfigMap[connectorName]

      if (!connector || !config) {
        console.info('Invalid connector', connectorName, networkId)

        return
      }

      try {
        let activationData = await activateWithConnector(activate, connector)

        const error = activationData.error

        if (activationData.activated) {
          walletTrackerLS.trackConnector(connectorName)

          return
        }

        if (error && !(error instanceof UnsupportedChainIdError)) {
          // Error handler throws an error object with more details, if it's a known error.
          connector.handleError(error)

          // Fallback exception
          throw CustomException({
            type: 'error',
            title: 'Error',
            message: 'Something went wrong',
            error: error
          })
        }

        // if chain is not supported, add chain to the wallet
        const isSuccess = await connector.setupNetwork(networkId)

        if (!isSuccess) {
          throw CustomException({
            type: 'error',
            title: 'Wrong network',
            message: `Please switch to ${NetworkNames[networkId]} in your ${config.name}`,
            error: error
          })
        }

        activationData = await activateWithConnector(activate, connector)

        if (activationData.activated) {
          walletTrackerLS.trackConnector(connectorName)

          return
        }

        throw activationData.error

      } catch (error) {
        walletTrackerLS.clear()
        window.alert(error.message)
        console.error(error);
      }
    },
    [activate]
  )

  return login
}
