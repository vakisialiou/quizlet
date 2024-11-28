import { ClientSimulatorData } from '@entities/ClientSimulator'

export type Weights = {
  [action: string]: number
}

export type Actions = Record<string, string[]>

export type ProgressTrackerData = {
  actions: Actions
  errorRate: number
}

export type ProgressTrackerOptions = Partial<{
  termIds?: (string|number)[],
  weights?: Weights,
  actions?: Actions,
  errorRate?: number
}>

export default class ProgressTracker {
  actions: Actions
  errorRate: number
  penalties: Record<string, number>

  constructor(simulator?: ClientSimulatorData, weights: Weights = {}) {
    this.actions = { ...simulator?.tracker?.actions || {} }
    this.errorRate = simulator?.tracker?.errorRate || 0

    const termIds = [...simulator?.termIds || []]
    this.penalties = this.calculatePenalties(termIds, weights)

    for (const termId of termIds) {
      if (termId in this.actions) {
        continue
      }

      this.actions[termId] = []
    }
  }

  private calculatePenalties(termIds: (string|number)[], weights: Weights): Record<string, number> {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + Math.abs(weight), 0)

    const maxPenaltyPerTerm = 100 / termIds.length

    const penalties = {} as Record<string, number>
    for (const [action, weight] of Object.entries(weights)) {
      const weightFraction = Math.abs(weight) / totalWeight
      penalties[action] = maxPenaltyPerTerm * weightFraction * Math.sign(weight)
    }
    return penalties
  }

  calculate(action: string, termId: string | number): ProgressTracker {
    const penalty = this.penalties[action]
    if (!penalty) {
      throw new Error(`Action "${action}" is not defined in weights`)
    }

    if (!(termId in this.actions)) {
      throw new Error(`Term ID "${termId}" is not defined in the simulator`)
    }

    const actionsForTerm = this.actions[termId]
    if (actionsForTerm.includes(action)) {
      return this
    }

    actionsForTerm.push(action)

    this.errorRate = Math.max(this.errorRate + penalty, 0)

    return this
  }

  getProgress(): number {
    return 100 - this.errorRate
  }

  setProgress(progress: number) {
    this.errorRate = 100 - progress
    return this
  }

  setErrorRate(value: number) {
    this.errorRate = value
    return this
  }

  getErrorRate(): number {
    return this.errorRate
  }

  serialize(): ProgressTrackerData {
    return JSON.parse(JSON.stringify({ errorRate: this.errorRate, actions: this.actions }))
  }
}
