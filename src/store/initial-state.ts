import ClientFolder from '@entities/ClientFolder'
import ClientTerm from '@entities/ClientTerm'

export enum SimulatorStatus {
  PROCESSING = 'processing',
  FINISHING = 'finishing',
  WAITING = 'waiting',
  DONE = 'done'
}

export type SimulatorType = {
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
  terms: TermsType
}

export const getInitialState = async (): Promise<ConfigType> => {
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
    simulators: {}
  }
}
