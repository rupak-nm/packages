const isProduction = process.env.NODE_ENV === 'production'

export const __DEV__ = !isProduction