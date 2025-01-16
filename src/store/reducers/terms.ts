import { unique, remove, upsertObject } from '@lib/array'
import { upsertTermData } from '@store/fetch/terms'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'
import { TermData } from '@entities/Term'

export type UpsertType = {
  term: TermData,
  editId: string | null
  shareId: string | null
  editable: boolean,
}

export const upsertTerm = createAsyncThunk(
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

export const editTerm = createAsyncThunk(
  '/term/edit',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (payload: EditType): Promise<boolean> => {
    return true
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const termReducers = (builder: any) => {
  builder
    .addCase(upsertTerm.pending, (state: ConfigType, action: { meta: { arg: UpsertType } }) => {
      const { term, editId } = action.meta.arg

      state.edit.termId = editId
      state.edit.processTermIds = unique([...state.edit.processTermIds, term.id])

      state.terms = upsertObject([...state.terms], term)
    })
    .addCase(upsertTerm.fulfilled, (state: ConfigType, action: { meta: { arg: UpsertType } }) => {
      const { term } = action.meta.arg
      state.edit.processTermIds = remove(state.edit.processTermIds, term.id)
    })

  builder
    .addCase(editTerm.pending, (state: ConfigType, action: { meta: { arg: EditType } }) => {
      const { editId } = action.meta.arg
      state.edit.termId = editId
    })
}
