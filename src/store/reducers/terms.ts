import { unique, remove, upsertObject, removeObject } from '@lib/array'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'
import ClientFolder from '@entities/ClientFolder'
import { clientFetch } from '@lib/fetch-client'
import ClientTerm from '@entities/ClientTerm'

export type SaveType = {
  term: ClientTerm,
  editId?: string | null,
}

export const saveTerm = createAsyncThunk(
  '/save/term',
  async (payload: SaveType): Promise<SaveType> => {
    const res = await clientFetch(`/api/terms/${payload.term.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        sort: payload.term.sort,
        answer: payload.term.answer,
        question: payload.term.question,
        folderId: payload.term.folderId,
      })
    })

    if (!res.ok) {
      throw new Error('Save term error.', { cause: res.statusText })
    }

    return payload
  }
)

export const deleteTerm = createAsyncThunk(
  '/delete/term',
  async (payload: ClientTerm): Promise<ClientTerm> => {
    const res = await clientFetch(`/api/terms/${payload.id}`, { method: 'DELETE' })

    if (!res.ok) {
      throw new Error('Delete term error.', { cause: res.statusText })
    }

    return payload
  }
)

export type UpdateType = Partial<{ editId?: string | null, processIds?: (string)[] }>

export const updateTerm= createAsyncThunk(
  '/update/term',
  async (payload: UpdateType): Promise<UpdateType> => {
    return payload
  }
)

export const updateTermItem = createAsyncThunk(
  '/update/term/item',
  async (payload: ClientTerm): Promise<ClientTerm> => {
    return payload
  }
)

export const termReducers = (builder: any) => {
  builder
    .addCase(saveTerm.pending, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const arg = action.meta.arg
      state.terms = {
        ...state.terms,
        processIds: unique([...state.terms.processIds, arg.term.id]),
        editId: arg.editId !== undefined ? arg.editId : state.terms.editId,
      }

      const folder = state.folders.items.find(({ id }) => id === arg.term.folderId) as ClientFolder
      folder.terms = upsertObject([...folder.terms], arg.term) as ClientTerm[]

      state.folders = {
        ...state.folders,
        items: upsertObject([...state.folders.items], folder) as ClientFolder[],
      }
    })
    .addCase(saveTerm.rejected, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const arg = action.meta.arg
      state.terms = {
        ...state.terms,
        editId: null,
        processIds: remove(state.terms.processIds, arg.term.id)
      }

      const folder = state.folders.items.find(({ id }) => id === arg.term.folderId) as ClientFolder
      folder.terms = removeObject([...folder.terms], arg.term) as ClientTerm[]

      state.folders = {
        ...state.folders,
        items: upsertObject([...state.folders.items], folder) as ClientFolder[],
      }

    })
    .addCase(saveTerm.fulfilled, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      state.terms = {
        ...state.terms,
        processIds: remove(state.terms.processIds, action.meta.arg.term.id)
      }

    })

  builder
    .addCase(deleteTerm.pending, (state: ConfigType, action: { meta: { arg: ClientTerm } }) => {
      state.terms = {
        ...state.terms,
        processIds: unique([...state.terms.processIds, action.meta.arg.id])
      }
    })
    .addCase(deleteTerm.rejected, (state: ConfigType, action: { meta: { arg: ClientTerm } }) => {
      state.terms = {
        ...state.terms,
        processIds: remove(state.terms.processIds, action.meta.arg.id)
      }
    })
    .addCase(deleteTerm.fulfilled, (state: ConfigType, action: { meta: { arg: ClientTerm } }) => {
      state.terms = {
        ...state.terms,
        processIds: remove(state.terms.processIds, action.meta.arg.id)
      }

      const folder = state.folders.items.find(({ id }) => id === action.meta.arg.folderId) as ClientFolder
      folder.terms = removeObject([...folder.terms], action.meta.arg) as ClientTerm[]

      state.folders = {
        ...state.folders,
        items: upsertObject([...state.folders.items], folder) as ClientFolder[],
      }
    })

  builder
    .addCase(updateTerm.fulfilled, (state: ConfigType, action: { meta: { arg: UpdateType }, payload: UpdateType }) => {
      state.terms = {
        ...state.terms,
        editId: action.payload.editId !== undefined ? action.payload.editId : state.terms.editId,
        processIds: action.payload.processIds !== undefined ? action.payload.processIds : state.terms.processIds,
      }
    })

  builder
    .addCase(updateTermItem.fulfilled, (state: ConfigType, action: { meta: { arg: ClientTerm }, payload: ClientTerm }) => {
      const folder = state.folders.items.find(({ id }) => id === action.meta.arg.folderId) as ClientFolder
      folder.terms = upsertObject([...folder.terms], action.meta.arg) as ClientTerm[]

      state.folders = {
        ...state.folders,
        items: upsertObject([...state.folders.items], folder) as ClientFolder[],
      }
    })
}
