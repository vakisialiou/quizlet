import {ConfigType, SimulatorStatus, SimulatorsType} from '@store/initial-state'
import { fetchFolders } from '@store/reducers/folders'
import {createAsyncThunk} from '@reduxjs/toolkit'
import ClientTerm from '@entities/ClientTerm'
import { unique } from '@lib/array'

export const fetchSimulators = createAsyncThunk(
  '/fetch/simulators',
  async (payload, { dispatch }): Promise<SimulatorsType> => {
    await dispatch(fetchFolders())

    return {}
  }
)

export type PayloadStart = { folderId: string, items: ClientTerm[] }

export const startSimulators = createAsyncThunk(
  '/start/simulators',
  async (payload: PayloadStart): Promise<PayloadStart> => {
    return payload
  }
)

export type PayloadContinue = { folderId: string }

export const continueSimulators = createAsyncThunk(
  '/continue/simulators',
  async (payload: PayloadContinue): Promise<PayloadContinue> => {
    return payload
  }
)

export type PayloadRemember = { folderId: string }

export const rememberSimulators = createAsyncThunk(
  '/remember/simulators',
  async (payload: PayloadRemember): Promise<PayloadRemember> => {
    return payload
  }
)

export type PayloadRestart = { folderId: string }

export const restartSimulators = createAsyncThunk(
  '/restart/simulators',
  async (payload: PayloadRestart): Promise<PayloadRestart> => {
    return payload
  }
)

export type PayloadBack = { folderId: string }

export const backSimulators = createAsyncThunk(
  '/back/simulators',
  async (payload: PayloadBack): Promise<PayloadBack> => {
    return payload
  }
)

export const simulatorReducers = (builder: any) => {
  builder
    .addCase(fetchSimulators.fulfilled, (state: ConfigType, action: { payload: SimulatorsType }) => {
      state.simulators = { ...action.payload }
    })

  builder
    .addCase(startSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadStart } }) => {
      const { folderId, items } = action.meta.arg

      state.simulators[folderId] = {
        status: SimulatorStatus.PROCESSING,
        termId: items[0]['id'],
        terms: items,
        historyIds: [],
        rememberIds: [],
        continueIds: []
      }
    })

  builder
    .addCase(continueSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadContinue } }) => {
      const { folderId } = action.meta.arg

      const simulator = state.simulators[folderId]
      if (!simulator.termId) {
        return
      }

      const terms = [...simulator.terms].filter(({ id }) => {
        return !simulator.rememberIds.includes(id) && !simulator.continueIds.includes(id)
      })

      const index = terms.findIndex(({ id }) => id === simulator.termId)
      const nextTerm = terms[index + 1]

      if (nextTerm === undefined) {
        state.simulators[folderId] = {
          ...simulator,
          termId: null,
          status: SimulatorStatus.FINISHING,
          historyIds: [...simulator.historyIds, simulator.termId],
          continueIds: unique([...simulator.continueIds, simulator.termId]),
        }
      } else {
        state.simulators[folderId] = {
          ...simulator,
          termId: nextTerm.id,
          historyIds: [...simulator.historyIds, simulator.termId],
          continueIds: unique([...simulator.continueIds, simulator.termId]),
        }
      }
    })

  builder
    .addCase(rememberSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadRemember } }) => {
      const { folderId } = action.meta.arg

      const simulator = state.simulators[folderId]
      if (!simulator.termId) {
        return
      }

      const terms = [...simulator.terms].filter(({ id }) => {
        return !simulator.rememberIds.includes(id) && !simulator.continueIds.includes(id)
      })

      const index = terms.findIndex(({ id }) => id === simulator.termId)
      const nextTerm = terms[index + 1]

      if (nextTerm === undefined) {
        state.simulators[folderId] = {
          ...simulator,
          termId: null,
          status: SimulatorStatus.FINISHING,
          historyIds: [...simulator.historyIds, simulator.termId],
          rememberIds: unique([...simulator.rememberIds, simulator.termId]),
        }
      } else {
        state.simulators[folderId] = {
          ...simulator,
          termId: nextTerm.id,
          historyIds: [...simulator.historyIds, simulator.termId],
          rememberIds: unique([...simulator.rememberIds, simulator.termId]),
        }
      }
    })

  builder
    .addCase(restartSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadRestart } }) => {
      const { folderId } = action.meta.arg

      const simulator = state.simulators[folderId]

      const terms = [...simulator.terms].filter(({ id }) => {
        return !simulator.rememberIds.includes(id)
      })

      if (terms.length === 0) {
        state.simulators[folderId] = {
          status: SimulatorStatus.DONE,
          termId: null,
          terms: [],
          historyIds: [],
          continueIds: [],
          rememberIds: []
        }
      } else {
        state.simulators[folderId] = {
          ...state.simulators[folderId],
          status: SimulatorStatus.PROCESSING,
          termId: terms[0]['id'],
          continueIds: [],
        }
      }
    })

  builder
    .addCase(backSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadBack } }) => {
      const { folderId } = action.meta.arg

      const simulator = state.simulators[folderId]

      if (simulator.historyIds.length === 0) {
        return
      }

      const historyIds = [...simulator.historyIds]
      const termId = historyIds.splice(-1)[0]

      state.simulators[folderId] = {
        ...simulator,
        termId,
        historyIds,
        continueIds: [...simulator.continueIds ].filter((uuid) => uuid !== termId),
        rememberIds: [...simulator.rememberIds ].filter((uuid) => uuid !== termId),
      }
    })

}

// import { SimulatorStatus } from '@containers/Simulator/status'
// import { createSlice } from '@reduxjs/toolkit'
// import { useDispatch } from 'react-redux'
// import { unique } from '@lib/array'
// import {filterTerms} from "@containers/Simulator/filter";
// import {randomArrayElement} from "@lib/random";
//
// export type DataStateSimulatorType = {
//   status: SimulatorStatus,
//   termUUID: string | null,
//   rememberUUIDs: string[],
//   continueUUIDs: string[],
//   historyUUIDs: string[],
// }
//
// export type DataStateSimulatorsType = {
//   [folderUUID: string]: DataStateSimulatorType
// }
//
// export const createSimulatorState = () => {
//   return {
//     status: SimulatorStatus.WAITING,
//     termUUID: null,
//     rememberUUIDs: [],
//     continueUUIDs: [],
//     historyUUIDs: [],
//   }
// }
//
// export const createPreloadedSimulatorsState = (initialData: DataStateSimulatorsType): DataStateSimulatorsType => {
//   return initialData
// }
//
// const slice = createSlice({
//   name: 'simulators',
//   initialState: {} as DataStateSimulatorsType,
//   reducers: {
//     start: (state, { payload }: { payload: { termUUID: string, folderUUID: string } }) => {
//       return {
//         ...state,
//         [payload.folderUUID]: {
//           ...createSimulatorState(),
//           termUUID: payload.termUUID,
//           status: SimulatorStatus.PROCESSING
//         }
//       }
//     },
//     restart: (state, { payload }: { payload: { folderUUID: string } }) => {
//       const prevState = state[payload.folderUUID] || createSimulatorState()
//       const termUUID = randomArrayElement(prevState.continueUUIDs)
//       return {
//         ...state,
//         [payload.folderUUID]: {
//           ...prevState,
//           termUUID,
//           continueUUIDs: [],
//           status: SimulatorStatus.PROCESSING
//         }
//       }
//     },
//     rememberAndFinish: (state, { payload }: { payload: { folderUUID: string } }) => {
//       const prevState = state[payload.folderUUID] || createSimulatorState()
//       return {
//         ...state,
//         [payload.folderUUID]: {
//           ...prevState,
//           status: SimulatorStatus.FINISHING,
//           rememberUUIDs: unique([...prevState.rememberUUIDs, prevState.termUUID]),
//           historyUUIDs: prevState.termUUID ? [...prevState.historyUUIDs, prevState.termUUID] : [...prevState.historyUUIDs],
//         }
//       }
//     },
//     continueAndFinish: (state, { payload }: { payload: { folderUUID: string } }) => {
//       const prevState = state[payload.folderUUID] || createSimulatorState()
//       return {
//         ...state,
//         [payload.folderUUID]: {
//           ...prevState,
//           status: SimulatorStatus.FINISHING,
//           continueUUIDs: unique([...prevState.continueUUIDs, prevState.termUUID]),
//           historyUUIDs: prevState.termUUID ? [...prevState.historyUUIDs, prevState.termUUID] : [...prevState.historyUUIDs],
//         }
//       }
//     },
//     remember: (state, { payload }: { payload: { termUUID: string, folderUUID: string } }) => {
//       const prevState = state[payload.folderUUID] || createSimulatorState()
//       return {
//         ...state,
//         [payload.folderUUID]: {
//           ...prevState,
//           termUUID: payload.termUUID,
//           rememberUUIDs: unique([...prevState.rememberUUIDs, prevState.termUUID]),
//           historyUUIDs: prevState.termUUID ? [...prevState.historyUUIDs, prevState.termUUID] : [...prevState.historyUUIDs],
//         }
//       }
//     },
//     continue: (state, { payload }: { payload: { termUUID: string, folderUUID: string } }) => {
//       const prevState = state[payload.folderUUID] || createSimulatorState()
//       return {
//         ...state,
//         [payload.folderUUID]: {
//           ...prevState,
//           termUUID: payload.termUUID,
//           continueUUIDs: unique([...prevState.continueUUIDs, prevState.termUUID]),
//           historyUUIDs: prevState.termUUID ? [...prevState.historyUUIDs, prevState.termUUID] : [...prevState.historyUUIDs],
//         }
//       }
//     },
//     back: (state, { payload }: { payload: { folderUUID: string } }) => {
//       const prevState = state[payload.folderUUID] || createSimulatorState()
//
//       if (prevState.historyUUIDs.length === 0) {
//         return { ...state,}
//       }
//
//       const historyUUIDs = [...prevState.historyUUIDs]
//       const termUUID = historyUUIDs.splice(-1)[0]
//
//       return {
//         ...state,
//         [payload.folderUUID]: {
//           ...prevState,
//           termUUID,
//           historyUUIDs,
//           continueUUIDs: [...prevState.continueUUIDs ].filter((uuid) => uuid !== termUUID),
//           rememberUUIDs: [...prevState.rememberUUIDs ].filter((uuid) => uuid !== termUUID),
//         }
//       }
//     },
//   },
// })
//
// export default slice.reducer
//
export const useSimulatorActions = () => {
//   return {
//     start: (payload: { termUUID: string, folderUUID: string }) => {
//       dispatch(slice.actions.start(payload))
//     },
//     rememberAndFinish: (payload: { folderUUID: string }) => {
//       dispatch(slice.actions.rememberAndFinish(payload))
//     },
//     continueAndFinish: (payload: { folderUUID: string }) => {
//       dispatch(slice.actions.continueAndFinish(payload))
//     },
//     restart: (payload: { folderUUID: string }) => {
//       dispatch(slice.actions.restart(payload))
//     },
//     remember: (payload: { termUUID: string, folderUUID: string }) => {
//       dispatch(slice.actions.remember(payload))
//     },
//     continue: (payload: { termUUID: string, folderUUID: string }) => {
//       dispatch(slice.actions.continue(payload))
//     },
//     back: (payload: { folderUUID: string }) => {
//       dispatch(slice.actions.back(payload))
//     },
//   }
}
