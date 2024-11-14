import { configureStore, createReducer, EnhancedStore } from '@reduxjs/toolkit'
import { loggerMiddleware } from '@store/middlewares/logger'
import * as folders from '@store/reducers/folders'
import ClientFolder from '@entities/ClientFolder'
import { ConfigType } from '@store/types'
import {updateFolderItem, UpdateType} from "@store/reducers/folders";

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

const execAction = (action: any, callback?: (res: any) => any): void => {
  getStore().dispatch(action).unwrap().then(callback)
}

export const actionFetchFolders = (callback?: (res: ClientFolder[]) => void): void => {
  const action = folders.fetchFolders()
  execAction(action, callback)
}

export const actionPutFolder = (folder: ClientFolder, callback?: (res: ClientFolder) => void): void => {
  const action = folders.putFolder(folder)
  execAction(action, callback)
}

export const actionDelFolder = (payload: ClientFolder, callback?: (res: ClientFolder) => void): void => {
  const action = folders.delFolder(payload)
  execAction(action, callback)
}

export const actionUpdateFolder = (payload: folders.UpdateType, callback?: (res: UpdateType) => void): void => {
  const action = folders.updateFolder(payload)
  execAction(action, callback)
}

export const actionUpdateFolderItem = (payload: ClientFolder, callback?: (res: ClientFolder) => void): void => {
  const action = folders.updateFolderItem(payload)
  execAction(action, callback)
}
