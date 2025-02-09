import { RelationTermData } from '@entities/RelationTerm'
import { ConfigType } from '@store/initial-state-main'
import { createAction } from '@reduxjs/toolkit'
import { ModuleData } from '@entities/Module'
import { upsertObject } from '@lib/array'
import { TermData } from '@entities/Term'

export type CreateShareType = {
  relationTerms: RelationTermData[],
  module: ModuleData,
  terms: TermData[],
}

export const createShare = createAction<CreateShareType>('share/create')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shareReducers = (builder: any) => {
  builder.addCase(createShare, (state: ConfigType, action: { payload: CreateShareType }) => {
    const { relationTerms, module, terms } = action.payload
    for (const relationTerm of relationTerms) {
      state.relationTerms = upsertObject([...state.relationTerms], relationTerm)
    }

    for (const term of terms) {
      state.terms = upsertObject([...state.terms], term)
    }

    state.modules = upsertObject([...state.modules], module)
  })
}
