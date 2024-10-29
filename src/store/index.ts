import simulatorsReducer, { DataStateSimulatorsType } from '@store/reducers/simulators'
import foldersReducer, { DataStateFoldersType } from '@store/reducers/folders'
import termsReducer, { DataStateTermsType } from '@store/reducers/terms'
import { configureStore } from '@reduxjs/toolkit'

export function initializeStore(
  {
    folders,
    terms,
    simulators
  }:
  {
    terms: DataStateTermsType,
    folders: DataStateFoldersType,
    simulators: DataStateSimulatorsType
  }
) {
  return configureStore({
    reducer: {
      terms: termsReducer,
      folders: foldersReducer,
      simulators: simulatorsReducer
    },
    preloadedState: {
      terms: { ...terms },
      folders: { ...folders },
      simulators: { ...simulators }
    },
  })
}
