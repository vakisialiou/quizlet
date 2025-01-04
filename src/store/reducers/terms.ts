import { saveTermData, updateTermData } from '@store/fetch/terms'
import { unique, remove, upsertObject } from '@lib/array'
import { RelationTermData } from '@entities/RelationTerm'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'
import { TermData } from '@entities/Term'

export type SaveType = {
  term: TermData,
  relationTerm: RelationTermData,
  editId: string | null
  shareId: string | null
  editable: boolean,
}

export const createTerm = createAsyncThunk(
  '/term/create',
  async (payload: SaveType): Promise<boolean> => {
    if (payload.editable) {
      return await saveTermData(payload.relationTerm, payload.term, payload.shareId)
    }
    return true
  }
)

export type UpdateType = {
  term: TermData,
  relationTerm: RelationTermData,
  shareId: string | null
  editId: string | null
  editable: boolean,
}

export const updateTerm = createAsyncThunk(
  '/term/update',
  async (payload: UpdateType): Promise<boolean> => {
    if (payload.editable) {
      return await updateTermData(payload.relationTerm, payload.term, payload.shareId)
    }
    return true
  }
)

export type EditType = {
  editId: string | null,
}

export const editTerm = createAsyncThunk(
  '/term/edit',
  async (payload: EditType): Promise<boolean> => {
    return true
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const termReducers = (builder: any) => {
  builder
    .addCase(createTerm.pending, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const { term, relationTerm, editId } = action.meta.arg

      state.edit.termId = editId
      state.edit.processTermIds = unique([...state.edit.processTermIds, term.id])

      state.terms = upsertObject([...state.terms], term)
      state.relationTerms = upsertObject([...state.relationTerms], relationTerm)
    })
    .addCase(createTerm.fulfilled, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const { term } = action.meta.arg
      state.edit.processTermIds = remove(state.edit.processTermIds, term.id)
    })

  builder
    .addCase(updateTerm.pending, (state: ConfigType, action: { meta: { arg: UpdateType } }) => {
      const { term, relationTerm } = action.meta.arg

      state.edit.termId = action.meta.arg.editId
      state.edit.processTermIds = unique([...state.edit.processTermIds, term.id])

      state.terms = upsertObject([...state.terms], term)
      state.relationTerms = upsertObject([...state.relationTerms], relationTerm)
    })
    .addCase(updateTerm.fulfilled, (state: ConfigType, action: { meta: { arg: UpdateType }, payload: UpdateType }) => {
      const { term } = action.meta.arg
      state.edit.processTermIds = remove(state.edit.processTermIds, term.id)
    })

  builder
    .addCase(editTerm.pending, (state: ConfigType, action: { meta: { arg: EditType } }) => {
      const { editId } = action.meta.arg
      state.edit.termId = editId
    })
}
