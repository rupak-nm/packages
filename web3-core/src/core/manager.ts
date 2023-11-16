import { legacy_createStore as createStore } from 'redux'

import { ConnectorUpdate, ConnectorEvent } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { warning } from '../vendor/tiny-warning.js'

import { normalizeChainId, normalizeAccount } from './normalizers.js'

class StaleConnectorError extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
  }
}

export class UnsupportedChainIdError extends Error {
  public constructor(
    unsupportedChainId: number,
    supportedChainIds?: readonly number[]
  ) {
    super();
    this.name = this.constructor.name;
    this.message = `Unsupported chain id: ${unsupportedChainId}. Supported chain ids are: ${supportedChainIds}.`;
  }
}

interface Web3ReactManagerState {
  connector?: AbstractConnector;
  provider?: any;
  chainId?: number;
  account?: null | string;

  onError?: (error: Error) => void;

  error?: Error;
}

enum ActionType {
  ACTIVATE_CONNECTOR,
  UPDATE,
  UPDATE_FROM_ERROR,
  ERROR,
  ERROR_FROM_ACTIVATION,
  DEACTIVATE_CONNECTOR,
}

interface Action {
  type: ActionType;
  payload?: any;
}

function reducer(
  state: Web3ReactManagerState = {},
  { type, payload }: Action
): Web3ReactManagerState {
  switch (type) {
    case ActionType.ACTIVATE_CONNECTOR: {
      const { connector, provider, chainId, account, onError } = payload;

      return { connector, provider, chainId, account, onError };
    }
    case ActionType.UPDATE: {
      const { provider, chainId, account } = payload;

      return {
        ...state,
        ...(provider === undefined ? {} : { provider }),
        ...(chainId === undefined ? {} : { chainId }),
        ...(account === undefined ? {} : { account }),
      };
    }
    case ActionType.UPDATE_FROM_ERROR: {
      const { provider, chainId, account } = payload;

      return {
        ...state,
        ...(provider === undefined ? {} : { provider }),
        ...(chainId === undefined ? {} : { chainId }),
        ...(account === undefined ? {} : { account }),
        error: undefined,
      };
    }
    case ActionType.ERROR: {
      const { error } = payload;
      const { connector, onError } = state;

      return {
        connector,
        error,
        onError,
      };
    }
    case ActionType.ERROR_FROM_ACTIVATION: {
      const { connector, error } = payload;

      return {
        connector,
        error,
      };
    }
    case ActionType.DEACTIVATE_CONNECTOR: {
      return {};
    }
  }
}

async function augmentConnectorUpdate(
  connector: AbstractConnector,
  update: ConnectorUpdate
): Promise<ConnectorUpdate<number>> {
  const provider =
    update.provider === undefined
      ? await connector.getProvider()
      : update.provider;
  const [_chainId, _account] = (await Promise.all([
    update.chainId === undefined ? connector.getChainId() : update.chainId,
    update.account === undefined ? connector.getAccount() : update.account,
  ])) as [
    Required<ConnectorUpdate>["chainId"],
    Required<ConnectorUpdate>["account"]
  ];

  const chainId = normalizeChainId(_chainId);
  if (
    !!connector.supportedChainIds &&
    !connector.supportedChainIds.includes(chainId)
  ) {
    throw new UnsupportedChainIdError(chainId, connector.supportedChainIds);
  }
  const account = _account === null ? _account : normalizeAccount(_account);

  return { provider, chainId, account };
}

// Custom code

export class Manager {
  private updateBusterValue = 0;
  private previousConnector?: any = null;
  private unsubscribe = () => {};

  constructor(private store = createStore(reducer)) {
    this.handleMount();
  }

  getStore = () => this.store;

  activate = async (
    connector: AbstractConnector,
    onError?: (error: Error) => void,
    throwErrors: boolean = false
  ): Promise<void> => {
    const updateBusterInitial = this.updateBusterValue;

    let activated = false;

    try {
      const update = await connector
        .activate()
        .then((update): ConnectorUpdate => {
          activated = true;

          return update;
        });

      const augmentedUpdate = await augmentConnectorUpdate(connector, update);

      if (this.updateBusterValue > updateBusterInitial) {
        throw new StaleConnectorError();
      }

      this.store.dispatch({
        type: ActionType.ACTIVATE_CONNECTOR,
        payload: { connector, ...augmentedUpdate, onError },
      });
    } catch (error) {
      if (error instanceof StaleConnectorError) {
        activated && connector.deactivate();
        warning(false, `Suppressed stale connector activation ${connector}`);
      } else if (throwErrors) {
        activated && connector.deactivate();
        throw error;
      } else if (onError) {
        activated && connector.deactivate();
        onError(error);
      } else {
        // we don't call activated && connector.deactivate() here because it'll be handled in the useEffect
        this.store.dispatch({
          type: ActionType.ERROR_FROM_ACTIVATION,
          payload: { connector, error },
        });
      }
    }
  };

  deactivate = (): void => {
    this.store.dispatch({ type: ActionType.DEACTIVATE_CONNECTOR });
  };

  setError = (error: Error): void => {
    this.store.dispatch({ type: ActionType.ERROR, payload: { error } });
  };

  handleDeactivate = (): void => {
    this.store.dispatch({ type: ActionType.DEACTIVATE_CONNECTOR });
  };

  handleError = (error: Error): void => {
    const { onError } = this.store.getState();
    onError
      ? onError(error)
      : this.store.dispatch({ type: ActionType.ERROR, payload: { error } });
  };

  handleUpdate = async (update: ConnectorUpdate): Promise<void> => {
    const { connector, error, onError } = this.store.getState();

    if (!connector) {
      throw Error(
        "This should never happen, it's just so Typescript stops complaining"
      );
    }

    const updateBusterInitial = this.updateBusterValue;

    // updates are handled differently depending on whether the connector is active vs in an error state
    if (!error) {
      const chainId =
        update.chainId === undefined
          ? undefined
          : normalizeChainId(update.chainId);
      if (
        chainId !== undefined &&
        !!connector.supportedChainIds &&
        !connector.supportedChainIds.includes(chainId)
      ) {
        const error = new UnsupportedChainIdError(
          chainId,
          connector.supportedChainIds
        );
        onError
          ? onError(error)
          : this.store.dispatch({ type: ActionType.ERROR, payload: { error } });
      } else {
        const account =
          typeof update.account === "string"
            ? normalizeAccount(update.account)
            : update.account;
        this.store.dispatch({
          type: ActionType.UPDATE,
          payload: { provider: update.provider, chainId, account },
        });
      }
    } else {
      try {
        const augmentedUpdate = await augmentConnectorUpdate(connector, update);

        if (this.updateBusterValue > updateBusterInitial) {
          throw new StaleConnectorError();
        }
        this.store.dispatch({
          type: ActionType.UPDATE_FROM_ERROR,
          payload: augmentedUpdate,
        });
      } catch (error) {
        if (error instanceof StaleConnectorError) {
          warning(
            false,
            `Suppressed stale connector update from error state ${connector} ${update}`
          );
        } else {
          // though we don't have to, we're re-circulating the new error
          onError
            ? onError(error)
            : this.store.dispatch({
                type: ActionType.ERROR,
                payload: { error },
              });
        }
      }
    }
  };

  handleMount = () => {
    this.unsubscribe = this.store.subscribe(() => {
      this.updateBusterValue++;

      const { connector } = this.store.getState();

      if(this.previousConnector === connector) {
        return
      }

      if (this.previousConnector) {
        this.previousConnector?.deactivate?.()
        this.previousConnector
          .off(ConnectorEvent.Update, this.handleUpdate)
          .off(ConnectorEvent.Error, this.handleError)
          .off(ConnectorEvent.Deactivate, this.handleDeactivate);
      }

      if (connector) {
        connector
          .on(ConnectorEvent.Update, this.handleUpdate)
          .on(ConnectorEvent.Error, this.handleError)
          .on(ConnectorEvent.Deactivate, this.handleDeactivate);
      }

      this.previousConnector = connector;
    });
  };

  handleUnmount = () => {
    this.unsubscribe();
    
    const state = this.store.getState();

    if (state && state.connector) {
      state.connector?.deactivate?.();
    }

    if (this.previousConnector) {
      this.previousConnector?.deactivate?.()
    }
  };
}
