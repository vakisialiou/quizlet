import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

type UpdateType = {
  termUUID:string
  folderUUID: string
}

type RemoveType = {
  folderUUID: string
}

export type DataStateSimulatorType = {
  termUUID: string,
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
      const prevState = state[payload.folderUUID] || { }
      return {
        ...state,
        [payload.folderUUID]: {
          ...prevState,
          termUUID: payload.termUUID
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
    }
  }
}
