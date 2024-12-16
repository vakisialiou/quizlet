import { ClientSettingsSimulatorData } from '@entities/ClientSettingsSimulator'
import { ProgressTrackerAction } from '@entities/ProgressTracker'
import { SimulatorStatus } from '@entities/ClientSimulator'
import { upsertSimulators } from '@store/fetch/simulators'
import SimulatorTracker from '@entities/SimulatorTracker'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'
import {
  findNeedUpdateSimulators,
  createActiveSimulator,
  updateActiveSimulator,
  updateSimulatorById,
  addRememberIds,
  addContinueId,
  addHistoryId,
} from '@containers/Simulator/helpers'

export type UpsertSimulatorsIds = (string | null)[]

export type PayloadStart = {
  folderId: string,
  termIds: string[],
  settings: ClientSettingsSimulatorData
}

export const startSimulators = createAsyncThunk(
  '/start/simulators',
  async (payload: PayloadStart, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    const simulators = findNeedUpdateSimulators(state.folders, payload.folderId)
    return await upsertSimulators(simulators)
  }
)

export type PayloadContinue = { folderId: string }

export const continueSimulators = createAsyncThunk(
  '/continue/simulators',
  async (payload: PayloadContinue, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    const simulators = findNeedUpdateSimulators(state.folders, payload.folderId)
    return await upsertSimulators(simulators)
  }
)

export type PayloadUpdateTracker = { folderId: string, trackerAction: ProgressTrackerAction }

export const updateTracker = createAsyncThunk(
  '/update/tracker',
  async (payload: PayloadUpdateTracker): Promise<PayloadUpdateTracker> => {
    return payload
  }
)

export type PayloadRemember = { folderId: string }

export const rememberSimulators = createAsyncThunk(
  '/remember/simulators',
  async (payload: PayloadRemember, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    const simulators = findNeedUpdateSimulators(state.folders, payload.folderId)
    return await upsertSimulators(simulators)
  }
)

export type PayloadRestart = { folderId: string }

export const restartSimulators = createAsyncThunk(
  '/restart/simulators',
  async (payload: PayloadRestart, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    const simulators = findNeedUpdateSimulators(state.folders, payload.folderId)
    return await upsertSimulators(simulators)
  }
)

export type PayloadBack = { folderId: string }

export const backSimulators = createAsyncThunk(
  '/back/simulators',
  async (payload: PayloadBack, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    const simulators = findNeedUpdateSimulators(state.folders, payload.folderId)
    return await upsertSimulators(simulators)
  }
)

export type PayloadDeactivate = { folderId: string }

export const deactivateSimulators = createAsyncThunk(
  '/deactivate/simulators',
  async (payload: PayloadDeactivate, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    const simulators = findNeedUpdateSimulators(state.folders, payload.folderId)
    return await upsertSimulators(simulators)
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const simulatorReducers = (builder: any) => {

  builder
    .addCase(startSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadStart } }) => {
      const { folderId, termIds, settings } = action.meta.arg

      state.folders = createActiveSimulator(state.folders, folderId)
      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        return {
          ...simulator,
          termIds,
          needUpdate: true,
          termId: termIds[0],
          settings: { ...settings },
          status: SimulatorStatus.PROCESSING
        }
      })
    })
    .addCase(startSimulators.fulfilled, (state: ConfigType, action: { payload: UpsertSimulatorsIds, meta: { arg: PayloadStart } }) => {
      for (const id in action.payload) {
        state.folders = updateSimulatorById(state.folders, action.meta.arg.folderId, id, (simulator) => {
          return { ...simulator, needUpdate: false }
        })
      }
    })

  builder
    .addCase(continueSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadContinue } }) => {
      const { folderId } = action.meta.arg

      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        const termIds = [...simulator.termIds].filter((id) => {
          return !simulator.rememberIds.includes(id) && !simulator.continueIds.includes(id)
        })

        const index = termIds.findIndex((id) => id === simulator.termId)
        const nextTermId = termIds[index + 1]

        if (nextTermId === undefined) {
          return {
            ...simulator,
            termId: null,
            needUpdate: true,
            status: SimulatorStatus.FINISHING,
            historyIds: addHistoryId(simulator.historyIds, simulator.termId),
            continueIds: addContinueId(simulator.continueIds, simulator.termId),
          }
        }

        return {
          ...simulator,
          needUpdate: true,
          termId: nextTermId,
          historyIds: addHistoryId(simulator.historyIds, simulator.termId),
          continueIds: addContinueId(simulator.continueIds, simulator.termId),
        }
      })
    })
    .addCase(continueSimulators.fulfilled, (state: ConfigType, action: { payload: UpsertSimulatorsIds, meta: { arg: PayloadContinue } }) => {
      for (const id in action.payload) {
        state.folders = updateSimulatorById(state.folders, action.meta.arg.folderId, id, (simulator) => {
          return { ...simulator, needUpdate: false }
        })
      }
    })

  builder
    .addCase(updateTracker.pending, (state: ConfigType, action: { meta: { arg: PayloadUpdateTracker } }) => {
      const { folderId, trackerAction } = action.meta.arg

      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        const tracker = new SimulatorTracker(simulator)

        if (simulator.termId) {
          tracker.calculate(trackerAction, simulator.termId)
        }

        return {
          ...simulator,
          needUpdate: true,
          tracker: tracker.serialize(),
        }
      })
    })

  builder
    .addCase(rememberSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadRemember } }) => {
      const { folderId } = action.meta.arg

      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        const termIds = [...simulator.termIds].filter((id) => {
          return !simulator.rememberIds.includes(id) && !simulator.continueIds.includes(id)
        })

        const index = termIds.findIndex((id) => id === simulator.termId)
        const nextTermId = termIds[index + 1]

        if (nextTermId === undefined) {
          return {
            ...simulator,
            termId: null,
            needUpdate: true,
            status: simulator.continueIds.length === 0 ? SimulatorStatus.DONE : SimulatorStatus.FINISHING,
            historyIds: addHistoryId(simulator.historyIds, simulator.termId),
            rememberIds: addRememberIds(simulator.rememberIds, simulator.termId),
          }
        }

        return {
          ...simulator,
          needUpdate: true,
          termId: nextTermId,
          historyIds: addHistoryId(simulator.historyIds, simulator.termId),
          rememberIds: addRememberIds(simulator.rememberIds, simulator.termId),
        }
      })
    })
    .addCase(rememberSimulators.fulfilled, (state: ConfigType, action: { payload: UpsertSimulatorsIds, meta: { arg: PayloadRemember } }) => {
      for (const id in action.payload) {
        state.folders = updateSimulatorById(state.folders, action.meta.arg.folderId, id, (simulator) => {
          return { ...simulator, needUpdate: false }
        })
      }
    })

  builder
    .addCase(restartSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadRestart } }) => {
      const { folderId } = action.meta.arg

      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        const termIds = [...simulator.termIds].filter((id) => {
          return !simulator.rememberIds.includes(id)
        })

        if (termIds.length === 0) {
          return {
            ...simulator,
            needUpdate: true,
            status: SimulatorStatus.DONE,
            termId: termIds[0],
            continueIds: [],
          }
        } else {
          return {
            ...simulator,
            needUpdate: true,
            status: SimulatorStatus.PROCESSING,
            termId: termIds[0],
            continueIds: [],
          }
        }
      })
    })
    .addCase(restartSimulators.fulfilled, (state: ConfigType, action: { payload: UpsertSimulatorsIds, meta: { arg: PayloadRestart } }) => {
      for (const id in action.payload) {
        state.folders = updateSimulatorById(state.folders, action.meta.arg.folderId, id, (simulator) => {
          return { ...simulator, needUpdate: false }
        })
      }
    })

  builder
    .addCase(backSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadBack } }) => {
      const { folderId } = action.meta.arg

      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        if (simulator.historyIds.length === 0) {
          return simulator
        }

        const historyIds = [...simulator.historyIds]
        const termId = historyIds.splice(-1)[0]

        return {
          ...simulator,
          termId,
          historyIds,
          needUpdate: true,
          continueIds: [...simulator.continueIds ].filter((uuid) => uuid !== termId),
          rememberIds: [...simulator.rememberIds ].filter((uuid) => uuid !== termId),
        }
      })
    })
    .addCase(backSimulators.fulfilled, (state: ConfigType, action: { payload: UpsertSimulatorsIds, meta: { arg: PayloadBack } }) => {
      for (const id in action.payload) {
        state.folders = updateSimulatorById(state.folders, action.meta.arg.folderId, id, (simulator) => {
          return { ...simulator, needUpdate: false }
        })
      }
    })

  builder
    .addCase(deactivateSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadDeactivate } }) => {
      const { folderId } = action.meta.arg

      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        return { ...simulator, active: false, needUpdate: true }
      })
    })
    .addCase(deactivateSimulators.fulfilled, (state: ConfigType, action: { payload: UpsertSimulatorsIds, meta: { arg: PayloadDeactivate } }) => {
      for (const id in action.payload) {
        state.folders = updateSimulatorById(state.folders, action.meta.arg.folderId, id, (simulator) => {
          return { ...simulator, needUpdate: false }
        })
      }
    })
}
