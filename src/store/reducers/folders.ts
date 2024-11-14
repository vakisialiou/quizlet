import { createAsyncThunk } from '@reduxjs/toolkit'
import ClientFolder from '@entities/ClientFolder'
import { clientFetch } from '@lib/fetch-client'
import {unique, remove, upsertObject, removeObject} from '@lib/array'
import { ConfigType } from '@store/types'

export const fetchFolders = createAsyncThunk(
  '/fetch/folders',
  async (): Promise<ClientFolder[]> => {
    return clientFetch('/api/folders')
      .then((res) => res.json())
      .then((json) => json.items)
  }
)

export type SaveType = {
  folder: ClientFolder,
  editId?: string | null,
}

export const saveFolder = createAsyncThunk(
  '/save/folder',
  async (payload: SaveType): Promise<SaveType> => {
    const res = await clientFetch(`/api/folders/${payload.folder.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: payload.folder.name })
      })

    if (!res.ok) {
      throw new Error('Put folder error.', { cause: res.statusText })
    }

    return payload
  }
)

export const deleteFolder = createAsyncThunk(
  '/delete/folder',
  async (payload: ClientFolder): Promise<ClientFolder> => {
    const res = await clientFetch(`/api/folders/${payload.id}`, { method: 'DELETE' })

    if (!res.ok) {
      throw new Error('Del folder error.', { cause: res.statusText })
    }

    return payload
  }
)

export type UpdateType = Partial<{ items?: ClientFolder[], editId?: string | null, processIds?: (string)[], process?: boolean }>

export const updateFolder = createAsyncThunk(
  '/update/folder',
  async (payload: UpdateType): Promise<UpdateType> => {
    return payload
  }
)

export const updateFolderItem = createAsyncThunk(
  '/update/folder/item',
  async (payload: ClientFolder): Promise<ClientFolder> => {
    return payload
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

  builder
    .addCase(saveFolder.pending, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const arg = action.meta.arg
      state.folders = {
        ...state.folders,
        processIds: unique([...state.folders.processIds, arg.folder.id]),
        editId: arg.editId !== undefined ? arg.editId : state.folders.editId,
        items: upsertObject([...state.folders.items], arg.folder) as ClientFolder[],
      }
    })
    .addCase(saveFolder.rejected, (state: ConfigType, action: { meta: { arg: ClientFolder } }) => {
      const folder = action.meta.arg
      state.folders = {
        ...state.folders,
        editId: null,
        items: removeObject([...state.folders.items], folder) as ClientFolder[],
        processIds: remove(state.folders.processIds, folder.id)
      }
    })
    .addCase(saveFolder.fulfilled, (state: ConfigType, action: { meta: { arg: ClientFolder } }) => {
      state.folders = {
        ...state.folders,
        processIds: remove(state.folders.processIds, action.meta.arg.id)
      }
    })

  builder
    .addCase(deleteFolder.pending, (state: ConfigType, action: { meta: { arg: ClientFolder } }) => {
      state.folders = {
        ...state.folders,
        items: [...state.folders.items].filter((item) => item.id !== action.meta.arg.id),
        processIds: unique([...state.folders.processIds, action.meta.arg.id])
      }
    })
    .addCase(deleteFolder.rejected, (state: ConfigType, action: { meta: { arg: ClientFolder } }) => {
      state.folders = {
        ...state.folders,
        items: [...state.folders.items, action.meta.arg],
        processIds: remove(state.folders.processIds, action.meta.arg.id)
      }
    })
    .addCase(deleteFolder.fulfilled, (state: ConfigType, action: { meta: { arg: ClientFolder } }) => {
      state.folders = {
        ...state.folders,
        processIds: remove(state.folders.processIds, action.meta.arg.id)
      }
    })

  builder
    .addCase(updateFolder.fulfilled, (state: ConfigType, action: { meta: { arg: UpdateType }, payload: UpdateType }) => {
      state.folders = {
        ...state.folders,
        items: action.payload.items !== undefined ? action.payload.items : state.folders.items,
        editId: action.payload.editId !== undefined ? action.payload.editId : state.folders.editId,
        process: action.payload.process !== undefined ? action.payload.process : state.folders.process,
        processIds: action.payload.processIds !== undefined ? action.payload.processIds : state.folders.processIds,
      }
    })

  builder
    .addCase(updateFolderItem.fulfilled, (state: ConfigType, action: { meta: { arg: ClientFolder }, payload: ClientFolder }) => {
      state.folders = {
        ...state.folders,
        items: upsertObject([...state.folders.items], action.payload) as ClientFolder[]
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
