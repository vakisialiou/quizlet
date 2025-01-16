import { ModuleData } from '@entities/Module'

export const sortDesc = (items: ModuleData[]): ModuleData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return b.order - a.order
  })
}

export const sortAsc = (items: ModuleData[]): ModuleData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
