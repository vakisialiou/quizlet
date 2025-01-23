import * as simulators from '@store/reducers/simulators'
import { ModuleShareData } from '@entities/ModuleShare'
import * as relations from '@store/reducers/relations'
import * as settings from '@store/reducers/settings'
import * as folders from '@store/reducers/folders'
import * as modules from '@store/reducers/modules'
import { executeMainAction } from '@store/store'
import * as groups from '@store/reducers/groups'
import * as terms from '@store/reducers/terms'
import { MultiFolders } from '@helper/folders'

export const actionDeleteFolder = (payload: folders.DeleteType, callback?: (res: boolean) => void): void => {
  const action = folders.deleteFolder(payload)
  executeMainAction(action, callback)
}

export const actionUpdateFolder = (payload: folders.UpdateType, callback?: (res: folders.UpdateType) => void): void => {
  const action = folders.updateFolder(payload)
  executeMainAction(action, callback)
}

export const actionGenerateFolders = (payload: folders.GenerateType, callback?: (res: MultiFolders) => void): void => {
  const action = folders.generateMultiFolders(payload)
  executeMainAction(action, callback)
}

export const actionDeleteModule = (payload: modules.DeleteType, callback?: (res: boolean) => void): void => {
  const action = modules.deleteModule(payload)
  executeMainAction(action, callback)
}

export const actionUpdateModule = (payload: modules.UpdateType, callback?: (res: boolean) => void): void => {
  const action = modules.updateModule(payload)
  executeMainAction(action, callback)
}

export const actionShareModule = (payload: modules.ShareType, callback?: (res: ModuleShareData) => void): void => {
  const action = modules.shareModule(payload)
  executeMainAction(action, callback)
}

export const actionUpsertTerm = (payload: terms.UpsertType, callback?: (res: boolean) => void): void => {
  const action = terms.upsertTerm(payload)
  executeMainAction(action, callback)
}

export const actionEditTerm = (payload: terms.EditType, callback?: (res: boolean) => void): void => {
  const action = terms.editTerm(payload)
  executeMainAction(action, callback)
}

export const actionCreateRelationTerm = (payload: relations.CreateRelationTermType, callback?: (res: boolean) => void): void => {
  const action = relations.createRelationTerm(payload)
  executeMainAction(action, callback)
}

export const actionRemoveRelationTerm = (payload: relations.CreateRelationTermType, callback?: (res: boolean) => void): void => {
  const action = relations.removeRelationTerm(payload)
  executeMainAction(action, callback)
}

export const actionCreateRelationFolder = (payload: relations.CreateRelationFolderType, callback?: (res: boolean) => void): void => {
  const action = relations.createRelationFolder(payload)
  executeMainAction(action, callback)
}

export const actionRemoveRelationFolder = (payload: relations.RemoveRelationFolderType, callback?: (res: boolean) => void): void => {
  const action = relations.removeRelationFolder(payload)
  executeMainAction(action, callback)
}

export const actionSaveSimulator = (payload: simulators.PayloadSave, callback?: (res: boolean) => void): void => {
  const action = simulators.saveSimulator(payload)
  executeMainAction(action, callback)
}

export const actionUpdateSimulator = (payload: simulators.PayloadUpdate, callback?: (res: boolean) => void): void => {
  const action = simulators.updateSimulator(payload)
  executeMainAction(action, callback)
}

export const actionUpdateSettings = (payload: settings.UpdateSettings, callback?: (res: boolean) => void): void => {
  const action = settings.updateSettings(payload)
  executeMainAction(action, callback)
}

export const actionUpdateFolderGroup = (payload: groups.UpdateType, callback?: (res: boolean) => void): void => {
  const action = groups.updateFolderGroup(payload)
  executeMainAction(action, callback)
}

export const actionRemoveFolderGroup = (payload: groups.RemoveType, callback?: (res: boolean) => void): void => {
  const action = groups.removeFolderGroup(payload)
  executeMainAction(action, callback)
}
