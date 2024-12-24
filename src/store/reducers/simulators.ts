import { ClientSettingsSimulatorData } from '@entities/ClientSettingsSimulator'
import { ProgressTrackerAction } from '@entities/ProgressTracker'
import { ensureActualExtra } from '@helper/simulator-settings'
import { ConfigType, FoldersType } from '@store/initial-state'
import { SimulatorStatus } from '@entities/ClientSimulator'
import { upsertSimulators } from '@store/fetch/simulators'
import SimulatorTracker from '@entities/SimulatorTracker'
import {createAsyncThunk} from '@reduxjs/toolkit'
import { findTopFolder } from '@helper/folders'
import {
  addContinueId,
  addHistoryId,
  addRememberIds,
  createActiveSimulator,
  updateActiveSimulator,
  updateSimulatorById,
} from '@helper/reducers-simulator'
import {
  findNeedUpdateSimulators,
  getAvailableTermIds,
  selectRandomTermId,
  randomizeTermIds
} from '@helper/simulators'

export type UpsertSimulatorsIds = {
  folderId: string,
  simulatorIds: (string | null)[],
}

export type PayloadStart = {
  folderId: string,
  termIds: string[],
  settings: ClientSettingsSimulatorData
}

export const startSimulators = createAsyncThunk(
  '/start/simulators',
  async (payload: PayloadStart, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    return await tryUpdate(state, payload.folderId)
  }
)

export type PayloadContinue = {
  folderId: string
}

export const continueSimulators = createAsyncThunk(
  '/continue/simulators',
  async (payload: PayloadContinue, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    return await tryUpdate(state, payload.folderId)
  }
)

export type PayloadUpdateTracker = {
  folderId: string,
  trackerAction: ProgressTrackerAction
}

export const updateTracker = createAsyncThunk(
  '/update/tracker',
  async (payload: PayloadUpdateTracker): Promise<PayloadUpdateTracker> => {
    return payload
  }
)

export type PayloadRemember = {
  folderId: string
}

export const rememberSimulators = createAsyncThunk(
  '/remember/simulators',
  async (payload: PayloadRemember, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    return await tryUpdate(state, payload.folderId)
  }
)

export type PayloadRestart = {
  folderId: string
}

export const restartSimulators = createAsyncThunk(
  '/restart/simulators',
  async (payload: PayloadRestart, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    return await tryUpdate(state, payload.folderId)
  }
)

export type PayloadBack = {
  folderId: string
}

export const backSimulators = createAsyncThunk(
  '/back/simulators',
  async (payload: PayloadBack, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    return await tryUpdate(state, payload.folderId)
  }
)

export type PayloadDeactivate = {
  folderId: string
}

export const deactivateSimulators = createAsyncThunk(
  '/deactivate/simulators',
  async (payload: PayloadDeactivate, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    return await tryUpdate(state, payload.folderId)
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const simulatorReducers = (builder: any) => {
  builder
    .addCase(startSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadStart } }) => {
      const { folderId, termIds, settings } = action.meta.arg

      state.folders = createActiveSimulator(state.folders, folderId)
      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        const topFolder = findTopFolder(state.folders.items, folderId)
        return ensureActualExtra(topFolder?.terms || [], {
          ...simulator,
          needUpdate: true,
          termId: termIds[0] || null,
          settings: { ...settings },
          termIds: randomizeTermIds(termIds),
          status: SimulatorStatus.PROCESSING
        })
      })
    })
    .addCase(startSimulators.fulfilled, (state: ConfigType, action: { payload: UpsertSimulatorsIds }) => {
      state.folders = resetNeedUpdate(state.folders, action.payload)
    })

  builder
    .addCase(continueSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadContinue } }) => {
      const { folderId } = action.meta.arg

      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        const termIds = getAvailableTermIds(simulator, { active: true, continue: true, remember: true })
        const topFolder = findTopFolder(state.folders.items, folderId)
        if (termIds.length === 0) {
          return ensureActualExtra(topFolder?.terms || [], {
            ...simulator,
            termId: null,
            needUpdate: true,
            status: SimulatorStatus.FINISHING,
            historyIds: addHistoryId(simulator.historyIds, simulator.termId),
            continueIds: addContinueId(simulator.continueIds, simulator.termId),
          })
        }

        return ensureActualExtra(topFolder?.terms || [], {
          ...simulator,
          needUpdate: true,
          termId: selectRandomTermId(termIds),
          historyIds: addHistoryId(simulator.historyIds, simulator.termId),
          continueIds: addContinueId(simulator.continueIds, simulator.termId),
        })
      })
    })
    .addCase(continueSimulators.fulfilled, (state: ConfigType, action: { payload: UpsertSimulatorsIds }) => {
      state.folders = resetNeedUpdate(state.folders, action.payload)
    })

  builder
    .addCase(updateTracker.pending, (state: ConfigType, action: { meta: { arg: PayloadUpdateTracker } }) => {
      const { folderId, trackerAction } = action.meta.arg

      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        const tracker = new SimulatorTracker(simulator)

        if (simulator.termId) {
          tracker.calculate(trackerAction, simulator.termId)
        }

        const topFolder = findTopFolder(state.folders.items, folderId)
        return ensureActualExtra(topFolder?.terms || [], {
          ...simulator,
          needUpdate: true,
          tracker: tracker.serialize(),
        })
      })
    })

  builder
    .addCase(rememberSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadRemember } }) => {
      const { folderId } = action.meta.arg

      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        const termIds = getAvailableTermIds(simulator, { active: true, continue: true, remember: true })
        const topFolder = findTopFolder(state.folders.items, folderId)
        if (termIds.length === 0) {
          return ensureActualExtra(topFolder?.terms || [], {
            ...simulator,
            termId: null,
            needUpdate: true,
            status: simulator.continueIds.length === 0 ? SimulatorStatus.DONE : SimulatorStatus.FINISHING,
            historyIds: addHistoryId(simulator.historyIds, simulator.termId),
            rememberIds: addRememberIds(simulator.rememberIds, simulator.termId),
          })
        }

        return ensureActualExtra(topFolder?.terms || [], {
          ...simulator,
          needUpdate: true,
          termId: selectRandomTermId(termIds),
          historyIds: addHistoryId(simulator.historyIds, simulator.termId),
          rememberIds: addRememberIds(simulator.rememberIds, simulator.termId),
        })
      })
    })
    .addCase(rememberSimulators.fulfilled, (state: ConfigType, action: { payload: UpsertSimulatorsIds }) => {
      state.folders = resetNeedUpdate(state.folders, action.payload)
    })

  builder
    .addCase(restartSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadRestart } }) => {
      const { folderId } = action.meta.arg

      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        const termIds = getAvailableTermIds(simulator, { active: false, continue: false, remember: true })
        const topFolder = findTopFolder(state.folders.items, folderId)
        if (termIds.length === 0) {
          return ensureActualExtra(topFolder?.terms || [], {
            ...simulator,
            needUpdate: true,
            status: SimulatorStatus.DONE,
            termId: null,
            continueIds: [],
          })
        } else {
          return ensureActualExtra(topFolder?.terms || [], {
            ...simulator,
            needUpdate: true,
            status: SimulatorStatus.PROCESSING,
            termId: termIds[0],
            continueIds: [],
          })
        }
      })
    })
    .addCase(restartSimulators.fulfilled, (state: ConfigType, action: { payload: UpsertSimulatorsIds }) => {
      state.folders = resetNeedUpdate(state.folders, action.payload)
    })

  builder
    .addCase(backSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadBack } }) => {
      const { folderId } = action.meta.arg

      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        if (simulator.historyIds.length === 0) {
          return simulator
        }

        const historyIds = [...simulator.historyIds]
        const termId = historyIds.splice(-1)[0] || null
        const topFolder = findTopFolder(state.folders.items, folderId)
        return ensureActualExtra(topFolder?.terms || [], {
          ...simulator,
          termId,
          historyIds,
          needUpdate: true,
          continueIds: [...simulator.continueIds ].filter((uuid) => uuid !== termId),
          rememberIds: [...simulator.rememberIds ].filter((uuid) => uuid !== termId),
        })
      })
    })
    .addCase(backSimulators.fulfilled, (state: ConfigType, action: { payload: UpsertSimulatorsIds }) => {
      state.folders = resetNeedUpdate(state.folders, action.payload)
    })

  builder
    .addCase(deactivateSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadDeactivate } }) => {
      const { folderId } = action.meta.arg

      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        return {
          ...simulator,
          active: false,
          needUpdate: true
        }
      })
    })
    .addCase(deactivateSimulators.fulfilled, (state: ConfigType, action: { payload: UpsertSimulatorsIds }) => {
      state.folders = resetNeedUpdate(state.folders, action.payload)
    })
}

async function tryUpdate(state: ConfigType, folderId: string) {
  if (state.serverQueryEnabled) {
    const simulators = findNeedUpdateSimulators(state.folders.items, folderId)
    return {
      folderId,
      simulatorIds: await upsertSimulators(simulators)
    }
  }
  return {
    folderId,
    simulatorIds: (await Promise.all([]))
  }
}

function resetNeedUpdate(folders: FoldersType, payload: UpsertSimulatorsIds) {
  for (const id of payload.simulatorIds) {
    if (!id) {
      continue
    }

    folders = updateSimulatorById(folders, payload.folderId, id, (simulator) => {
      return { ...simulator, needUpdate: false }
    })
  }
  return folders
}
