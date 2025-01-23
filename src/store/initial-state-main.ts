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
  groupId: string | null
  processGroupIds: string[]
  folderId: string | null
  processFolderIds: string[]
  termId: string | null
  processTermIds: string[]
}

export type ConfigType = {
  edit: ConfigEditType,
  terms: TermData[]
  modules: ModuleData[]
  folders: FolderData[]
  simulators: SimulatorData[]
  folderGroups: FolderGroupData[]
  moduleShares: ModuleShareData[]
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
    moduleShares,
    relationTerms,
    relationFolders,
    relationSimulators,
  }:
  {
    terms?: TermData[]
    session?: Session | null
    modules?: ModuleData[]
    folders?: FolderData[]
    simulators?: SimulatorData[]
    folderGroups?: FolderGroupData[]
    moduleShares?: ModuleShareData[]
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
      groupId: null,
      processGroupIds: [],
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
    moduleShares: moduleShares || [],
    relationTerms: relationTerms || [],
    relationFolders: relationFolders || [],
    relationSimulators: relationSimulators || [],
    settings: new Settings()
      .setModules(settings?.modules || null)
      .setSimulator(settings?.simulator || null)
      .serialize(),
  }
}
