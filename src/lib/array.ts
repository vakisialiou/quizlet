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

type UpsertType = {
  id: string | null,
  [key: string]: any
}

export const upsertObject = (arr: UpsertType[], val: UpsertType) => {
  const index = arr.findIndex((item) => item.id === val.id)
  if (index === -1) {
    arr.push(val)
  } else {
    arr[index] = val
  }

  return arr
}

export const removeObject = (arr: UpsertType[], val: UpsertType) => {
  return arr.filter((value) => {
    return value.id === val.id
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
