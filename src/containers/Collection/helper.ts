import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import { ClientFolderData } from '@entities/ClientFolder'

export const getSimulatorsInfo = (simulators: ClientSimulatorData[]): { hasActive: boolean, countDone: number } => {
  let countDone = 0
  let hasActive = false
  for (const {active, status} of simulators) {
    if (active) {
      hasActive = true
    }
    if (!active && status === SimulatorStatus.DONE) {
      countDone++
    }
  }
  return { countDone, hasActive }
}

export const findModuleItems = (items: ClientFolderData[]): ClientFolderData[] => {
  return [...items || []]
    .filter((item) => item.isModule)
}

export const searchItemsByName = (items: ClientFolderData[], search?: string | null): ClientFolderData[] => {
  if (!search) {
    return items
  }
  return items.filter(({ name }) => `${name}`.toLocaleLowerCase().includes(search))
}

export const sortFolderItems = (items: ClientFolderData[]): ClientFolderData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return a.order - b.order
  })
}
