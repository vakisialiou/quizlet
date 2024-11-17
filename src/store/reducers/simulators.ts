import { ConfigType, SimulatorStatus, SimulatorsType } from '@store/initial-state'
import { PAUSE_SECONDS } from '@containers/Simulator/constants'
import { fetchFolders } from '@store/reducers/folders'
import { createAsyncThunk } from '@reduxjs/toolkit'
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        timestamp: Date.now(),
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
          timestamp: null,
          termId: null,
          terms: [],
          historyIds: [],
          continueIds: [],
          rememberIds: []
        }
      } else {
        state.simulators[folderId] = {
          ...simulator,
          status: SimulatorStatus.PROCESSING,
          timestamp: simulator.timestamp ? simulator.timestamp + (PAUSE_SECONDS * 1000) : null,
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
