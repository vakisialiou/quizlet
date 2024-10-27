import { DataStateType } from '@store/reducers/folders'
import { configureStore } from '@reduxjs/toolkit'
import foldersReducer from './reducers/folders'
import { UnknownAction } from '@reduxjs/toolkit'

export function initializeStore({ folders }: { folders: DataStateType }) {
  return configureStore({
    reducer: {
      folders: foldersReducer,
    },
    preloadedState: {
      folders: { ...foldersReducer(undefined, {} as UnknownAction), ...folders }
    },
  })
}
