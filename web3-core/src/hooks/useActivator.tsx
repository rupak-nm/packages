import { useCallback } from 'react'

import { UnsupportedChainIdError, useWeb3React } from '../core/index.js'

import { NetworkNames } from '../config/chains.js'

import { getConnectorByName } from '../wallets/connectors.js'
import { CustomException } from '../utils/CustomException.js'
import { walletTrackerLS } from '../utils/local-storage.js'

import { ConnectorNames } from '../types/enum.js'

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
      if (!networkId) {
        console.log('Please select a network') // alert is not called when the document is sandboxed
        window.alert('Please select a network')

        return
      }

      const connector = await getConnectorByName(connectorName, networkId)

      if (!connector) {
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
          // Error handler throws an error object with more details
          connector.handleError(error)
        }

        // if chain is not supported, add chain to the wallet
        const isSuccess = await connector.setupNetwork(networkId)

        if (!isSuccess) {
          throw CustomException({
            type: 'error',
            title: 'Wrong network',
            message: `Please switch to ${NetworkNames[networkId]} in your ${connector.NAME}`,
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
        console.log(error.message) // alert is not called when the document is sandboxed
        window.alert(error.message)
        console.error(error);
        console.error(error.error);
  
        // throw CustomException({
        //   type: 'error',
        //   title: 'Error',
        //   message: 'Something went wrong',
        //   error: error
        // })
      }
    },
    [activate]
  )

  return login
}
