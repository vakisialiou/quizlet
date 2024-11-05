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
          termUUID: payload.termUUID,
          status: SimulatorStatus.PROCESSING
        }
      }
    },
    restart: (state, { payload }: { payload: { folderUUID: string } }) => {
      const prevState = state[payload.folderUUID] || createSimulatorState()
      const termUUID = randomArrayElement(prevState.continueUUIDs)
      return {
        ...state,
        [payload.folderUUID]: {
          ...prevState,
          termUUID,
          continueUUIDs: [],
          status: SimulatorStatus.PROCESSING
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
          rememberUUIDs: unique([...prevState.rememberUUIDs, prevState.termUUID]),
          historyUUIDs: prevState.termUUID ? [...prevState.historyUUIDs, prevState.termUUID] : [...prevState.historyUUIDs],
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
          continueUUIDs: unique([...prevState.continueUUIDs, prevState.termUUID]),
          historyUUIDs: prevState.termUUID ? [...prevState.historyUUIDs, prevState.termUUID] : [...prevState.historyUUIDs],
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
          rememberUUIDs: unique([...prevState.rememberUUIDs, prevState.termUUID]),
          historyUUIDs: prevState.termUUID ? [...prevState.historyUUIDs, prevState.termUUID] : [...prevState.historyUUIDs],
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
          continueUUIDs: unique([...prevState.continueUUIDs, prevState.termUUID]),
          historyUUIDs: prevState.termUUID ? [...prevState.historyUUIDs, prevState.termUUID] : [...prevState.historyUUIDs],
        }
      }
    },
    back: (state, { payload }: { payload: { folderUUID: string } }) => {
      const prevState = state[payload.folderUUID] || createSimulatorState()

      if (prevState.historyUUIDs.length === 0) {
        return { ...state,}
      }

      const historyUUIDs = [...prevState.historyUUIDs]
      const termUUID = historyUUIDs.splice(-1)[0]

      return {
        ...state,
        [payload.folderUUID]: {
          ...prevState,
          termUUID,
          historyUUIDs,
          continueUUIDs: [...prevState.continueUUIDs ].filter((uuid) => uuid !== termUUID),
          rememberUUIDs: [...prevState.rememberUUIDs ].filter((uuid) => uuid !== termUUID),
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
    back: (payload: { folderUUID: string }) => {
      dispatch(slice.actions.back(payload))
    },
  }
}
