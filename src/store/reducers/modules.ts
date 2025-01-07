import { saveModuleData, updateModuleData, deleteModuleData } from '@store/fetch/modules'
import { unique, remove, upsertObject, removeObject } from '@lib/array'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'
import {createGroup, TypeCreateGroupResponse} from '@store/fetch/group'
import { ModuleData } from '@entities/Module'

export type GroupType = {
  moduleId: string,
  termIds: string[],
  size: number,
}

export const createModuleGroup = createAsyncThunk(
  '/module/create/partitions',
  async (payload: GroupType): Promise<TypeCreateGroupResponse> => {
    return createGroup(payload.moduleId, payload.termIds, payload.size)
  }
)

export type SaveType = {
  module: ModuleData
  editId: string | null
  editable: boolean
}

export const saveModule = createAsyncThunk(
  '/module/save',
  async (payload: SaveType): Promise<boolean> => {
    if (payload.editable) {
      return await saveModuleData(payload.module)
    }
    return true
  }
)

export type DeleteType = {
  module: ModuleData,
  editable: boolean
}

export const deleteModule = createAsyncThunk(
  '/module/delete',
  async (payload: DeleteType): Promise<boolean> => {
    if (payload.editable) {
      return await deleteModuleData(payload.module.id)
    }
    return true
  }
)

export type UpdateType = {
  module: ModuleData,
  editId: string | null,
  editable: boolean
}

export const updateModule = createAsyncThunk(
  '/module/update',
  async (payload: UpdateType): Promise<boolean> => {
    if (payload.editable) {
      return await updateModuleData(payload.module)
    }
    return true
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const moduleReducers = (builder: any) => {

  builder
    .addCase(createModuleGroup.pending, (state: ConfigType, action: { meta: { arg: GroupType } }) => {
      state.edit.processModuleIds = unique([...state.edit.processModuleIds, action.meta.arg.moduleId])
    })
    .addCase(createModuleGroup.rejected, (state: ConfigType, action: { meta: { arg: GroupType } }) => {
      state.edit.processModuleIds = remove(state.edit.processModuleIds, action.meta.arg.moduleId)
    })
    .addCase(createModuleGroup.fulfilled, (state: ConfigType, action: { payload: TypeCreateGroupResponse, meta: { arg: GroupType } }) => {
      state.folders = [...state.folders, ...action.payload.folders]
      state.folderGroups = [...state.folderGroups, action.payload.folderGroup]
      state.relationTerms = [...state.relationTerms, ...action.payload.relationTerms]
      state.relationFolders = [...state.relationFolders, ...action.payload.relationFolders]
      state.edit.processModuleIds = remove(state.edit.processModuleIds, action.meta.arg.moduleId)
    })

  builder
    .addCase(saveModule.pending, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const { module, editId } = action.meta.arg
      state.edit.moduleId = editId
      state.modules = upsertObject([...state.modules], module) as ModuleData[]
      state.edit.processModuleIds = unique([...state.edit.processModuleIds, module.id])
    })
    .addCase(saveModule.rejected, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const { module } = action.meta.arg
      state.modules = removeObject([...state.modules], module) as ModuleData[]
      state.edit.processModuleIds = remove(state.edit.processModuleIds, module.id)
      state.edit.moduleId = null
    })
    .addCase(saveModule.fulfilled, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const { module } = action.meta.arg
      state.edit.processModuleIds = remove(state.edit.processModuleIds, module.id)
    })

  builder
    .addCase(deleteModule.pending, (state: ConfigType, action: { meta: { arg: DeleteType } }) => {
      state.edit.processModuleIds = unique([...state.edit.processModuleIds, action.meta.arg.module.id])
    })
    .addCase(deleteModule.rejected, (state: ConfigType, action: { meta: { arg: DeleteType } }) => {
      state.edit.processModuleIds = remove(state.edit.processModuleIds, action.meta.arg.module.id)
    })
    .addCase(deleteModule.fulfilled, (state: ConfigType, action: { meta: { arg: DeleteType } }) => {
      const { module } = action.meta.arg
      state.modules = removeObject([...state.modules], module)
      state.edit.processModuleIds = remove(state.edit.processModuleIds, module.id)
    })

  builder
    .addCase(updateModule.pending, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const { module, editId } = action.meta.arg
      state.edit.moduleId = editId
      state.modules = upsertObject([...state.modules], module) as ModuleData[]
      state.edit.processModuleIds = unique([...state.edit.processModuleIds, module.id])
    })
    .addCase(updateModule.fulfilled, (state: ConfigType, action: { meta: { arg: UpdateType }, payload: UpdateType }) => {
      const { module } = action.meta.arg
      state.edit.processModuleIds = remove(state.edit.processModuleIds, module.id)
    })
}
