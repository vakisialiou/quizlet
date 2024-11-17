import { configureStore, createReducer, EnhancedStore } from '@reduxjs/toolkit'
import { ConfigType, SimulatorsType } from '@store/initial-state'
import { loggerMiddleware } from '@store/middlewares/logger'
import * as simulators from '@store/reducers/simulators'
import * as folders from '@store/reducers/folders'
import ClientFolder from '@entities/ClientFolder'
import * as terms from '@store/reducers/terms'
import ClientTerm from '@entities/ClientTerm'

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

export const actionFetchFolders = (callback?: (res: ClientFolder[]) => void): void => {
  const action = folders.fetchFolders()
  execAction(action, callback)
}

export const actionSaveFolder = (payload: folders.SaveType, callback?: (res: folders.SaveType) => void): void => {
  const action = folders.saveFolder(payload)
  execAction(action, callback)
}

export const actionDeleteFolder = (payload: ClientFolder, callback?: (res: ClientFolder) => void): void => {
  const action = folders.deleteFolder(payload)
  execAction(action, callback)
}

export const actionUpdateFolder = (payload: folders.UpdateType, callback?: (res: folders.UpdateType) => void): void => {
  const action = folders.updateFolder(payload)
  execAction(action, callback)
}

export const actionUpdateFolderItem = (payload: ClientFolder, callback?: (res: ClientFolder) => void): void => {
  const action = folders.updateFolderItem(payload)
  execAction(action, callback)
}


export const actionSaveTerm = (payload: terms.SaveType, callback?: (res: terms.SaveType) => void): void => {
  const action = terms.saveTerm(payload)
  execAction(action, callback)
}

export const actionDeleteTerm = (payload: ClientTerm, callback?: (res: ClientTerm) => void): void => {
  const action = terms.deleteTerm(payload)
  execAction(action, callback)
}

export const actionUpdateTerm = (payload: terms.UpdateType, callback?: (res: terms.UpdateType) => void): void => {
  const action = terms.updateTerm(payload)
  execAction(action, callback)
}

export const actionUpdateTermItem = (payload: ClientTerm, callback?: (res: ClientTerm) => void): void => {
  const action = terms.updateTermItem(payload)
  execAction(action, callback)
}

export const actionFetchSimulators = (callback?: (res: SimulatorsType[]) => void): void => {
  const action = simulators.fetchSimulators()
  execAction(action, callback)
}

export const actionStartSimulators = (payload: simulators.PayloadStart, callback?: (res: SimulatorsType[]) => void): void => {
  const action = simulators.startSimulators(payload)
  execAction(action, callback)
}


export const actionContinueSimulators = (payload: simulators.PayloadContinue, callback?: (res: SimulatorsType[]) => void): void => {
  const action = simulators.continueSimulators(payload)
  execAction(action, callback)
}

export const actionRememberSimulators = (payload: simulators.PayloadRemember, callback?: (res: SimulatorsType[]) => void): void => {
  const action = simulators.rememberSimulators(payload)
  execAction(action, callback)
}

export const actionRestartSimulators = (payload: simulators.PayloadRestart, callback?: (res: SimulatorsType[]) => void): void => {
  const action = simulators.restartSimulators(payload)
  execAction(action, callback)
}

export const actionBackSimulators = (payload: simulators.PayloadBack, callback?: (res: SimulatorsType[]) => void): void => {
  const action = simulators.backSimulators(payload)
  execAction(action, callback)
}
