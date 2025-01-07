import { createRelationTermData, removeRelationTermData } from '@store/fetch/relations'
import { RelationTermData } from '@entities/RelationTerm'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'
import {removeObject, upsertObject} from '@lib/array'

export type CreateType = {
  relationTerm: RelationTermData,
  editable: boolean,
}

export const createRelationTerm = createAsyncThunk(
  '/relation/term/create',
  async (payload: CreateType): Promise<boolean> => {
    if (payload.editable) {
      return await createRelationTermData(payload.relationTerm)
    }
    return true
  }
)

export type RemoveType = {
  relationTerm: RelationTermData,
  editable: boolean,
}

export const removeRelationTerm = createAsyncThunk(
  '/relation/term/remove',
  async (payload: RemoveType): Promise<boolean> => {
    if (payload.editable) {
      return await removeRelationTermData(payload.relationTerm)
    }
    return true
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const relationReducers = (builder: any) => {
  builder
    .addCase(createRelationTerm.pending, (state: ConfigType, action: { meta: { arg: CreateType } }) => {
      const { relationTerm } = action.meta.arg
      state.relationTerms = upsertObject([...state.relationTerms], relationTerm)
    })

  builder
    .addCase(removeRelationTerm.pending, (state: ConfigType, action: { meta: { arg: RemoveType } }) => {
      const { relationTerm } = action.meta.arg
      state.relationTerms = removeObject([...state.relationTerms], relationTerm)
    })
}
