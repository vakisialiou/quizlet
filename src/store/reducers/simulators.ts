import { SimulatorStatus } from '@containers/Simulator/status'
import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { unique } from '@lib/array'
import {filterTerms} from "@containers/Simulator/filter";
import {randomArrayElement} from "@lib/random";

export type DataStateSimulatorType = {
  status: SimulatorStatus,
  termUUID: string | null,
  rememberUUIDs: string[],
  continueUUIDs: string[],
  historyUUIDs: string[],
}

export type DataStateSimulatorsType = {
  [folderUUID: string]: DataStateSimulatorType
}

export const createSimulatorState = () => {
  return {
    status: SimulatorStatus.WAITING,
    termUUID: null,
    rememberUUIDs: [],
    continueUUIDs: [],
    historyUUIDs: [],
  }
}

export const createPreloadedSimulatorsState = (initialData: DataStateSimulatorsType): DataStateSimulatorsType => {
  return initialData
}

const slice = createSlice({
  name: 'simulators',
  initialState: {} as DataStateSimulatorsType,
  reducers: {
    start: (state, { payload }: { payload: { termUUID: string, folderUUID: string } }) => {
      return {
        ...state,
        [payload.folderUUID]: {
          ...createSimulatorState(),
          status: SimulatorStatus.PROCESSING,
          termUUID: payload.termUUID,
          historyUUIDs: [payload.termUUID]
        }
      }
    },
    restart: (state, { payload }: { payload: { folderUUID: string } }) => {
      const prevState = state[payload.folderUUID] || createSimulatorState()
      return {
        ...state,
        [payload.folderUUID]: {
          ...prevState,
          status: SimulatorStatus.PROCESSING,
          termUUID: randomArrayElement(prevState.continueUUIDs),
          continueUUIDs: []
        }
      }
    },
    rememberAndFinish: (state, { payload }: { payload: { folderUUID: string } }) => {
      const prevState = state[payload.folderUUID] || createSimulatorState()
      return {
        ...state,
        [payload.folderUUID]: {
          ...prevState,
          status: SimulatorStatus.FINISHING,
          rememberUUIDs: unique([...prevState.rememberUUIDs, prevState.termUUID])
        }
      }
    },
    continueAndFinish: (state, { payload }: { payload: { folderUUID: string } }) => {
      const prevState = state[payload.folderUUID] || createSimulatorState()
      return {
        ...state,
        [payload.folderUUID]: {
          ...prevState,
          status: SimulatorStatus.FINISHING,
          continueUUIDs: unique([...prevState.continueUUIDs, prevState.termUUID])
        }
      }
    },
    remember: (state, { payload }: { payload: { termUUID: string, folderUUID: string } }) => {
      const prevState = state[payload.folderUUID] || createSimulatorState()
      return {
        ...state,
        [payload.folderUUID]: {
          ...prevState,
          termUUID: payload.termUUID,
          rememberUUIDs: unique([...prevState.rememberUUIDs, prevState.termUUID])
        }
      }
    },
    continue: (state, { payload }: { payload: { termUUID: string, folderUUID: string } }) => {
      const prevState = state[payload.folderUUID] || createSimulatorState()
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
    start: (payload: { termUUID: string, folderUUID: string }) => {
      dispatch(slice.actions.start(payload))
    },
    rememberAndFinish: (payload: { folderUUID: string }) => {
      dispatch(slice.actions.rememberAndFinish(payload))
    },
    continueAndFinish: (payload: { folderUUID: string }) => {
      dispatch(slice.actions.continueAndFinish(payload))
    },
    restart: (payload: { folderUUID: string }) => {
      dispatch(slice.actions.restart(payload))
    },
    remember: (payload: { termUUID: string, folderUUID: string }) => {
      dispatch(slice.actions.remember(payload))
    },
    continue: (payload: { termUUID: string, folderUUID: string }) => {
      dispatch(slice.actions.continue(payload))
    },
  }
}
