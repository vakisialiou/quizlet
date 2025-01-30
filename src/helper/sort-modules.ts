import { OrderEnum, sortByStr, sortByNum, sortByDate } from '@helper/sort'
import { ModuleData } from '@entities/Module'

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
