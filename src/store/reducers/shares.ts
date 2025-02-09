import { createRelationTermData } from '@store/fetch/relations'
import { ShareConfigType } from '@store/initial-state-share'
import { RelationTermData } from '@entities/RelationTerm'
import { unique, remove, upsertObject } from '@lib/array'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { upsertTermData } from '@store/fetch/terms'
import { TermData } from '@entities/Term'

export type CreateType = {
  term: TermData,
  editable: boolean,
  editId: string | null
  shareId: string | null
  relationTerm: RelationTermData,
}

export const createSharedTerm = createAsyncThunk(
  '/term/create',
  async (payload: CreateType): Promise<boolean> => {
    if (payload.editable) {
      await upsertTermData(payload.term, payload.shareId)
      await createRelationTermData(payload.relationTerm)
    }
    return true
  }
)

export type UpsertType = {
  term: TermData,
  editable: boolean,
  editId: string | null
  shareId: string | null
  relationTerm: RelationTermData,
}

export const upsertSharedTerm = createAsyncThunk(
  '/term/upsert',
  async (payload: UpsertType): Promise<boolean> => {
    if (payload.editable) {
      return await upsertTermData(payload.term, payload.shareId)
    }
    return true
  }
)

export type EditType = {
  editId: string | null,
}

export const editSharedTerm = createAsyncThunk(
  '/term/edit',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (payload: EditType): Promise<boolean> => {
    return true
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shareReducers = (builder: any) => {
  builder
    .addCase(createSharedTerm.pending, (state: ShareConfigType, action: { meta: { arg: CreateType } }) => {
      const { term, relationTerm, editId } = action.meta.arg
      state.edit.termId = editId
      state.terms = upsertObject([...state.terms], term)
      state.relationTerms = upsertObject([...state.relationTerms], relationTerm)
      state.edit.processTermIds = unique([...state.edit.processTermIds, term.id])
    })
    .addCase(createSharedTerm.fulfilled, (state: ShareConfigType, action: { meta: { arg: CreateType } }) => {
      const { term } = action.meta.arg
      state.edit.processTermIds = remove(state.edit.processTermIds, term.id)
    })

  builder
    .addCase(upsertSharedTerm.pending, (state: ShareConfigType, action: { meta: { arg: UpsertType } }) => {
      const { term, editId, relationTerm } = action.meta.arg
      state.edit.termId = editId
      state.terms = upsertObject([...state.terms], term)
      state.edit.processTermIds = unique([...state.edit.processTermIds, term.id])
      state.relationTerms = upsertObject([...state.relationTerms], relationTerm)
    })
    .addCase(upsertSharedTerm.fulfilled, (state: ShareConfigType, action: { meta: { arg: UpsertType } }) => {
      const { term } = action.meta.arg
      state.edit.processTermIds = remove(state.edit.processTermIds, term.id)
    })

  builder
    .addCase(editSharedTerm.pending, (state: ShareConfigType, action: { meta: { arg: EditType } }) => {
      const { editId } = action.meta.arg
      state.edit.termId = editId
    })
}
