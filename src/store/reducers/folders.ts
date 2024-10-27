import { ClientFolderType } from '@entities/ClientFolder'
import { createSlice } from '@reduxjs/toolkit'

export type DataStateType = {
  items: ClientFolderType[],
  editUUID: string | number | null,
  processUUIDs: (string | number)[]
}

const foldersSlice = createSlice({
  name: 'folders',
  initialState: {} as DataStateType,
  reducers: {
    setFolders: (state, action: { payload: ClientFolderType[] }) => {
      return {
        ...state,
        items: [...action.payload],
      }
    },
    addFolder: (state, action: { payload: { editUUID?: string, folder: ClientFolderType } }) => {
      return {
        ...state,
        editUUID: action.payload.editUUID || null,
        items: [...state.items, action.payload.folder],
      }
    },
    updateFolder: (state, action: { payload: Partial<{ items?: ClientFolderType[], editUUID?: string | null, processUUIDs?: (string | number)[] }> }) => {
      return {
        ...state,
        items: action.payload.items !== undefined ? action.payload.items : state.items,
        editUUID: action.payload.editUUID !== undefined ? action.payload.editUUID : state.editUUID,
        processUUIDs: action.payload.processUUIDs !== undefined ? action.payload.processUUIDs : state.processUUIDs,
      };
    },
  },
})

export const {
  addFolder,
  setFolders,
  updateFolder
} = foldersSlice.actions

export default foldersSlice.reducer
