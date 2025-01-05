import { RelationSimulatorData } from '@entities/RelationSimulator'
import { RelationFolderData } from '@entities/RelationFolder'
import Settings, { SettingsData } from '@entities/Settings'
import { RelationTermData } from '@entities/RelationTerm'
import { FolderGroupData } from '@entities/FolderGroup'
import { ModuleShareData } from '@entities/ModuleShare'
import { SimulatorData } from '@entities/Simulator'
import { ModuleData } from '@entities/Module'
import { FolderData } from '@entities/Folder'
import { TermData } from '@entities/Term'
import { Session } from 'next-auth'

export type ConfigEditType = {
  moduleId: string | null
  processModuleIds: string[]
  folderId: string | null
  processFolderIds: string[]
  termId: string | null
  processTermIds: string[]
}

export type ConfigType = {
  edit: ConfigEditType,
  terms: TermData[]
  modules: ModuleData[]
  moduleShare: ModuleShareData | null
  folders: FolderData[]
  simulators: SimulatorData[]
  folderGroups: FolderGroupData[]
  relationTerms: RelationTermData[]
  relationFolders: RelationFolderData[]
  relationSimulators: RelationSimulatorData[]
  session: Session | null
  settings: SettingsData
}

export const getInitialState = async (
  {
    terms,
    session,
    modules,
    folders,
    settings,
    simulators,
    folderGroups,
    relationTerms,
    relationFolders,
    relationSimulators,
    moduleShare
  }:
  {
    terms?: TermData[]
    session?: Session | null
    moduleShare?: ModuleShareData | null
    modules?: ModuleData[]
    folders?: FolderData[]
    simulators?: SimulatorData[]
    folderGroups?: FolderGroupData[]
    relationTerms?: RelationTermData[]
    relationFolders?: RelationFolderData[]
    relationSimulators?: RelationSimulatorData[]
    settings?: SettingsData | null
  }
): Promise<ConfigType> => {
  return {
    session: session || null,
    edit: {
      moduleId: null,
      processModuleIds: [],
      folderId: null,
      processFolderIds: [],
      termId: null,
      processTermIds: []
    },
    terms: terms || [],
    modules: modules || [],
    folders: folders || [],
    simulators: simulators || [],
    folderGroups: folderGroups || [],
    relationTerms: relationTerms || [],
    relationFolders: relationFolders || [],
    relationSimulators: relationSimulators || [],
    moduleShare: moduleShare || null,
    settings: new Settings().setSimulator(settings?.simulator || null).serialize(),
  }
}
