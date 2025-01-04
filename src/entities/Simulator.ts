import { v4 } from 'uuid'

import SimulatorSettings, { SimulatorSettingsData } from '@entities/SimulatorSettings'
import { ProgressTrackerData } from '@entities/ProgressTracker'
import SimulatorTracker from '@entities/SimulatorTracker'

export enum SimulatorStatus {
  PROCESSING = 'processing',
  FINISHING = 'finishing',
  WAITING = 'waiting',
  DONE = 'done'
}

export type SimulatorData = {
  id: string
  active: boolean
  duration: number
  status: SimulatorStatus
  termId: string | null
  termIds: string[]
  rememberIds: string[]
  continueIds: string[]
  historyIds: string[]
  needUpdate: boolean
  tracker: ProgressTrackerData
  settings: SimulatorSettingsData
  createdAt: Date
  updatedAt: Date
}

export default class Simulator {
  id: string
  active: boolean
  duration: number
  status: SimulatorStatus
  termId: string | null
  termIds: string[]
  rememberIds: string[]
  continueIds: string[]
  historyIds: string[]
  needUpdate: boolean
  tracker: ProgressTrackerData
  settings: SimulatorSettingsData
  createdAt: Date
  updatedAt: Date

  constructor(status: SimulatorStatus, settings?: Partial<SimulatorSettingsData>) {
    this.id = v4()
    this.active = false
    this.duration = 0
    this.status = status
    this.termId = null
    this.termIds = []
    this.historyIds = []
    this.rememberIds = []
    this.continueIds = []
    this.needUpdate = false
    this.settings = new SimulatorSettings(settings).serialize()
    this.tracker = new SimulatorTracker(this).serialize()
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setId(value: string): Simulator {
    this.id = value
    return this
  }

  setActive(active: boolean): Simulator {
    this.active = active
    return this
  }

  setDuration(value: number): Simulator {
    this.duration = value
    return this
  }

  setStatus(value: SimulatorStatus): Simulator {
    this.status = value
    return this
  }

  setTermId(value: string | null): Simulator {
    this.termId = value
    return this
  }

  setTermIds(value: string[]): Simulator {
    this.termIds = value
    return this
  }

  addTermId(value: string): Simulator {
    this.termIds.push(value)
    return this
  }

  delTermId(value: string): Simulator {
    const index = this.termIds.indexOf(value)
    if (index !== -1) {
      this.termIds.splice(index, 1)
    }
    return this
  }

  setHistoryIds(value: string[]): Simulator {
    this.historyIds = value
    return this
  }

  addHistoryId(value: string): Simulator {
    this.historyIds.push(value)
    return this
  }

  delHistoryId(value: string): Simulator {
    const index = this.historyIds.indexOf(value)
    if (index !== -1) {
      this.historyIds.splice(index, 1)
    }
    return this
  }

  setRememberIds(value: string[]): Simulator {
    this.rememberIds = value
    return this
  }

  addRememberId(value: string): Simulator {
    this.rememberIds.push(value)
    return this
  }

  delRememberId(value: string): Simulator {
    const index = this.rememberIds.indexOf(value)
    if (index !== -1) {
      this.rememberIds.splice(index, 1)
    }
    return this
  }

  setContinueIds(value: string[]): Simulator {
    this.continueIds = value
    return this
  }

  addContinueId(value: string): Simulator {
    this.continueIds.push(value)
    return this
  }

  delContinueId(value: string): Simulator {
    const index = this.continueIds.indexOf(value)
    if (index !== -1) {
      this.continueIds.splice(index, 1)
    }
    return this
  }

  setTracker(value: Partial<ProgressTrackerData>): Simulator {
    this.tracker = { ...this.tracker, ...value }
    return this
  }

  setSettings(value: Partial<SimulatorSettingsData>): Simulator {
    this.settings = { ...this.settings, ...value }
    return this
  }

  setCreatedAt(value: Date): Simulator {
    this.createdAt = value
    return this
  }

  setUpdatedAt(value: Date): Simulator {
    this.updatedAt = value
    return this
  }

  serialize(): SimulatorData {
    return JSON.parse(JSON.stringify(this))
  }
}
