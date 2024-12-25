import { getClientFolders, saveClientFolderData, deleteClientFolderData, DeleteClientFolderResults } from '@store/fetch/folders'
import { unique, remove, upsertObject, removeObject } from '@lib/array'
import { createPartitions } from '@store/fetch/partitions'
import { ClientFolderData } from '@entities/ClientFolder'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'

export const fetchFolders = createAsyncThunk(
  '/fetch/folders',
  async (): Promise<ClientFolderData[]> => {
    return getClientFolders()
  }
)

export type PartitionsType = {
  folderId: string,
  partitionSize: number,
}

export const createFolderPartitions = createAsyncThunk(
  '/create/folder/partitions',
  async (payload: PartitionsType): Promise<ClientFolderData[]> => {
    return createPartitions(payload.folderId, payload.partitionSize)
  }
)

export type SaveType = {
  folder: ClientFolderData,
  editId?: string | null,
}

export const saveFolder = createAsyncThunk(
  '/save/folder',
  async (payload: SaveType, api): Promise<SaveType> => {
    const state = api.getState() as ConfigType
    if (state.serverQueryEnabled) {
      await saveClientFolderData(payload.folder)
    }
    return payload
  }
)

export type DeleteType = {
  folder: ClientFolderData,
}

export const deleteFolder = createAsyncThunk(
  '/delete/folder/module',
  async (payload: DeleteType): Promise<DeleteClientFolderResults> => {
    return await deleteClientFolderData(payload.folder.id)
  }
)

export type UpdateType = Partial<{ items?: ClientFolderData[], editId?: string | null, processIds?: (string)[], process?: boolean }>

export const updateFolder = createAsyncThunk(
  '/update/folder',
  async (payload: UpdateType): Promise<UpdateType> => {
    return payload
  }
)

export const updateFolderItem = createAsyncThunk(
  '/update/folder/item',
  async (payload: ClientFolderData): Promise<ClientFolderData> => {
    return payload
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const folderReducers = (builder: any) => {
  builder
    .addCase(fetchFolders.pending, (state: ConfigType) => {
      state.folders = { ...state.folders, process: true }
    })
    .addCase(fetchFolders.rejected, (state: ConfigType) => {
      state.folders = { ...state.folders, process: false }
    })
    .addCase(fetchFolders.fulfilled, (state: ConfigType, action: { payload: ClientFolderData[] }) => {
      state.folders = {
        editId: null,
        process: false,
        processIds: [],
        items: [...action.payload],
      }
    })

  builder
    .addCase(createFolderPartitions.pending, (state: ConfigType, action: { meta: { arg: PartitionsType } }) => {
      state.folders = {
        ...state.folders,
        process: true,
        processIds: unique([...state.folders.processIds, action.meta.arg.folderId]),
      }
    })
    .addCase(createFolderPartitions.rejected, (state: ConfigType, action: { meta: { arg: PartitionsType } }) => {
      state.folders = {
        ...state.folders,
        process: false,
        processIds: remove(state.folders.processIds, action.meta.arg.folderId)
      }
    })
    .addCase(createFolderPartitions.fulfilled, (state: ConfigType, action: { payload: ClientFolderData[], meta: { arg: PartitionsType } }) => {
      let items = [...state.folders.items]
      for (const item of action.payload) {
        items = upsertObject([...items], { ...item })
      }
      state.folders = {
        ...state.folders,
        processIds: remove(state.folders.processIds, action.meta.arg.folderId),
        process: false,
        items,
      }
    })

  builder
    .addCase(saveFolder.pending, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const arg = action.meta.arg
      state.folders = {
        ...state.folders,
        processIds: unique([...state.folders.processIds, arg.folder.id]),
        editId: arg.editId !== undefined ? arg.editId : state.folders.editId,
        items: upsertObject([...state.folders.items], arg.folder) as ClientFolderData[],
      }
    })
    .addCase(saveFolder.rejected, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const { folder } = action.meta.arg
      state.folders = {
        ...state.folders,
        editId: null,
        items: removeObject([...state.folders.items], folder) as ClientFolderData[],
        processIds: remove(state.folders.processIds, folder.id)
      }
    })
    .addCase(saveFolder.fulfilled, (state: ConfigType, action: { meta: { arg: SaveType } }) => {
      const { folder } = action.meta.arg

      state.folders = {
        ...state.folders,
        processIds: remove(state.folders.processIds, folder.id)
      }
    })

  builder
    .addCase(deleteFolder.pending, (state: ConfigType, action: { meta: { arg: DeleteType } }) => {
      state.folders = {
        ...state.folders,
        processIds: unique([...state.folders.processIds, action.meta.arg.folder.id])
      }
    })
    .addCase(deleteFolder.rejected, (state: ConfigType, action: { meta: { arg: DeleteType } }) => {
      state.folders = {
        ...state.folders,
        processIds: remove(state.folders.processIds, action.meta.arg.folder.id)
      }
    })
    .addCase(deleteFolder.fulfilled, (state: ConfigType, action: { meta: { arg: DeleteType }, payload: DeleteClientFolderResults }) => {
      const { folder } = action.meta.arg
      const { refreshFolder, removeFolderIds } = action.payload

      let items = [...state.folders.items]
        .filter((item) => !removeFolderIds.includes(item.id))

      if (refreshFolder) {
        items = upsertObject(items, refreshFolder)
      }

      state.folders = {
        ...state.folders,
        items,
        processIds: remove(state.folders.processIds, folder.id)
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
    .addCase(updateFolderItem.fulfilled, (state: ConfigType, action: { meta: { arg: ClientFolderData }, payload: ClientFolderData }) => {
      state.folders = {
        ...state.folders,
        items: upsertObject([...state.folders.items], action.payload) as ClientFolderData[]
      }
    })
}
