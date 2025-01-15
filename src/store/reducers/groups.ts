import {
  upsertFolderGroupData,
  removeFolderGroupData,
} from '@store/fetch/folders-group'
import { upsertObject, removeObject } from '@lib/array'
import { FolderGroupData } from '@entities/FolderGroup'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'

export type RemoveType = {
  folderGroup: FolderGroupData,
  editable: boolean
}

export const removeFolderGroup = createAsyncThunk(
  '/folder-group/remove',
  async (payload: RemoveType): Promise<boolean> => {
    if (payload.editable) {
      return await removeFolderGroupData(payload.folderGroup.id)
    }
    return true
  }
)

export type UpdateType = {
  folderGroup: FolderGroupData
  editable: boolean
}

export const updateFolderGroup = createAsyncThunk(
  '/folder-group/update',
  async (payload: UpdateType): Promise<boolean> => {
    if (payload.editable) {
      return await upsertFolderGroupData(payload.folderGroup)
    }
    return true
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const folderGroupReducers = (builder: any) => {
  builder
    .addCase(updateFolderGroup.rejected, (state: ConfigType, action: { meta: { arg: UpdateType } }) => {
      const { folderGroup } = action.meta.arg
      state.folderGroups = removeObject([...state.folderGroups], folderGroup)
    })
    .addCase(updateFolderGroup.fulfilled, (state: ConfigType, action: { meta: { arg: UpdateType } }) => {
      const { folderGroup } = action.meta.arg
      state.folderGroups = upsertObject([...state.folderGroups], folderGroup)
    })

  builder
    .addCase(removeFolderGroup.fulfilled, (state: ConfigType, action: { meta: { arg: RemoveType } }) => {
      const { folderGroup } = action.meta.arg
      state.folderGroups = removeObject(state.folderGroups, { id: folderGroup.id } as FolderGroupData)

      console.log(state.relationFolders.length, '---')
      const relationFolders = [...state.relationFolders]
      for (let i = 0; i < relationFolders.length; i++) {
        if (relationFolders[i].groupId === folderGroup.id) {
          state.relationFolders = removeObject(state.relationFolders, relationFolders[i])
        }
      }
      console.log(state.relationFolders.length, '-++-')
    })
}
