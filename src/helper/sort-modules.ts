import { ModuleData } from '@entities/Module'

function sortByNum(a: number, b: number, asc: boolean): number {
  return asc ? a - b : b - a
}

function sortByStr(a: string | null, b: string | null, asc: boolean): number {
  const aa = a || ''
  const bb = b || ''
  return asc ? aa.localeCompare(bb) : bb.localeCompare(aa)
}

function sortByDate(a: Date, b: Date, asc: boolean): number {
  const aa = new Date(a).getTime()
  const bb = new Date(b).getTime()
  return asc ? aa - bb : bb - aa
}

export enum OrderEnum {
  nameAsc = 'name-asc',
  nameDesc = 'name-desc',
  customAsc = 'custom-asc',
  customDesc = 'custom-desc',
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
}

export const ORDER_DEFAULT = OrderEnum.dateDesc

export function sortModules(items: ModuleData[], order: OrderEnum): ModuleData[] {
  return [...items].sort((a, b) => {
    switch (order) {
      default:
      case OrderEnum.customAsc:
        return sortByNum(a.order, b.order, true)
      case OrderEnum.nameAsc:
        return sortByStr(a.name, b.name, true)
      case OrderEnum.dateAsc:
        return sortByDate(a.updatedAt, b.updatedAt, true)
      case OrderEnum.customDesc:
        return sortByNum(a.order, b.order, false)
      case OrderEnum.nameDesc:
        return sortByStr(a.name, b.name, false)
      case OrderEnum.dateDesc:
        return sortByDate(a.updatedAt, b.updatedAt, false)
    }
  })
}
