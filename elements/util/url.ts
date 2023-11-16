import { getDns } from './dns'

const isLocal = (url: string): boolean => {
  const domain = getDns()
  return new URL(domain).origin === new URL(url, domain).origin
}

const isFile = (path: string): boolean => {
  const domain = getDns()
  const url = new URL(path, domain)

  const { hash, search, pathname } = url

  if (hash !== '' || search !== '') {
    return true
  }

  const parts = pathname.split('/')
  const candidate = parts.pop()

  if ((candidate ?? '').includes('.')) {
    return true
  }

  return false
}

const normalizeUrl = (url: string | undefined | null): string | undefined => {
  if (url === undefined || url === null) {
    return undefined
  }

  const local = isLocal(url)

  if (!local) {
    return url
  }

  if (isFile(url)) {
    return url
  }

  url += url.endsWith('/') ? '' : '/'

  return url
}

export { normalizeUrl }
