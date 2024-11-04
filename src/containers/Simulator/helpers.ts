import { DataStateSimulatorsType } from '@store/reducers/simulators'
import { DataStateTermsType } from '@store/reducers/terms'

export const isResetAllowed = (terms: DataStateTermsType, simulators: DataStateSimulatorsType, folderUUID: string) => {
  const continueUUIDs = simulators[folderUUID]?.continueUUIDs || []
  const rememberUUIDs = simulators[folderUUID]?.rememberUUIDs || []
  const items = getAllTermItems(terms, folderUUID)
  return items.length - (continueUUIDs.length + rememberUUIDs.length) === 1 && continueUUIDs.length > 0
}

export const getAllTermItems = (terms: DataStateTermsType, folderUUID: string) => {
  return terms[folderUUID]?.items || []
}
