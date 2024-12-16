import { unique, remove, upsertObject, removeObject } from '@lib/array'
import { ClientFolderData } from '@entities/ClientFolder'
import { saveClientTermData } from '@store/fetch/terms'
import { ClientTermData } from '@entities/ClientTerm'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'

export type SaveType = {
  term: ClientTermData,
  editId?: string | null,
}

export const saveTerm = createAsyncThunk(
  '/save/term',
  async (payload: SaveType): Promise<SaveType> => {
    await saveClientTermData(payload.term)
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
  async (payload: ClientTermData): Promise<ClientTermData> => {
    return payload
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const termReducers = (builder: any) => {
  builder
    .addCase(saveTerm.pending, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const arg = action.meta.arg
      state.terms = {
        ...state.terms,
        processIds: unique([...state.terms.processIds, arg.term.id]),
        editId: arg.editId !== undefined ? arg.editId : state.terms.editId,
      }

      const folder = state.folders.items.find(({ id }) => id === arg.term.folderId) as ClientFolderData
      folder.terms = upsertObject([...folder.terms], arg.term) as ClientTermData[]

      state.folders = {
        ...state.folders,
        items: upsertObject([...state.folders.items], folder) as ClientFolderData[],
      }
    })
    .addCase(saveTerm.rejected, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const arg = action.meta.arg
      state.terms = {
        ...state.terms,
        editId: null,
        processIds: remove(state.terms.processIds, arg.term.id)
      }

      const folder = state.folders.items.find(({ id }) => id === arg.term.folderId) as ClientFolderData
      folder.terms = removeObject([...folder.terms], arg.term) as ClientTermData[]

      state.folders = {
        ...state.folders,
        items: upsertObject([...state.folders.items], folder) as ClientFolderData[],
      }

    })
    .addCase(saveTerm.fulfilled, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      state.terms = {
        ...state.terms,
        processIds: remove(state.terms.processIds, action.meta.arg.term.id)
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
    .addCase(updateTermItem.fulfilled, (state: ConfigType, action: { meta: { arg: ClientTermData }, payload: ClientTermData }) => {
      const folder = state.folders.items.find(({ id }) => id === action.meta.arg.folderId) as ClientFolderData
      folder.terms = upsertObject([...folder.terms], action.meta.arg) as ClientTermData[]

      state.folders = {
        ...state.folders,
        items: upsertObject([...state.folders.items], folder) as ClientFolderData[],
      }
    })
}
