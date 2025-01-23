import {
  upsertFolderData,
  deleteFolderData,
  generateFoldersData
} from '@store/fetch/folders'
import { unique, remove, upsertObject, removeObject } from '@lib/array'
import { createMultiFolders, MultiFolders } from '@helper/folders'
import { RelationFolderData } from '@entities/RelationFolder'
import { RelationTermData } from '@entities/RelationTerm'
import { FolderGroupData } from '@entities/FolderGroup'
import { ConfigType } from '@store/initial-state-main'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { FolderData } from '@entities/Folder'
import { TermData } from '@entities/Term'

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

export type GenerateType = {
  group: FolderGroupData
  terms: TermData[]
  editable: boolean
  size: number
}

export const generateMultiFolders = createAsyncThunk(
  '/folder/generate/multi',
  async (payload: GenerateType): Promise<MultiFolders> => {
    const data = createMultiFolders(payload.group, payload.terms, payload.size)
    if (payload.editable) {
      await generateFoldersData(data)
    }
    return data
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

  builder
    .addCase(generateMultiFolders.fulfilled, (state: ConfigType, action: { meta: { arg: GenerateType }, payload: MultiFolders }) => {
      const { folders, relationFolders, relationTerms } = action.payload

      for (const folder of folders) {
        state.folders = upsertObject([...state.folders], folder) as FolderData[]
      }
      for (const relationFolder of relationFolders) {
        state.relationFolders = upsertObject([...state.relationFolders], relationFolder) as RelationFolderData[]
      }
      for (const relationTerm of relationTerms) {
        state.relationTerms = upsertObject([...state.relationTerms], relationTerm) as RelationTermData[]
      }
    })
}
