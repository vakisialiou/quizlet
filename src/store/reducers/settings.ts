import { ClientSettingsSimulatorData } from '@entities/ClientSettingsSimulator'
import { upsertSettingsSimulator } from '@store/fetch/settings'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ConfigType } from '@store/initial-state'

export type PayloadUpdate = Partial<ClientSettingsSimulatorData>

export const updateSettingsSimulator = createAsyncThunk(
  '/update/settings/simulator',
  async (payload: PayloadUpdate, api): Promise<ClientSettingsSimulatorData> => {
    const state = api.getState() as ConfigType
    const originSettings = { ...state.settings.simulator }

    try {
      const settings = { ...originSettings, ...payload }
      await upsertSettingsSimulator(settings)
      return settings
    } catch {
      return originSettings
    }
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const simulatorReducers = (builder: any) => {
  builder
    .addCase(updateSettingsSimulator.pending, (state: ConfigType, action: { meta: { arg: PayloadUpdate } }) => {
      state.settings.simulator = { ...state.settings.simulator, ...action.meta.arg }
    })
    .addCase(updateSettingsSimulator.rejected, (state: ConfigType, action: { payload: ClientSettingsSimulatorData, meta: { arg: PayloadUpdate } }) => {
      state.settings.simulator = { ...action.payload }
    })
}
