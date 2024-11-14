import objectPath from 'object-path'

export const unique = (arr: any[]) => {
  return arr.filter((value: any, index: number, array: any[]) => {
    return array.indexOf(value) === index
  })
}

export const remove = (arr: any[], val: any) => {
  return arr.filter((value: any) => {
    return value === val
  })
}

export const groupByPath = (arr: any[], groupPath: string | string[]) => {
  const tmp = {} as { [key: string]: any }

  for (let value of arr) {
    const key = objectPath.get(value, groupPath, '') as string
    if (!(key in tmp)) {
      tmp[key] = []
    }
    tmp[key].push(value)
  }
  return tmp
}
