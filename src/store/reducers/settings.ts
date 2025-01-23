import { upsertSettings } from '@store/fetch/settings'
import { ConfigType } from '@store/initial-state-main'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { SettingsData } from '@entities/Settings'

export type UpdateSettings = {
  editable: boolean,
  settings: SettingsData
}

export const updateSettings = createAsyncThunk(
  '/update/settings',
  async (payload: UpdateSettings): Promise<boolean> => {
    if (payload.editable) {
      await upsertSettings(payload.settings)
    }

    return true
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const simulatorReducers = (builder: any) => {
  builder
    .addCase(updateSettings.fulfilled, (state: ConfigType, action: { meta: { arg: UpdateSettings } }) => {
      state.settings = { ...state.settings, ...action.meta.arg.settings }
    })
}
