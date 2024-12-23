import ClientSettings, { ClientSettingsData } from '@entities/ClientSettings'
import { ClientFolderData } from '@entities/ClientFolder'
import { Session } from 'next-auth'

export type FoldersType = {
  process: boolean
  items: ClientFolderData[]
  editId: string | null
  processIds: string[]
}

export type TermsType = {
  editId: string | null
  processIds: string[]
}

export type ConfigType = {
  folders: FoldersType,
  terms: TermsType,
  session: Session | null,
  settings: ClientSettingsData,
  serverQueryEnabled: boolean,
}

export const getInitialState = async (
  {
    serverQueryEnabled,
    session,
    settings,
    items
  }:
  {
    serverQueryEnabled: boolean,
    session: Session | null,
    settings: ClientSettingsData | null
    items: ClientFolderData[]
  }
): Promise<ConfigType> => {
  return {
    folders: {
      items,
      editId: null,
      process: false,
      processIds: []
    },
    terms: {
      editId: null,
      processIds: []
    },
    settings: new ClientSettings().setSimulator(settings?.simulator || null).serialize(),
    session,
    serverQueryEnabled
  }
}
