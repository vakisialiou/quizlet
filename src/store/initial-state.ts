import ClientFolder from '@entities/ClientFolder'
import ClientTerm from '@entities/ClientTerm'
import { Session } from 'next-auth'

export enum SimulatorStatus {
  PROCESSING = 'processing',
  FINISHING = 'finishing',
  WAITING = 'waiting',
  DONE = 'done'
}

export type SimulatorType = {
  timestamp: number | null,
  status: SimulatorStatus,
  termId: string | null,
  rememberIds: string[],
  continueIds: string[],
  historyIds: string[],
  terms: ClientTerm[],
}

export type SimulatorsType = {
  [folderId: string]: SimulatorType
}

export type FoldersType = {
  process: boolean
  items: ClientFolder[]
  editId: string | null
  processIds: string[]
}

export type TermsType = {
  editId: string | null
  processIds: string[]
}

export type ConfigType = {
  simulators: SimulatorsType,
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
    simulators: {},
    session
  }
}
