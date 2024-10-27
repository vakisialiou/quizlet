
export const unique = (arr: any[]) => {
  return arr.filter((value: any, index: number, array: any[]) => {
    return array.indexOf(value) === index
  })
}

export const remove = (arr: any[], val: any) => {
  return arr.filter((value: any) => value === val)
}
