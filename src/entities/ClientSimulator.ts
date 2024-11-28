import { v4 } from 'uuid'

import ClientSettingsSimulator, { ClientSettingsSimulatorData } from '@entities/ClientSettingsSimulator'
import ProgressTracker, { ProgressTrackerData } from '@entities/ProgressTracker'

export enum SimulatorType {
  FLASHCARD = 'flashcard',
  INPUT = 'input',
  PICK = 'pick',
}

export enum SimulatorStatus {
  PROCESSING = 'processing',
  FINISHING = 'finishing',
  WAITING = 'waiting',
  DONE = 'done'
}

export type ClientSimulatorData = {
  id: string
  active: boolean
  folderId: string
  duration: number
  status: SimulatorStatus
  type: SimulatorType,
  termId: string | null
  termIds: string[]
  rememberIds: string[]
  continueIds: string[]
  historyIds: string[]
  needUpdate: boolean
  tracker: ProgressTrackerData
  settings: ClientSettingsSimulatorData
}

export default class ClientSimulator {
  id: string
  active: boolean
  folderId: string
  duration: number
  status: SimulatorStatus
  type: SimulatorType
  termId: string | null
  termIds: string[]
  rememberIds: string[]
  continueIds: string[]
  historyIds: string[]
  needUpdate: boolean
  tracker: ProgressTrackerData
  settings: ClientSettingsSimulatorData

  constructor(folderId: string, status: SimulatorStatus) {
    this.id = v4()
    this.active = false
    this.folderId = folderId
    this.duration = 0
    this.status = status
    this.type = SimulatorType.FLASHCARD
    this.termId = null
    this.termIds = []
    this.historyIds = []
    this.rememberIds = []
    this.continueIds = []
    this.needUpdate = false
    this.tracker = new ProgressTracker().serialize()
    this.settings = new ClientSettingsSimulator().serialize()
  }

  setId(value: string): ClientSimulator {
    this.id = value
    return this
  }

  setActive(active: boolean): ClientSimulator {
    this.active = active
    return this
  }

  setFolderId(value: string): ClientSimulator {
    this.folderId = value
    return this
  }

  setDuration(value: number): ClientSimulator {
    this.duration = value
    return this
  }

  setType(type: SimulatorType): ClientSimulator {
    this.type = type
    return this
  }

  setStatus(value: SimulatorStatus): ClientSimulator {
    this.status = value
    return this
  }

  setTermId(value: string | null): ClientSimulator {
    this.termId = value
    return this
  }

  setTermIds(value: string[]): ClientSimulator {
    this.termIds = value
    return this
  }

  addTermId(value: string): ClientSimulator {
    this.termIds.push(value)
    return this
  }

  delTermId(value: string): ClientSimulator {
    const index = this.termIds.indexOf(value)
    if (index !== -1) {
      this.termIds.splice(index, 1)
    }
    return this
  }

  setHistoryIds(value: string[]): ClientSimulator {
    this.historyIds = value
    return this
  }

  addHistoryId(value: string): ClientSimulator {
    this.historyIds.push(value)
    return this
  }

  delHistoryId(value: string): ClientSimulator {
    const index = this.historyIds.indexOf(value)
    if (index !== -1) {
      this.historyIds.splice(index, 1)
    }
    return this
  }

  setRememberIds(value: string[]): ClientSimulator {
    this.rememberIds = value
    return this
  }

  addRememberId(value: string): ClientSimulator {
    this.rememberIds.push(value)
    return this
  }

  delRememberId(value: string): ClientSimulator {
    const index = this.rememberIds.indexOf(value)
    if (index !== -1) {
      this.rememberIds.splice(index, 1)
    }
    return this
  }

  setContinueIds(value: string[]): ClientSimulator {
    this.continueIds = value
    return this
  }

  addContinueId(value: string): ClientSimulator {
    this.continueIds.push(value)
    return this
  }

  delContinueId(value: string): ClientSimulator {
    const index = this.continueIds.indexOf(value)
    if (index !== -1) {
      this.continueIds.splice(index, 1)
    }
    return this
  }

  setTracker(value: Partial<ProgressTrackerData>): ClientSimulator {
    this.tracker = { ...this.tracker, ...value }
    return this
  }

  setSettings(value: Partial<ClientSettingsSimulatorData>): ClientSimulator {
    this.settings = { ...this.settings, ...value }
    return this
  }

  serialize(): ClientSimulatorData {
    return JSON.parse(JSON.stringify(this))
  }
}
