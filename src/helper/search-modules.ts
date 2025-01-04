import { ModuleData } from '@entities/Module'

export const searchModules = (items: ModuleData[], search?: string | null, editItemId?: string | null): ModuleData[] => {
  if (!search) {
    return items
  }
  return items.filter(({ id, name }) => {
    if (editItemId === id) {
      return true
    }
    return `${name}`.toLocaleLowerCase().includes(search)
  })
}
