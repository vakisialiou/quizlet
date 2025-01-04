import { saveModuleData, updateModuleData, deleteModuleData } from '@store/fetch/modules'
import { unique, remove, upsertObject, removeObject } from '@lib/array'
import { createPartitions } from '@store/fetch/partitions'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'
import { ModuleData } from '@entities/Module'

export type PartitionsType = {
  moduleId: string,
  partitionSize: number,
}

export const createModulePartitions = createAsyncThunk(
  '/module/create/partitions',
  async (payload: PartitionsType): Promise<ModuleData[]> => {
    return createPartitions(payload.moduleId, payload.partitionSize)
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
    .addCase(createModulePartitions.pending, (state: ConfigType, action: { meta: { arg: PartitionsType } }) => {
      state.edit.processModuleIds = unique([...state.edit.processModuleIds, action.meta.arg.moduleId])
    })
    .addCase(createModulePartitions.rejected, (state: ConfigType, action: { meta: { arg: PartitionsType } }) => {
      state.edit.processModuleIds = remove(state.edit.processModuleIds, action.meta.arg.moduleId)
    })
    .addCase(createModulePartitions.fulfilled, (state: ConfigType, action: { payload: ModuleData[], meta: { arg: PartitionsType } }) => {
      for (const item of action.payload) {
        state.modules = upsertObject([...state.modules], { ...item })
      }
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
