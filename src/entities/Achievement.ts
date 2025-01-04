import { SimulatorData, SimulatorStatus } from '@entities/Simulator'
import { SimulatorMethod } from '@entities/SimulatorSettings'
import SimulatorTracker from '@entities/SimulatorTracker'

type TypeAchievementOptions = {
  method: SimulatorMethod
  inverted: boolean
  weight: number
}

type TypeAchievementFilter = {
  method: SimulatorMethod
  inverted: boolean
}

export default class Achievement {
  private readonly options: TypeAchievementOptions[]

  constructor() {
    this.options = [
      {
        method: SimulatorMethod.PICK,
        inverted: true,
        weight: 0.05
      },
      {
        method: SimulatorMethod.PICK,
        inverted: false,
        weight: 0.05
      },
      {
        method: SimulatorMethod.FLASHCARD,
        inverted: true,
        weight: 0.06
      },
      {
        method: SimulatorMethod.FLASHCARD,
        inverted: false,
        weight: 0.06
      },
      {
        method: SimulatorMethod.INPUT,
        inverted: true,
        weight: 0.07
      },
      {
        method: SimulatorMethod.INPUT,
        inverted: false,
        weight: 0.07
      }
    ]
  }

  getWeight(method: SimulatorMethod, inverted: boolean): number {
    const item = this.options.find((item) => {
      return item.method === method && item.inverted === inverted
    })

    if (!item?.weight) {
      throw new Error(`Weight not found for method: "${method}" and inverted: "${inverted}"`)
    }

    return item.weight
  }

  /**
   * Then lower result value, then worse the material is learned.
   */
  getTotalRate(simulators: SimulatorData[]): number {
    // Получаем прогресс всех завершенных симуляторов
    const progressValues = simulators.map(simulator => {
      return {
        simulator,
        progress: new SimulatorTracker(simulator).getProgress()
      }
    })

    // Если нет завершённых симуляторов, возвращаем 0
    if (progressValues.length === 0) {
      return 0
    }

    // Расчёт общего прогресса с учётом порядка
    const totalWeightedProgress = progressValues.reduce((accumulator, { simulator, progress }, index) => {
      // Применяем вес в зависимости от индекса, чтобы раньше выполненные симуляторы имели больший вес, если нужно
      const weight = 1 + index * this.getWeight(simulator.settings.method, simulator.settings.inverted)
      return accumulator + progress * weight
    }, 0)

    // Максимально возможный прогресс
    const maxProgress = progressValues.reduce((accumulator) => {
      return accumulator + 100
    }, 0)

    return maxProgress > 0 ? (totalWeightedProgress / maxProgress) * 100 : 0
  }

  findSimulators(simulators: SimulatorData[], options: TypeAchievementFilter) {
    return [...simulators].filter(({ status, active, settings }) => {
      return settings.method === options.method
        && settings.inverted === options.inverted
        && status === SimulatorStatus.DONE
        && active === false
    })
  }

  getMethodRate(simulators: SimulatorData[], options: TypeAchievementFilter) {
    const defaultSimulators = this.findSimulators(simulators, options)
    return Math.min(this.getTotalRate(defaultSimulators), 100)
  }

  getRate(simulators: SimulatorData[]): number {
    const arr = []
    const maxRate = 100 / this.options.length
    for (const options of this.options) {
      const rate = maxRate / 100 * this.getMethodRate(simulators, options)
      arr.push(rate)
    }

    const rate = arr.reduce((accumulator, percent) => {
      return accumulator + percent
    }, 0)

    return Math.min(rate, 100)
  }


}
