import { configureStore, createReducer, EnhancedStore } from '@reduxjs/toolkit'
import { loggerMiddleware } from '@store/middlewares/logger'
import * as simulators from '@store/reducers/simulators'
import * as settings from '@store/reducers/settings'
import * as folders from '@store/reducers/folders'
import * as modules from '@store/reducers/modules'
import { ConfigType } from '@store/initial-state'
import * as terms from '@store/reducers/terms'
import { FolderData } from '@entities/Folder'

const DEBUG = false

declare global {
  interface Window {
    __store__: EnhancedStore
  }
}

function renderStore(initialState?: ConfigType): EnhancedStore {
  return configureStore({
    preloadedState: initialState,
    reducer: createReducer(initialState, (builder) => {
      simulators.simulatorReducers(builder)
      settings.simulatorReducers(builder)
      modules.moduleReducers(builder)
      folders.folderReducers(builder)
      terms.termReducers(builder)
    }),
    middleware: (getDefaultMiddleware) => {
      const middlewares = getDefaultMiddleware()
      if (DEBUG) {
        return middlewares.concat(loggerMiddleware)
      }
      return middlewares
    },
  })
}

export const presetStore = (initialState?: ConfigType): EnhancedStore => {
  if (typeof window === 'object') {
    window.__store__ = renderStore(initialState)
    return window.__store__
  }
  return renderStore(initialState)
}

const getStore = (): EnhancedStore => {
  return window.__store__
}

type CallbackType<T> = (res: T) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const execAction = <T>(action: any, callback?: CallbackType<T>): void => {
  getStore().dispatch(action).unwrap().then(callback)
}

export const actionSaveFolder = (payload: folders.SaveType, callback?: (res: boolean) => void): void => {
  const action = folders.saveFolder(payload)
  execAction(action, callback)
}

export const actionDeleteFolder = (payload: folders.DeleteType, callback?: (res: boolean) => void): void => {
  const action = folders.deleteFolder(payload)
  execAction(action, callback)
}

export const actionUpdateFolder = (payload: folders.UpdateType, callback?: (res: folders.UpdateType) => void): void => {
  const action = folders.updateFolder(payload)
  execAction(action, callback)
}

export const actionUpdateFolderItem = (payload: FolderData, callback?: (res: FolderData) => void): void => {
  const action = folders.updateFolderItem(payload)
  execAction(action, callback)
}

export const actionSaveModule = (payload: modules.SaveType, callback?: (res: boolean) => void): void => {
  const action = modules.saveModule(payload)
  execAction(action, callback)
}

export const actionDeleteModule = (payload: modules.DeleteType, callback?: (res: boolean) => void): void => {
  const action = modules.deleteModule(payload)
  execAction(action, callback)
}

export const actionUpdateModule = (payload: modules.UpdateType, callback?: (res: boolean) => void): void => {
  const action = modules.updateModule(payload)
  execAction(action, callback)
}

export const actionCreateModulePartitions = (payload: modules.PartitionsType, callback?: (res: FolderData[]) => void): void => {
  const action = modules.createModulePartitions(payload)
  execAction(action, callback)
}

export const actionCreateTerm = (payload: terms.SaveType, callback?: (res: boolean) => void): void => {
  const action = terms.createTerm(payload)
  execAction(action, callback)
}

export const actionUpdateTerm = (payload: terms.UpdateType, callback?: (res: boolean) => void): void => {
  const action = terms.updateTerm(payload)
  execAction(action, callback)
}

export const actionEditTerm = (payload: terms.EditType, callback?: (res: boolean) => void): void => {
  const action = terms.editTerm(payload)
  execAction(action, callback)
}

export const actionSaveSimulator = (payload: simulators.PayloadSave, callback?: (res: boolean) => void): void => {
  const action = simulators.saveSimulator(payload)
  execAction(action, callback)
}

export const actionUpdateSimulator = (payload: simulators.PayloadUpdate, callback?: (res: boolean) => void): void => {
  const action = simulators.updateSimulator(payload)
  execAction(action, callback)
}

export const actionUpdateSettingsSimulator = (payload: settings.PayloadUpdate, callback?: (res: boolean) => void): void => {
  const action = settings.updateSettingsSimulator(payload)
  execAction(action, callback)
}
