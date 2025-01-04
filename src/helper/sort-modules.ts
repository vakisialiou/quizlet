import { ModuleData } from '@entities/Module'

export const sortDesc = (items: ModuleData[]): ModuleData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
    return b.order - a.order
  })
}

export const sortAsc = (items: ModuleData[]): ModuleData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    }
    return a.order - b.order
  })
}

export const sortTop = (items: ModuleData[], topModuleId: string | null): ModuleData[] => {
  return [...items].sort((a, b) => {
    if (topModuleId === a.id) {
      return -1
    }
    if (topModuleId === b.id) {
      return 1
    }
    return 0
  })
}
