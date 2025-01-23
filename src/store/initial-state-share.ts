import { ModuleShareData } from '@entities/ModuleShare'
import { ModuleData } from '@entities/Module'
import { TermData } from '@entities/Term'
import {RelationTermData} from "@entities/RelationTerm";

export type ShareConfigEditType = {
  termId: string | null
  processTermIds: string[]
}

export type ShareConfigType = {
  edit: ShareConfigEditType,
  terms: TermData[]
  share: ModuleShareData
  module: ModuleData | null
  relationTerms: RelationTermData[]
}

export const getInitialState = async (
  {
    share,
    terms,
    module,
    relationTerms
  }:
  {
    terms?: TermData[]
    share: ModuleShareData
    module: ModuleData | null,
    relationTerms?: RelationTermData[]
  }
): Promise<ShareConfigType> => {
  return {
    edit: {
      termId: null,
      processTermIds: []
    },
    share: share,
    terms: terms || [],
    module: module || null,
    relationTerms: relationTerms || []
  }
}
