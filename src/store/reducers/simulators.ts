import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import { ClientFolderData } from '@entities/ClientFolder'
import { ConfigType } from '@store/initial-state'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { clientFetch } from '@lib/fetch-client'
import { upsertObject } from '@lib/array'
import {
  findNeedUpdateSimulators,
  createActiveSimulator,
  updateActiveSimulator,
  updateSimulatorById,
  addRememberIds,
  addContinueId,
  addHistoryId,
} from '@containers/Simulator/helpers'

export type PayloadFetch = {
  folderId: string,
}

export type UpsertSimulatorsIds = (string | null)[]

export const fetchSimulators = createAsyncThunk(
  '/fetch/simulators',
  async (payload: PayloadFetch, api): Promise<ClientFolderData> => {
    const state = api.getState() as ConfigType
    const folder = state.folders.items.find((item) => item.id === payload.folderId)
    if (folder) {
      return JSON.parse(JSON.stringify(folder))
    }

    return await clientFetch(`/api/folders/${payload.folderId}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.folder) {
          throw new Error(`Folder "${payload.folderId}" is not exists.`)
        }
        return json.folder as ClientFolderData
      })
  }
)

export type PayloadStart = {
  folderId: string,
  termIds: string[]
}

export const startSimulators = createAsyncThunk(
  '/start/simulators',
  async (payload: PayloadStart, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    const simulators = findNeedUpdateSimulators(state.folders, payload.folderId)
    return await upsert(simulators)
  }
)

export type PayloadContinue = { folderId: string }

export const continueSimulators = createAsyncThunk(
  '/continue/simulators',
  async (payload: PayloadContinue, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    const simulators = findNeedUpdateSimulators(state.folders, payload.folderId)
    return await upsert(simulators)
  }
)

export type PayloadRemember = { folderId: string }

export const rememberSimulators = createAsyncThunk(
  '/remember/simulators',
  async (payload: PayloadRemember, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    const simulators = findNeedUpdateSimulators(state.folders, payload.folderId)
    return await upsert(simulators)
  }
)

export type PayloadRestart = { folderId: string }

export const restartSimulators = createAsyncThunk(
  '/restart/simulators',
  async (payload: PayloadRestart, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    const simulators = findNeedUpdateSimulators(state.folders, payload.folderId)
    return await upsert(simulators)
  }
)

export type PayloadBack = { folderId: string }

export const backSimulators = createAsyncThunk(
  '/back/simulators',
  async (payload: PayloadBack, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    const simulators = findNeedUpdateSimulators(state.folders, payload.folderId)
    return await upsert(simulators)
  }
)

export type PayloadDeactivate = { folderId: string }

export const deactivateSimulators = createAsyncThunk(
  '/deactivate/simulators',
  async (payload: PayloadDeactivate, api): Promise<UpsertSimulatorsIds> => {
    const state = api.getState() as ConfigType
    const simulators = findNeedUpdateSimulators(state.folders, payload.folderId)
    return await upsert(simulators)
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const simulatorReducers = (builder: any) => {
  builder
    .addCase(fetchSimulators.pending, (state: ConfigType) => {
      state.folders = { ...state.folders, process: true }
    })
    .addCase(fetchSimulators.fulfilled, (state: ConfigType, action: { payload: ClientFolderData, meta: { arg: PayloadFetch } }) => {
      const folder = { ...action.payload }
      const actualTermIds = folder.terms.map(({ id }) => id)

      state.folders.items = upsertObject([...state.folders.items], folder)

      // Some terms can have been deleted. In that case have to clear all removed terms from simulator.
      state.folders = updateActiveSimulator(state.folders, action.meta.arg.folderId, (simulator) => {
        const termIds = simulator.termIds.filter((id) => actualTermIds.includes(id))

        if (termIds.length === 0) {
          return { ...simulator, active: false, needUpdate: true }
        }

        const historyIds = simulator.historyIds.filter((id) => actualTermIds.includes(id))
        let continueIds = simulator.continueIds.filter((id) => actualTermIds.includes(id))
        let rememberIds = simulator.rememberIds.filter((id) => actualTermIds.includes(id))

        if (simulator.termId) {
          if (!actualTermIds.includes(simulator.termId)) {
            const historyIndex = historyIds.findLastIndex(() => true)
            if (historyIndex !== -1) {
              simulator.termId = historyIds.splice(historyIndex, 1)[0]
              continueIds = continueIds.filter((uuid) => uuid !== simulator.termId)
              rememberIds = rememberIds.filter((uuid) => uuid !== simulator.termId)
            } else {
              simulator.termId = null
              simulator.status = SimulatorStatus.DONE
            }
          }
        }

        return {
          ...simulator,
          termIds,
          historyIds,
          continueIds,
          rememberIds,
          needUpdate: true,
        }
      })

      state.folders = { ...state.folders, process: false }
    })
    .addCase(fetchSimulators.rejected, (state: ConfigType) => {
      state.folders = { ...state.folders, process: false }
    })

  builder
    .addCase(startSimulators.pending, (state: ConfigType, action: { meta: { arg: PayloadStart } }) => {
      const { folderId, termIds } = action.meta.arg

      state.folders = createActiveSimulator(state.folders, folderId)
      state.folders = updateActiveSimulator(state.folders, folderId, (simulator) => {
        return {
          ...simulator,
          termIds,
          needUpdate: true,
          termId: termIds[0],
          status: SimulatorStatus.PROCESSING,
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

async function upsert(simulators: ClientSimulatorData[]): Promise<UpsertSimulatorsIds> {
  const promises = simulators.map(async (simulator) => {
    const res = await clientFetch(`/api/simulators/${simulator.id}`, {
      method: 'PUT',
      body: JSON.stringify(simulator)
    })
    return res.ok ? simulator.id : null
  })
  return (await Promise.all(promises)).filter((id) => id)
}
