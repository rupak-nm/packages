export const isIFrame = () => {
  return !((window === null || window === undefined ? undefined : window.parent) === window)
}
