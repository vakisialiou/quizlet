import { renderShareStore } from '@store/store-renderer-share'
import { renderMainStore } from '@store/store-renderer-main'
import { ShareConfigType } from '@store/initial-state-share'
import { ConfigType } from '@store/initial-state-main'
import { Store } from '@reduxjs/toolkit'

interface TypeCache {
  main: Store | null
  share: Store | null
}

const cache: TypeCache = {
  main: null,
  share: null
}

export function createMainStore(initialState?: ConfigType): Store {
  cache.main = renderMainStore(initialState)
  return cache.main
}

export function createShareStore(initialState?: ShareConfigType) {
  cache.share = renderShareStore(initialState)
  return cache.share
}

export function getMainStore(): Store {
  if (!cache.main) {
    throw new Error('Create store "Main" before use action.')
  }
  return cache.main
}

export function getShareStore(): Store {
  if (!cache.share) {
    throw new Error('Create store "Share" before use action.')
  }
  return cache.share
}

type CallbackType<T> = (res: T) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function executeMainAction<T>(action: any, callback?: CallbackType<T>): void {
  getMainStore().dispatch(action).unwrap().then(callback)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function executeShareAction<T>(action: any, callback?: CallbackType<T>): void {
  getShareStore().dispatch(action).unwrap().then(callback)
}
