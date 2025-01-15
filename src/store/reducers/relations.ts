import {
  createRelationTermData,
  removeRelationTermData,
  createRelationFolderData,
  removeRelationFolderData
} from '@store/fetch/relations'
import { RelationFolderData } from '@entities/RelationFolder'
import { RelationTermData } from '@entities/RelationTerm'
import { removeObject, upsertObject } from '@lib/array'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'

export type CreateRelationTermType = {
  relationTerm: RelationTermData,
  editable: boolean,
}

export const createRelationTerm = createAsyncThunk(
  '/relation/term/create',
  async (payload: CreateRelationTermType): Promise<boolean> => {
    if (payload.editable) {
      return await createRelationTermData(payload.relationTerm)
    }
    return true
  }
)

export type RemoveRelationTermType = {
  relationTerm: RelationTermData,
  editable: boolean,
}

export const removeRelationTerm = createAsyncThunk(
  '/relation/term/remove',
  async (payload: RemoveRelationTermType): Promise<boolean> => {
    if (payload.editable) {
      return await removeRelationTermData(payload.relationTerm)
    }
    return true
  }
)

export type CreateRelationFolderType = {
  relationFolder: RelationFolderData,
  editable: boolean,
}

export const createRelationFolder = createAsyncThunk(
  '/relation/folder/create',
  async (payload: CreateRelationFolderType): Promise<boolean> => {
    if (payload.editable) {
      return await createRelationFolderData(payload.relationFolder)
    }
    return true
  }
)

export type RemoveRelationFolderType = {
  relationFolder: RelationFolderData,
  editable: boolean,
}

export const removeRelationFolder = createAsyncThunk(
  '/relation/folder/remove',
  async (payload: RemoveRelationFolderType): Promise<boolean> => {
    if (payload.editable) {
      return await removeRelationFolderData(payload.relationFolder)
    }
    return true
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const relationReducers = (builder: any) => {
  builder
    .addCase(createRelationTerm.pending, (state: ConfigType, action: { meta: { arg: CreateRelationTermType } }) => {
      const { relationTerm } = action.meta.arg
      state.relationTerms = upsertObject([...state.relationTerms], relationTerm)
    })

  builder
    .addCase(removeRelationTerm.pending, (state: ConfigType, action: { meta: { arg: RemoveRelationTermType } }) => {
      const { relationTerm } = action.meta.arg
      state.relationTerms = removeObject([...state.relationTerms], relationTerm)
    })

  builder
    .addCase(createRelationFolder.pending, (state: ConfigType, action: { meta: { arg: CreateRelationFolderType } }) => {
      const { relationFolder } = action.meta.arg
      state.relationFolders = upsertObject([...state.relationFolders], relationFolder)
    })

  builder
    .addCase(removeRelationFolder.pending, (state: ConfigType, action: { meta: { arg: CreateRelationFolderType } }) => {
      const { relationFolder } = action.meta.arg
      state.relationFolders = removeObject([...state.relationFolders], relationFolder)
    })
}
