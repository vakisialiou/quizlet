import foldersReducer, { DataStateFoldersType } from '@store/reducers/folders'
import termsReducer, { DataStateTermsType } from '@store/reducers/terms'
import { configureStore } from '@reduxjs/toolkit'

export function initializeStore({ folders, terms }: { folders: DataStateFoldersType, terms?: DataStateTermsType }) {
  return configureStore({
    reducer: {
      terms: termsReducer,
      folders: foldersReducer,
    },
    preloadedState: {
      terms: { ...terms },
      folders: { ...folders }
    },
  })
}
