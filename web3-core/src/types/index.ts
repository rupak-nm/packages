export {};


declare function providerOnFunc(name: 'accountsChanged', handler: (accounts: Array<string>) => void);

declare function providerOnFunc(name: 'networkChanged', handler: (networkId: string) => void);

declare function providerOnFunc(name: 'chainChanged', handler: (chainId: string) => void);

declare function providerOnFunc(name: 'connect', handler: (connectInfo: ConnectInfo) => void);

declare function providerOnFunc(name: 'disconnect', handler: (error: ProviderRpcError) => void);

declare function providerOnFunc(name: 'close', handler: (code: number, reason: string) => void);

declare function providerOnFunc(name: 'message', handler: (message: ProviderMessage) => void);

declare global {
  interface Window {
    ethereum?: {
      on?: typeof providerOnFunc;
      [key: string]: any;
    };
    okxwallet?: any;
    bitkeep?: any;
    BinanceChain?: any;
    coinbaseWalletExtension?: any;
  }

  interface ConnectInfo {
    chainId: string;
  }

  interface ProviderMessage {
    type: string;
    data: unknown;
  }

  interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
  }
}
