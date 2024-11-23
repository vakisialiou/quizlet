import { configureStore, createReducer, EnhancedStore } from '@reduxjs/toolkit'
import { loggerMiddleware } from '@store/middlewares/logger'
import { ClientFolderData } from '@entities/ClientFolder'
import * as simulators from '@store/reducers/simulators'
import * as settings from '@store/reducers/settings'
import { ClientTermData } from '@entities/ClientTerm'
import * as folders from '@store/reducers/folders'
import { ConfigType } from '@store/initial-state'
import * as terms from '@store/reducers/terms'
import {
  PayloadFetch,
  PayloadBack,
  PayloadContinue,
  PayloadRemember,
  PayloadRestart,
  PayloadStart,
  PayloadDeactivate,
  UpsertSimulatorsIds,
} from '@store/reducers/simulators'

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

export const actionFetchFolders = (callback?: (res: ClientFolderData[]) => void): void => {
  const action = folders.fetchFolders()
  execAction(action, callback)
}

export const actionSaveFolder = (payload: folders.SaveType, callback?: (res: folders.SaveType) => void): void => {
  const action = folders.saveFolder(payload)
  execAction(action, callback)
}

export const actionDeleteFolder = (payload: ClientFolderData, callback?: (res: ClientFolderData) => void): void => {
  const action = folders.deleteFolder(payload)
  execAction(action, callback)
}

export const actionUpdateFolder = (payload: folders.UpdateType, callback?: (res: folders.UpdateType) => void): void => {
  const action = folders.updateFolder(payload)
  execAction(action, callback)
}

export const actionUpdateFolderItem = (payload: ClientFolderData, callback?: (res: ClientFolderData) => void): void => {
  const action = folders.updateFolderItem(payload)
  execAction(action, callback)
}


export const actionSaveTerm = (payload: terms.SaveType, callback?: (res: terms.SaveType) => void): void => {
  const action = terms.saveTerm(payload)
  execAction(action, callback)
}

export const actionDeleteTerm = (payload: ClientTermData, callback?: (res: ClientTermData) => void): void => {
  const action = terms.deleteTerm(payload)
  execAction(action, callback)
}

export const actionUpdateTerm = (payload: terms.UpdateType, callback?: (res: terms.UpdateType) => void): void => {
  const action = terms.updateTerm(payload)
  execAction(action, callback)
}

export const actionUpdateTermItem = (payload: ClientTermData, callback?: (res: ClientTermData) => void): void => {
  const action = terms.updateTermItem(payload)
  execAction(action, callback)
}

export const actionFetchSimulators = (payload: PayloadFetch, callback?: (res: ClientFolderData) => void): void => {
  const action = simulators.fetchSimulators(payload)
  execAction(action, callback)
}

export const actionStartSimulators = (payload: PayloadStart, callback?: (res: UpsertSimulatorsIds) => void): void => {
  const action = simulators.startSimulators(payload)
  execAction(action, callback)
}


export const actionContinueSimulators = (payload: PayloadContinue, callback?: (res: UpsertSimulatorsIds) => void): void => {
  const action = simulators.continueSimulators(payload)
  execAction(action, callback)
}

export const actionRememberSimulators = (payload: PayloadRemember, callback?: (res: UpsertSimulatorsIds) => void): void => {
  const action = simulators.rememberSimulators(payload)
  execAction(action, callback)
}

export const actionRestartSimulators = (payload: PayloadRestart, callback?: (res: UpsertSimulatorsIds) => void): void => {
  const action = simulators.restartSimulators(payload)
  execAction(action, callback)
}

export const actionBackSimulators = (payload: PayloadBack, callback?: (res: UpsertSimulatorsIds) => void): void => {
  const action = simulators.backSimulators(payload)
  execAction(action, callback)
}

export const actionDeactivateSimulators = (payload: PayloadDeactivate, callback?: (res: UpsertSimulatorsIds) => void): void => {
  const action = simulators.deactivateSimulators(payload)
  execAction(action, callback)
}

export const actionUpdateSettingsSimulator = (payload: settings.PayloadUpdate, callback?: (res: boolean) => void): void => {
  const action = settings.updateSettingsSimulator(payload)
  execAction(action, callback)
}
