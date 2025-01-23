import { configureStore, createReducer, Store } from '@reduxjs/toolkit'
import { loggerMiddleware } from '@store/middlewares/logger'
import { ShareConfigType } from '@store/initial-state-share'
import * as shares from '@store/reducers/shares'

const DEBUG = false

export function renderShareStore(initialState?: ShareConfigType): Store {
  return configureStore({
    preloadedState: initialState,
    reducer: createReducer(initialState, (builder) => {
      shares.shareReducers(builder)
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
