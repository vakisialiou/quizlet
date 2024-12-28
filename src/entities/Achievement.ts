import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import { SimulatorMethod } from '@entities/ClientSettingsSimulator'
import SimulatorTracker from '@entities/SimulatorTracker'

type TypeAchievementOptions = {
  method: SimulatorMethod
  inverted: boolean
  weight: number
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
   *
   * @param {ClientSimulatorData[]} simulators
   */
  getTotalRate(simulators: ClientSimulatorData[]): number {
    // Выборка завершенных симуляторов
    const completedSimulators = [...simulators].filter(({ status, active }) => active === false && status === SimulatorStatus.DONE)

    // Получаем прогресс всех завершенных симуляторов
    const progressValues = completedSimulators.map(simulator => {
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

  getMethodRate(simulators: ClientSimulatorData[], options: TypeAchievementOptions) {
    const maxRate = 100 / this.options.length

    const defaultSimulators = [...simulators].filter(({ settings }) => {
      return settings.method === options.method && settings.inverted === options.inverted
    })

    const rate = maxRate / 100 * this.getTotalRate(defaultSimulators)
    return Math.min(rate, maxRate)
  }

  getRate(simulators: ClientSimulatorData[]): number {
    const arr = []

    for (let options of this.options) {
      arr.push(this.getMethodRate(simulators, options))
    }

    const rate = arr.reduce((accumulator, percent) => {
      return accumulator + percent
    }, 0)

    return Math.min(rate, 100)
  }
}
