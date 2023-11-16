const env = (key: string, fallback?: string): string => {
  const value: string = process.env[key] as string

  if (value !== undefined) {
    return value
  }

  if (fallback !== undefined) {
    return fallback
  }

  return ''
}

export { env }
