import { configureStore, createReducer, Store } from '@reduxjs/toolkit'
import { loggerMiddleware } from '@store/middlewares/logger'
import * as simulators from '@store/reducers/simulators'
import * as relations from '@store/reducers/relations'
import { ConfigType } from '@store/initial-state-main'
import * as settings from '@store/reducers/settings'
import * as folders from '@store/reducers/folders'
import * as modules from '@store/reducers/modules'
import * as groups from '@store/reducers/groups'
import * as terms from '@store/reducers/terms'
import * as share from '@store/reducers/share'

const DEBUG = false

export function renderMainStore(initialState?: ConfigType): Store {
  return configureStore({
    preloadedState: initialState,
    reducer: createReducer(initialState, (builder) => {
      simulators.simulatorReducers(builder)
      relations.relationReducers(builder)
      settings.simulatorReducers(builder)
      groups.folderGroupReducers(builder)
      modules.moduleReducers(builder)
      folders.folderReducers(builder)
      share.shareReducers(builder)
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
