import { ClientFolderType } from '@entities/ClientFolder'
import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

export type DataStateFoldersType = {
  items: ClientFolderType[],
  editUUID: string | number | null,
  processUUIDs: (string | number)[]
}

type AddType = { editUUID?: string, folder: ClientFolderType }
type UpdateType = Partial<{ items?: ClientFolderType[], editUUID?: string | null, processUUIDs?: (string | number)[] }>

export const createPreloadedFoldersState = (items: ClientFolderType[]): DataStateFoldersType => {
  return {
    items,
    editUUID: null,
    processUUIDs: [],
  }
}

const slice = createSlice({
  name: 'folders',
  initialState: {} as DataStateFoldersType,
  reducers: {
    addFolder: (state, action: { payload: AddType }) => {
      return {
        ...state,
        editUUID: action.payload.editUUID || null,
        items: [...state.items, action.payload.folder],
      }
    },
    updateFolder: (state, action: { payload: UpdateType }) => {
      return {
        ...state,
        items: action.payload.items !== undefined ? action.payload.items : state.items,
        editUUID: action.payload.editUUID !== undefined ? action.payload.editUUID : state.editUUID,
        processUUIDs: action.payload.processUUIDs !== undefined ? action.payload.processUUIDs : state.processUUIDs,
      };
    },
  },
})

export default slice.reducer

export const useFolderActions = () => {
  const dispatch = useDispatch()
  return {
    addFolder: (payload: AddType) => {
      dispatch(slice.actions.addFolder(payload))
    },
    updateFolder: (payload: UpdateType) => {
      dispatch(slice.actions.updateFolder(payload))
    }
  }
}
