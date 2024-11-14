import { configureStore, createReducer, EnhancedStore } from '@reduxjs/toolkit'
import { loggerMiddleware } from '@store/middlewares/logger'
import * as folders from '@store/reducers/folders'
import ClientFolder from '@entities/ClientFolder'
import { ConfigType } from '@store/types'

const DEBUG = false

declare global {
  interface Window {
    __store__: EnhancedStore
  }
}

export const getInitialState = async (state?: ConfigType) => {
  return {
    folders: {
      items: [],
      editId: null,
      processIds: []
    },
    ...state,
  }
}

export const presetStore = async (state?: ConfigType): Promise<EnhancedStore> => {
  const initialState = {
    ...(await getInitialState(state))
  }

  window.__store__ = configureStore({
    preloadedState: initialState,
    reducer: createReducer(initialState, (builder) => {
      folders.folderReducers(builder)
    }),
    middleware: (getDefaultMiddleware) => {
      const middlewares = getDefaultMiddleware()
      if (DEBUG) {
        return middlewares.concat(loggerMiddleware)
      }
      return middlewares
    },
  })
  return window.__store__
}

const getStore = (): EnhancedStore => {
  return window.__store__
}

const execAction = (action: any): any => {
  return getStore().dispatch(action).unwrap()
}

export const actionFetchFolders = (): void => {
  const action = folders.fetchFolders()
  execAction(action)
}

export const actionPutFolders = (folder: ClientFolder): void => {
  const action = folders.putFolder(folder)
  execAction(action)
}
