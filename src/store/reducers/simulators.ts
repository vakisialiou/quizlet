import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { unique } from '@lib/array'

export const PROCESSING = 'processing'
export const FINISHING = 'finishing'
export const WAITING = 'waiting'

type UpdateType = {
  termUUID: string | null
  folderUUID: string
}

type RemoveType = {
  folderUUID: string
}

export type DataStateSimulatorType = {
  status: '',
  termUUID: string | null,
  rememberUUIDs: string[],
  continueUUIDs: string[],
  historyUUIDs: string[],
}

export type DataStateSimulatorsType = {
  [folderUUID: string]: DataStateSimulatorType
}

export const createPreloadedSimulatorsState = (initialData: DataStateSimulatorsType): DataStateSimulatorsType => {
  return initialData
}

const slice = createSlice({
  name: 'simulators',
  initialState: {} as DataStateSimulatorsType,
  reducers: {
    removeSimulator: (state, { payload }: { payload: RemoveType }) => {
      const prevState = { ...state }
      delete prevState[payload.folderUUID]
      return prevState
    },
    updateSimulator: (state, { payload }: { payload: UpdateType }) => {
      const prevState = state[payload.folderUUID] || {
        historyUUIDs: [],
        rememberUUIDs: [],
        continueUUIDs: [],
      }
      return {
        ...state,
        [payload.folderUUID]: {
          ...prevState,
          termUUID: payload.termUUID,
        }
      }
    },
    remember: (state, { payload }: { payload: UpdateType }) => {
      const prevState = state[payload.folderUUID] || { }
      return {
        ...state,
        [payload.folderUUID]: {
          ...prevState,
          termUUID: payload.termUUID,
          rememberUUIDs: unique([...prevState.rememberUUIDs, prevState.termUUID])
        }
      }
    },
    continue: (state, { payload }: { payload: UpdateType }) => {
      const prevState = state[payload.folderUUID] || { }
      return {
        ...state,
        [payload.folderUUID]: {
          ...prevState,
          termUUID: payload.termUUID,
          continueUUIDs: unique([...prevState.continueUUIDs, prevState.termUUID])
        }
      }
    },
  },
})

export default slice.reducer

export const useSimulatorActions = () => {
  const dispatch = useDispatch()
  return {
    removeSimulator: (payload: RemoveType) => {
      dispatch(slice.actions.removeSimulator(payload))
    },
    updateSimulator: (payload: UpdateType) => {
      dispatch(slice.actions.updateSimulator(payload))
    },
    remember: (payload: UpdateType) => {
      dispatch(slice.actions.remember(payload))
    },
    continue: (payload: UpdateType) => {
      dispatch(slice.actions.continue(payload))
    },
  }
}
