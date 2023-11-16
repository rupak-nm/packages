const ACTIVE_CONNECTOR_KEY = 'connector_name'
const ACTIVE_CHAIN_KEY = 'chain_id'

function trackConnector (value) {
  window.localStorage.setItem(ACTIVE_CONNECTOR_KEY, value)
}

function trackChain (value) {
  window.localStorage.setItem(ACTIVE_CHAIN_KEY, value)
}

function getConnector () {
  return window.localStorage.getItem(ACTIVE_CONNECTOR_KEY)
}

function getChain () {
  return window.localStorage.getItem(ACTIVE_CHAIN_KEY)
}

function clear () {
  window.localStorage.removeItem(ACTIVE_CHAIN_KEY)
  window.localStorage.removeItem(ACTIVE_CONNECTOR_KEY)
}

// TODO: Avoid using localstorage as it isn't accessible when rendered in third party iframe
const walletTrackerLS = {
  trackConnector,
  trackChain,
  getConnector,
  getChain,
  clear

}

export { walletTrackerLS }
