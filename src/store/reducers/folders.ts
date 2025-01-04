import { saveFolderData, deleteFolderData } from '@store/fetch/folders'
import { unique, remove, upsertObject, removeObject } from '@lib/array'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'
import { FolderData } from '@entities/Folder'

export type SaveType = {
  folder: FolderData
  editId?: string | null
  editable: boolean
}

export const saveFolder = createAsyncThunk(
  '/folder/save',
  async (payload: SaveType): Promise<boolean> => {
    if (payload.editable) {
      return await saveFolderData(payload.folder)
    }
    return true
  }
)

export type DeleteType = {
  folder: FolderData,
  editable: boolean
}

export const deleteFolder = createAsyncThunk(
  '/folder/delete',
  async (payload: DeleteType): Promise<boolean> => {
    if (payload.editable) {
      return await deleteFolderData(payload.folder.id)
    }
    return true
  }
)

export type UpdateType = Partial<{
  folders?: FolderData[],
  editId?: string | null,
  processIds?: (string)[]
}>

export const updateFolder = createAsyncThunk(
  '/folder/update',
  async (payload: UpdateType): Promise<UpdateType> => {
    return payload
  }
)

export const updateFolderItem = createAsyncThunk(
  '/folder/update/item',
  async (payload: FolderData): Promise<FolderData> => {
    return payload
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const folderReducers = (builder: any) => {
  builder
    .addCase(saveFolder.pending, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const arg = action.meta.arg
      state.edit.processFolderIds = unique([...state.edit.processFolderIds, arg.folder.id])
      state.edit.folderId = arg.editId !== undefined ? arg.editId : state.edit.folderId
      state.folders = upsertObject([...state.folders], arg.folder) as FolderData[]
    })
    .addCase(saveFolder.rejected, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const { folder } = action.meta.arg
      state.folders = removeObject([...state.folders], folder) as FolderData[]
      state.edit.processFolderIds = remove(state.edit.processFolderIds, folder.id)
      state.edit.folderId = null
    })
    .addCase(saveFolder.fulfilled, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const { folder } = action.meta.arg
      state.edit.processFolderIds = remove(state.edit.processFolderIds, folder.id)
    })

  builder
    .addCase(deleteFolder.pending, (state: ConfigType, action: { meta: { arg: DeleteType } }) => {
      state.edit.processFolderIds = unique([...state.edit.processFolderIds, action.meta.arg.folder.id])
    })
    .addCase(deleteFolder.rejected, (state: ConfigType, action: { meta: { arg: DeleteType } }) => {
      state.edit.processFolderIds = remove(state.edit.processFolderIds, action.meta.arg.folder.id)
    })
    .addCase(deleteFolder.fulfilled, (state: ConfigType, action: { meta: { arg: DeleteType } }) => {
      const { folder } = action.meta.arg
      state.folders = upsertObject(state.folders, folder)
      state.edit.processFolderIds = remove(state.edit.processFolderIds, folder.id)
    })

  builder
    .addCase(updateFolder.fulfilled, (state: ConfigType, action: { meta: { arg: UpdateType }, payload: UpdateType }) => {
      state.edit.processFolderIds = action.payload.processIds !== undefined ? action.payload.processIds : state.edit.processFolderIds
      state.edit.folderId = action.payload.editId !== undefined ? action.payload.editId : state.edit.folderId
      state.folders = action.payload.folders !== undefined ? action.payload.folders : state.folders
    })

  builder
    .addCase(updateFolderItem.fulfilled, (state: ConfigType, action: { meta: { arg: FolderData }, payload: FolderData }) => {
      state.folders = upsertObject([...state.folders], action.payload) as FolderData[]
    })
}
