import objectPath from 'object-path'

export const unique = <T>(arr: T[]): T[] => {
  return arr.filter((value, index, array) => array.indexOf(value) === index)
}

export const remove = <T>(arr: T[], val: T): T[] => {
  return arr.filter((value) => value !== val)
}

export const upsertObject = <T extends { id: string | null }>(arr: T[], val: T) => {
  const index = arr.findIndex((item) => item.id === val.id)
  if (index === -1) {
    arr.push(val)
  } else {
    arr[index] = val
  }

  return arr
}

export const removeObject = <T extends { id: string | null }>(arr: T[], val: T) => {
  return arr.filter((value) => {
    return value.id !== val.id
  })
}

export const groupByPath = <T extends Record<string, unknown>>(arr: T[], groupPath: string | string[]): Record<string, T[]> => {
  const tmp: Record<string, T[]> = {}

  for (const value of arr) {
    const key = objectPath.get(value, groupPath, '') as string
    if (!(key in tmp)) {
      tmp[key] = []
    }
    tmp[key].push(value)
  }
  return tmp
}

export const shuffle = <T>(arr: T[]): T[] => {
  return arr.sort(() => Math.random() - 0.5)
}
