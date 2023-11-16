import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'

import invariant from 'tiny-invariant'

import { Web3ReactContextInterface } from './types.js'
import { Manager } from './manager.js'

export const PRIMARY_KEY = 'primary'

const CONTEXTS: { [key: string]: React.Context<Web3ReactContextInterface> } =
  {};

interface Web3ReactProviderArguments {
  getLibrary: (
    provider?: any,
    connector?: Required<Web3ReactContextInterface>["connector"]
  ) => any;
  children: any;
}

export function createWeb3ReactRoot(
  key: string
): (args: Web3ReactProviderArguments) => JSX.Element {
  invariant(!CONTEXTS[key], `A root already exists for provided key ${key}`);

  CONTEXTS[key] = createContext<Web3ReactContextInterface>({
    activate: async () => {
      invariant(false, "No <Web3ReactProvider ... /> found.");
    },
    setError: () => {
      invariant(false, "No <Web3ReactProvider ... /> found.");
    },
    deactivate: () => {
      invariant(false, "No <Web3ReactProvider ... /> found.");
    },
    active: false,
  });
  CONTEXTS[key].displayName = `Web3ReactContext - ${key}`;

  const Provider = CONTEXTS[key].Provider;

  return function Web3ReactProvider({
    getLibrary,
    children,
  }: Web3ReactProviderArguments): JSX.Element {
    const [manager] = useState(() => new Manager());

    const [state, setState] = useState<any>({})
    const { connector, provider, chainId, account, error } = state
    useEffect(() => {
      const store = manager.getStore()
      const unsubscribe = store.subscribe(() => {
        setState(store.getState())
      })

      return () => { manager.handleUnmount(); unsubscribe() }
    }, [manager])

    const active =
      connector !== undefined &&
      chainId !== undefined &&
      account !== undefined &&
      !error;

    const library = useMemo(
      () =>
        active &&
          chainId !== undefined &&
          Number.isInteger(chainId) &&
          !!connector
          ? getLibrary(provider, connector)
          : undefined,
      [active, getLibrary, provider, connector, chainId]
    );

    const web3ReactContext: Web3ReactContextInterface = {
      connector,
      library,
      chainId,
      account,

      activate: manager.activate,
      setError: manager.setError,
      deactivate: manager.deactivate,

      active,
      error,
    };

    return <Provider value={web3ReactContext}>{children}</Provider>;
  };
}

export const Web3ReactProvider = createWeb3ReactRoot(PRIMARY_KEY);

export function getWeb3ReactContext<T = any>(
  key: string = PRIMARY_KEY
): React.Context<Web3ReactContextInterface<T>> {
  invariant(Object.keys(CONTEXTS).includes(key), `Invalid key ${key}`);

  return CONTEXTS[key];
}

export function useWeb3React<T = any>(
  key?: string
): Web3ReactContextInterface<T> {
  return useContext(getWeb3ReactContext(key));
}
