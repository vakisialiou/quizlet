import { SimulatorSettingsData } from '@entities/SimulatorSettings'
import { upsertSettingsSimulator } from '@store/fetch/settings'
import { ConfigType } from '@store/initial-state-main'
import { createAsyncThunk } from '@reduxjs/toolkit'

export type PayloadUpdate = {
  editable: boolean,
  simulatorSettings: Partial<SimulatorSettingsData>
}

export const updateSettingsSimulator = createAsyncThunk(
  '/update/settings/simulator',
  async (payload: PayloadUpdate, api): Promise<SimulatorSettingsData> => {
    const state = api.getState() as ConfigType
    const originSettings = { ...state.settings.simulator }

    if (payload.editable) {
      const settings = { ...originSettings, ...payload.simulatorSettings }
      await upsertSettingsSimulator(settings)
      return settings
    }

    return originSettings
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const simulatorReducers = (builder: any) => {
  builder
    .addCase(updateSettingsSimulator.pending, (state: ConfigType, action: { meta: { arg: PayloadUpdate } }) => {
      state.settings.simulator = { ...state.settings.simulator, ...action.meta.arg.simulatorSettings }
    })
    .addCase(updateSettingsSimulator.rejected, (state: ConfigType, action: { payload: SimulatorSettingsData, meta: { arg: PayloadUpdate } }) => {
      state.settings.simulator = { ...action.payload }
    })
}
