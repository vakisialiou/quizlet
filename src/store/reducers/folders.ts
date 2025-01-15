import {
  upsertFolderData,
  deleteFolderData,
} from '@store/fetch/folders'
import { unique, remove, upsertObject, removeObject } from '@lib/array'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'
import { FolderData } from '@entities/Folder'

export type DeleteType = {
  folderId: string,
  editable: boolean
}

export const deleteFolder = createAsyncThunk(
  '/folder/delete',
  async (payload: DeleteType): Promise<boolean> => {
    if (payload.editable) {
      return await deleteFolderData(payload.folderId)
    }
    return true
  }
)

export type UpdateType = {
  folder: FolderData
  editId: string | null
  editable: boolean
}

export const updateFolder = createAsyncThunk(
  '/folder/update',
  async (payload: UpdateType): Promise<boolean> => {
    if (payload.editable) {
      return await upsertFolderData(payload.folder)
    }
    return true
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const folderReducers = (builder: any) => {
  builder
    .addCase(updateFolder.pending, (state: ConfigType, action: { meta: { arg: UpdateType }, payload: UpdateType }) => {
      const arg = action.meta.arg
      state.edit.processFolderIds = unique([...state.edit.processFolderIds, arg.folder.id])
      state.folders = upsertObject([...state.folders], arg.folder) as FolderData[]
      state.edit.folderId = arg.editId
    })
    .addCase(updateFolder.rejected, (state: ConfigType, action: { meta: { arg: UpdateType } }) => {
      const { folder } = action.meta.arg
      state.folders = removeObject([...state.folders], folder) as FolderData[]
      state.edit.processFolderIds = remove(state.edit.processFolderIds, folder.id)
      state.edit.folderId = null
    })
    .addCase(updateFolder.fulfilled, (state: ConfigType, action: { meta: { arg: UpdateType } }) => {
      const { folder } = action.meta.arg
      state.edit.processFolderIds = remove(state.edit.processFolderIds, folder.id)
    })

  builder
    .addCase(deleteFolder.pending, (state: ConfigType, action: { meta: { arg: DeleteType } }) => {
      const { folderId } = action.meta.arg
      state.edit.processFolderIds = unique([...state.edit.processFolderIds, folderId])
    })
    .addCase(deleteFolder.rejected, (state: ConfigType, action: { meta: { arg: DeleteType } }) => {
      const { folderId } = action.meta.arg
      state.edit.processFolderIds = remove(state.edit.processFolderIds, folderId)
    })
    .addCase(deleteFolder.fulfilled, (state: ConfigType, action: { meta: { arg: DeleteType } }) => {
      const { folderId } = action.meta.arg
      state.folders = removeObject(state.folders, { id: folderId } as FolderData)
      state.relationFolders = [...state.relationFolders].filter((relation) => relation.folderId !== folderId)
      state.edit.processFolderIds = remove(state.edit.processFolderIds, folderId)

    })
}
