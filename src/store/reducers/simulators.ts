import { updateSimulatorData, saveSimulatorData } from '@store/fetch/simulators'
import { RelationSimulatorData } from '@entities//RelationSimulator'
import { updateSimulatorById } from '@helper/simulators/general'
import { SimulatorData } from '@entities/Simulator'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'

export type PayloadSave = {
  editable: boolean
  simulator: SimulatorData
  relationSimulator: RelationSimulatorData
}

export const saveSimulator = createAsyncThunk(
  '/simulator/start',
  async (payload: PayloadSave): Promise<boolean> => {
    if (payload.editable) {
      return await saveSimulatorData(payload.relationSimulator, payload.simulator)
    }
    return true
  }
)

export type PayloadUpdate = {
  editable: boolean
  simulator: SimulatorData
}

export const updateSimulator = createAsyncThunk(
  '/simulator/update',
  async (payload: PayloadUpdate): Promise<boolean> => {
    if (payload.editable) {
      return await updateSimulatorData(payload.simulator)
    }
    return true
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const simulatorReducers = (builder: any) => {
  builder
    .addCase(saveSimulator.pending, (state: ConfigType, action: { meta: { arg: PayloadSave } }) => {
      const { relationSimulator, simulator } = action.meta.arg

      state.relationSimulators = [...state.relationSimulators, relationSimulator]
      state.simulators = [...state.simulators, simulator]
    })

  builder
    .addCase(updateSimulator.pending, (state: ConfigType, action: { meta: { arg: PayloadUpdate } }) => {
      const { simulator } = action.meta.arg
      state.simulators = updateSimulatorById(state.simulators, simulator.id, () => {
        return { ...simulator }
      })
    })
}
