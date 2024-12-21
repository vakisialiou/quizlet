import { ClientFolderData } from '@entities/ClientFolder'

export const GROUP_SIZE_5 = 5
export const GROUP_SIZE_10 = 10
export const GROUP_SIZE_15 = 15
export const GROUP_SIZE_20 = 20
export const GROUP_SIZE_25 = 25
export const GROUP_SIZE_30 = 30
export const DEFAULT_GROUP_SIZE = GROUP_SIZE_5

export const minTermsCountToGenerateGroup = (size: number) => {
  return (size * 2)
}

export const isGenerateGroupDisabled = (parentFolder: ClientFolderData, size: number) => {
  return parentFolder.terms.length < minTermsCountToGenerateGroup(size)
}
