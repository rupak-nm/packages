export function CustomException ({ message, ...metadata }) {
  const error = new Error(message)

  // @ts-ignore
  Object.assign(error, metadata)

  return error
}
