import { SimulatorData } from '@entities/Simulator'

export enum ProgressTrackerAction {
  success = 'success',
  error = 'error',
}

export type Weights = {
  [action in ProgressTrackerAction]: number
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

  constructor(
    weights: Weights = {
      [ProgressTrackerAction.error]: 0,
      [ProgressTrackerAction.success]: 0
    },
    simulator?: Partial<SimulatorData>
  ) {
    this.actions = { ...simulator?.tracker?.actions || {} }
    this.errorRate = simulator?.tracker?.errorRate || 0

    const termIds = [...simulator?.termIds || []]
    this.penalties = this.calculatePenalties(weights, termIds)

    for (const termId of termIds) {
      if (termId in this.actions) {
        continue
      }

      this.actions[termId] = []
    }
  }

  private calculatePenalties(weights: Weights, termIds: (string|number)[]): Record<string, number> {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + Math.abs(weight), 0)

    const maxPenaltyPerTerm = 100 / termIds.length

    const penalties = {} as Record<string, number>
    for (const [action, weight] of Object.entries(weights)) {
      const weightFraction = Math.abs(weight) / totalWeight
      penalties[action] = maxPenaltyPerTerm * weightFraction * Math.sign(weight)
    }
    return penalties
  }

  calculate(action: ProgressTrackerAction, termId: string | number): ProgressTracker {
    if (!(action in this.penalties)) {
      throw new Error(`Action "${action}" is not defined in weights`)
    }

    if (!(termId in this.actions)) {
      throw new Error(`Term ID "${termId}" is not defined in the simulator`)
    }

    const actionsForTerm = this.actions[termId]
    if (actionsForTerm.includes(action)) {
      return this
    }

    const penalty = this.penalties[action]
    if (action === ProgressTrackerAction.success && penalty < 0) {
      if (!actionsForTerm.includes(ProgressTrackerAction.error)) {
        return this
      }
    }

    // Action success - influence on errorRate to term which has error.
    // Action error - influence on errorRate to each term which didn't has it before.

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
