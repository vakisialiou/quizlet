import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import { ClientFolderData } from '@entities/ClientFolder'
import { ClientTermData } from '@entities/ClientTerm'

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

export const searchFolderItemsByName = (items: ClientFolderData[], search?: string | null, editItemId?: string | null): ClientFolderData[] => {
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

export const sortFolderItems = (items: ClientFolderData[]): ClientFolderData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return a.order - b.order
  })
}

export const searchTermItems = (items: ClientTermData[], search: string | null, termEditId?: string | null): ClientTermData[] => {
  if (!search) {
    return items
  }

  return items.filter(({ id, question, answer, association }) => {
    if (termEditId === id) {
      return true
    }

    return `${question}`.toLocaleLowerCase().includes(search)
      || `${answer}`.toLocaleLowerCase().includes(search)
      || `${association}`.toLocaleLowerCase().includes(search)
  })
}

export const sortTermItems = (items: ClientTermData[]): ClientTermData[] => {
  return [...items].sort((a, b) => {
    if (a.order === b.order) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return a.order - b.order
  })
}
