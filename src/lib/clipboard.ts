
export function clipboard(value: string, callback: (isError: boolean) => void) {
  navigator.clipboard.writeText(value).then(
    () => callback(false),
    () => callback(true)
  )
}
