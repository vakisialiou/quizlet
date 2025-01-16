import { configureStore, createReducer, EnhancedStore } from '@reduxjs/toolkit'
import { loggerMiddleware } from '@store/middlewares/logger'
import * as simulators from '@store/reducers/simulators'
import * as relations from '@store/reducers/relations'
import * as settings from '@store/reducers/settings'
import * as folders from '@store/reducers/folders'
import * as modules from '@store/reducers/modules'
import { ConfigType } from '@store/initial-state'
import * as groups from '@store/reducers/groups'
import * as terms from '@store/reducers/terms'

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
      relations.relationReducers(builder)
      settings.simulatorReducers(builder)
      groups.folderGroupReducers(builder)
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

export const actionDeleteFolder = (payload: folders.DeleteType, callback?: (res: boolean) => void): void => {
  const action = folders.deleteFolder(payload)
  execAction(action, callback)
}

export const actionUpdateFolder = (payload: folders.UpdateType, callback?: (res: folders.UpdateType) => void): void => {
  const action = folders.updateFolder(payload)
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

export const actionUpsertTerm = (payload: terms.UpsertType, callback?: (res: boolean) => void): void => {
  const action = terms.upsertTerm(payload)
  execAction(action, callback)
}

export const actionCreateRelationTerm = (payload: relations.CreateRelationTermType, callback?: (res: boolean) => void): void => {
  const action = relations.createRelationTerm(payload)
  execAction(action, callback)
}

export const actionRemoveRelationTerm = (payload: relations.CreateRelationTermType, callback?: (res: boolean) => void): void => {
  const action = relations.removeRelationTerm(payload)
  execAction(action, callback)
}

export const actionCreateRelationFolder = (payload: relations.CreateRelationFolderType, callback?: (res: boolean) => void): void => {
  const action = relations.createRelationFolder(payload)
  execAction(action, callback)
}

export const actionRemoveRelationFolder = (payload: relations.RemoveRelationFolderType, callback?: (res: boolean) => void): void => {
  const action = relations.removeRelationFolder(payload)
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

export const actionUpdateFolderGroup = (payload: groups.UpdateType, callback?: (res: boolean) => void): void => {
  const action = groups.updateFolderGroup(payload)
  execAction(action, callback)
}

export const actionRemoveFolderGroup = (payload: groups.RemoveType, callback?: (res: boolean) => void): void => {
  const action = groups.removeFolderGroup(payload)
  execAction(action, callback)
}
