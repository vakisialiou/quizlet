import { ClientTermType } from '@entities/ClientTerm'
import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

type AddType = {
  editUUID?: string | null,
  term: ClientTermType
}

type UpdateType = {
  folderUUID: string,
  items?: ClientTermType[],
  editUUID?: string | null,
  processUUIDs?: (string | number)[]
}

export type DataStateTermType = {
  items: ClientTermType[],
  editUUID: string | null,
  processUUIDs: (string | number)[]
}

export type DataStateTermsType = {
  [folderUUID: string]: DataStateTermType
}

export const createPreloadedTermsState = (terms: ClientTermType[]): DataStateTermsType => {
  const initialData = {} as DataStateTermsType
  for (let item of terms) {
    if (item.folderUUID in initialData) {
      initialData[item.folderUUID]['items'].push(item)
    } else {
      initialData[item.folderUUID] = {
        items: [item],
        editUUID: null,
        processUUIDs: []
      }
    }
  }
  return initialData
}

const slice = createSlice({
  name: 'terms',
  initialState: {} as DataStateTermsType,
  reducers: {
    addTerm: (state, { payload }: { payload: AddType }) => {
      const prevState = state[payload.term.folderUUID] || { items: [], editUUID: null, processUUIDs: [] }

      return {
        ...state,
        [payload.term.folderUUID]: {
          ...prevState,
          editUUID: payload.editUUID || null,
          items: [payload.term, ...prevState.items],
        }
      }
    },
    updateTerm: (state, { payload }: { payload: UpdateType }) => {
      const prevState = state[payload.folderUUID] || {}
      return {
        ...state,
        [payload.folderUUID]: {
          ...prevState,
          items: payload.items !== undefined ? payload.items : prevState.items,
          editUUID: payload.editUUID !== undefined ? payload.editUUID : prevState.editUUID,
          processUUIDs: payload.processUUIDs !== undefined ? payload.processUUIDs : prevState.processUUIDs,
        },
      }
    },
  },
})

export default slice.reducer

export const useTermActions = () => {
  const dispatch = useDispatch()
  return {
    addTerm: (payload: AddType) => {
      dispatch(slice.actions.addTerm(payload))
    },
    updateTerm: (payload: UpdateType) => {
      dispatch(slice.actions.updateTerm(payload))
    }
  }
}
