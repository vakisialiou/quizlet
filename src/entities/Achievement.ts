import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import { SimulatorMethod } from '@entities/ClientSettingsSimulator'
import SimulatorTracker from '@entities/SimulatorTracker'

export enum DegreeEnum {
  beginner = 'beginner',
  learner = 'learner',
  researcher = 'researcher',
  expert = 'expert',
  leader = 'leader',
  honorary = 'honorary',
}

export enum MedalEnum {
  bronze = 'bronze',
  silver = 'silver',
  gold = 'gold',
}

const weights = {
  [SimulatorMethod.PICK]: 0.01,
  [SimulatorMethod.FLASHCARD]: 0.02,
  [SimulatorMethod.INPUT]: 0.1,
}

const degreeThresholds = [
  { min: 5, max: 50, degree: DegreeEnum.beginner },
  { min: 50, max: 65, degree: DegreeEnum.learner },
  { min: 65, max: 80, degree: DegreeEnum.researcher },
  { min: 80, max: 90, degree: DegreeEnum.expert },
  { min: 90, max: 95, degree: DegreeEnum.leader },
  { min: 95, max: 100, degree: DegreeEnum.honorary },
]

const medalThresholds = [
  { min: 50, max: 70, medal: MedalEnum.bronze },
  { min: 70, max: 95, medal: MedalEnum.silver },
  { min: 95, max: 100, medal: MedalEnum.gold },
]

export type AchievementData = {
  degree: DegreeEnum | null
  degreeRate: number
  medal: MedalEnum | null
  medalRate: number
}

export default class Achievement {

  getSimulatorWeight(simulator: ClientSimulatorData): number {
    if (!(simulator.settings.method in weights)) {
      throw new Error(`Simulator "${simulator.id}" does not have a valid method. This is required property.`)
    }

    return weights[simulator.settings.method]
  }

  /**
   * Then lower result value, then worse the material is learned.
   *
   * @param {ClientSimulatorData[]} simulators
   */
  getDegreeRate(simulators: ClientSimulatorData[]): number {
    // Выборка завершенных симуляторов
    const completedSimulators = [...simulators].filter(({ status, active }) => active === false && status === SimulatorStatus.DONE)

    // Расчет общего взвешенного прогресса
    const totalWeightedProgress = completedSimulators.reduce((accumulator, simulator) => {
      const progress = new SimulatorTracker(simulator).getProgress()

      // Подсчет взвешенного прогресса
      const weight = this.getSimulatorWeight(simulator)
      return accumulator + (progress * weight)
    }, 0)

    // Максимально возможный прогресс
    const maxProgress = completedSimulators.reduce((accumulator, simulator) => {
      const weight = this.getSimulatorWeight(simulator)
      return accumulator + (100 * weight)
    }, 0)

    // Общий процент
    return maxProgress > 0 ? (totalWeightedProgress / maxProgress) * 100 : 0
  }

  getMedalRate(degreeRate: number) {
    for (const threshold of degreeThresholds) {
      if (degreeRate > threshold.min && degreeRate <= threshold.max) {
        return ((degreeRate - threshold.min) / (threshold.max - threshold.min)) * 100
      }
    }
    return 0
  }

  getDegree(degreeRate: number): DegreeEnum | null {
    for (const threshold of degreeThresholds) {
      if (degreeRate > threshold.min && degreeRate <= threshold.max) {
        return threshold.degree
      }
    }

    return null
  }

  getMedal(medalRate: number): MedalEnum | null {
    for (const { min, max, medal } of medalThresholds) {
      if (medalRate > min && medalRate <= max) {
        return medal
      }
    }

    return null
  }

  calculateByDegreeRate(degreeRate: number): AchievementData {
    const medalRate = this.getMedalRate(degreeRate)
    return {
      medalRate,
      degreeRate,
      medal: this.getMedal(medalRate),
      degree: this.getDegree(degreeRate)
    }
  }

  calculate(simulators: ClientSimulatorData[]): AchievementData {
    const degreeRate = this.getDegreeRate(simulators)
    return this.calculateByDegreeRate(degreeRate)
  }
}
