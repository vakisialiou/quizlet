import { createAsyncThunk } from '@reduxjs/toolkit'
import ClientFolder from '@entities/ClientFolder'
import { clientFetch } from '@lib/fetch-client'
import { unique, remove } from '@lib/array'
import { ConfigType } from '@store/types'

export const fetchFolders = createAsyncThunk(
  '/fetch/folders',
  async (): Promise<ClientFolder[]> => {
    return clientFetch('/api/folders')
      .then((res) => res.json())
      .then((json) => json.items)
  }
)

export const putFolder = createAsyncThunk(
  '/put/folder',
  async (payload: ClientFolder): Promise<ClientFolder | null> => {
    const res = await clientFetch(`/api/folders/${payload.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: payload.name,
        })
      })

    if (res.ok) {
      return payload
    }

    return null
  }
)

export const folderReducers = (builder: any) => {
  builder
    .addCase(fetchFolders.pending, (state: ConfigType) => {
      state.folders = { ...state.folders, process: true }
    })
    .addCase(fetchFolders.rejected, (state: ConfigType) => {
      state.folders = { ...state.folders, process: false }
    })
    .addCase(fetchFolders.fulfilled, (state: ConfigType, action: { payload: ClientFolder[] }) => {
      state.folders = {
        editId: null,
        process: false,
        processIds: [],
        items: [...action.payload],
      }
    })

    .addCase(putFolder.pending, (state: ConfigType, action: { meta: { arg: ClientFolder } }) => {
      state.folders = {
        ...state.folders,
        editId: action.meta.arg.id,
        items: [...state.folders.items, action.meta.arg],
        processIds: unique([...state.folders.processIds, action.meta.arg.id])
      }
    })
    .addCase(putFolder.rejected, (state: ConfigType, action: { meta: { arg: ClientFolder } }) => {
      state.folders = {
        ...state.folders,
        editId: null,
        items: state.folders.items.filter((folder: ClientFolder) => folder.id === action.meta.arg.id),
        processIds: remove(state.folders.processIds, action.meta.arg.id)
      }
    })
    .addCase(putFolder.fulfilled, (state: ConfigType, action: { meta: { arg: ClientFolder } }) => {
      state.folders = {
        ...state.folders,
        processIds: remove(state.folders.processIds, action.meta.arg.id)
      }
    })
}

// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import ClientFolder from '@entities/ClientFolder'
// import { apiPrivateFetch } from '@lib/fetch'
// import { useDispatch } from 'react-redux'
//
// export type DataStateFoldersType = {
//   items: ClientFolder[],
//   editId: string | null,
//   processIds: (string)[]
// }
//
// type AddType = { editId?: string, folder: ClientFolder }
// type UpdateType = Partial<{ items?: ClientFolder[], editId?: string | null, processIds?: (string)[] }>
//

//
// const slice = createSlice({
//   name: 'folders',
//   initialState: {
//     items: [],
//     editId: null,
//     processIds: [],
//   } as DataStateFoldersType,
//   reducers: {
//     refresh: async (state) => {
//       const res = await apiPrivateFetch('/api/folders')
//       const { items } = await res.json()
//       return {
//         ...state,
//         editId: null,
//         items: [...items],
//       }
//     },
//     // put: async (state, action: { payload: AddType }) => {
//     //   const updated = await apiPrivateFetch(`/api/folders/${action.payload.folder.id}`, {
//     //     method: 'PUT',
//     //     body: JSON.stringify({
//     //       id: action.payload.folder.id,
//     //       name: action.payload.folder.name,
//     //     })
//     //   })
//     //
//     //   return { ...state }
//     // },
//     // del: async (state, id: string) => {
//     //   await apiPrivateFetch(`/api/folders/${id}`, { method: 'DELETE' })
//     // },
//
//     addFolder: (state, action: { payload: AddType }) => {
//       return {
//         ...state,
//         editId: action.payload.editId || null,
//         items: [...state.items, action.payload.folder],
//       }
//     },
//     updateFolder: (state, action: { payload: UpdateType }) => {
//       return {
//         ...state,
//         items: action.payload.items !== undefined ? action.payload.items : state.items,
//         editId: action.payload.editId !== undefined ? action.payload.editId : state.editId,
//         processIds: action.payload.processIds !== undefined ? action.payload.processIds : state.processIds,
//       };
//     },
//   },
//   extraReducers(builder) {
//     builder
//       .addCase(fetchFolders.pending, (state) => {
//         // Логика на этапе ожидания
//         console.log('Загрузка...');
//       })
//       .addCase(fetchFolders.fulfilled, (state, action) => {
//         // Логика после успешного получения данных
//         state.items = [...action.payload];
//         state.editId = null;
//       })
//       .addCase(fetchFolders.rejected, (state) => {
//         // Логика на этапе ошибки
//         console.error('Ошибка при загрузке');
//       });
//   }
// })
//
// export default slice.reducer
//
// export const useFolderActions = () => {
//   const dispatch = useDispatch()
//   return {
//     refresh: () => {
//       dispatch(slice.actions.refresh())
//     },
//     addFolder: (payload: AddType) => {
//       dispatch(slice.actions.addFolder(payload))
//     },
//     updateFolder: (payload: UpdateType) => {
//       dispatch(slice.actions.updateFolder(payload))
//     }
//   }
// }
