
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
}

export const getInitialState = async ({ session }: { session: Session | null }): Promise<ConfigType> => {
  return {
    folders: {
      items: [],
      editId: null,
      process: false,
      processIds: []
    },
    terms: {
      editId: null,
      processIds: []
    },
    session
  }
}
