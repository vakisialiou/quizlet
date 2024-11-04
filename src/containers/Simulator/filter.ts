import { DataStateSimulatorType } from '@store/reducers/simulators'
import { ClientTermType } from '@entities/ClientTerm'

export const filterTerms = (termItems: ClientTermType[], simulator: DataStateSimulatorType | undefined): ClientTermType[] => {
  return termItems.filter((item) => {
    if ((simulator?.rememberUUIDs || []).includes(item.uuid)) {
      return false
    }

    return !(simulator?.continueUUIDs || []).includes(item.uuid)
  })
}

export const filterActiveTerm = (termItems: ClientTermType[], activeUUID: string | undefined): ClientTermType[] => {
  return termItems.filter((item) => {
    return item.uuid !== activeUUID
  })
}
