import { upsertModuleData, deleteModuleData } from '@store/fetch/modules'
import { unique, remove, upsertObject, removeObject } from '@lib/array'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'
import { ModuleData } from '@entities/Module'

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
      return await upsertModuleData(payload.module)
    }
    return true
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const moduleReducers = (builder: any) => {
  builder
    .addCase(updateModule.pending, (state: ConfigType, action: { meta: { arg: UpdateType } }) => {
      const { module, editId } = action.meta.arg
      state.edit.moduleId = editId
      state.modules = upsertObject([...state.modules], module) as ModuleData[]
      state.edit.processModuleIds = unique([...state.edit.processModuleIds, module.id])
    })
    .addCase(updateModule.fulfilled, (state: ConfigType, action: { meta: { arg: UpdateType }, payload: UpdateType }) => {
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
}
