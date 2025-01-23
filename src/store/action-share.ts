import * as shares from '@store/reducers/shares'
import { executeShareAction } from '@store/store'

export const actionCreateSharedTerm = (payload: shares.CreateType, callback?: (res: boolean) => void): void => {
  const action = shares.createSharedTerm(payload)
  executeShareAction(action, callback)
}

export const actionUpsertSharedTerm = (payload: shares.UpsertType, callback?: (res: boolean) => void): void => {
  const action = shares.upsertSharedTerm(payload)
  executeShareAction(action, callback)
}

export const actionEditSharedTerm = (payload: shares.EditType, callback?: (res: boolean) => void): void => {
  const action = shares.editSharedTerm(payload)
  executeShareAction(action, callback)
}
