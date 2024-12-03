import { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import { SimulatorMethod } from '@entities/ClientSettingsSimulator'
import SimulatorTracker from '@entities/SimulatorTracker'

export enum DegreeEnum {
  preschool = 'preschool',
  primary = 'primary',
  secondary = 'secondary',
  student = 'student',
  bachelor = 'bachelor',
  master = 'master',
  doctor = 'doctor',
  professor = 'professor',
}

export enum MedalEnum {
  bronze = 'bronze',
  silver = 'silver',
  gold = 'gold',
}

const weights = {
  [SimulatorMethod.PICK]: 0.01,
  [SimulatorMethod.FLASHCARD]: 0.02,
  [SimulatorMethod.INPUT]: 0.5,
}

const thresholds = [
  {
    min: 0,
    max: 25,
    degree: DegreeEnum.preschool,
    thresholds: [
      { min: 50, max: 70, medal: MedalEnum.bronze },
      { min: 70, max: 95, medal: MedalEnum.silver },
      { min: 95, max: 100, medal: MedalEnum.gold },
    ],
  },
  {
    min: 25,
    max: 45,
    degree: DegreeEnum.primary,
    thresholds: [
      { min: 50, max: 70, medal: MedalEnum.bronze },
      { min: 70, max: 95, medal: MedalEnum.silver },
      { min: 95, max: 100, medal: MedalEnum.gold },
    ],
  },
  {
    min: 45,
    max: 65,
    degree: DegreeEnum.secondary,
    thresholds: [
      { min: 50, max: 70, medal: MedalEnum.bronze },
      { min: 70, max: 95, medal: MedalEnum.silver },
      { min: 95, max: 100, medal: MedalEnum.gold },
    ],
  },
  {
    min: 65,
    max: 80,
    degree: DegreeEnum.student,
    thresholds: [
      { min: 20, max: 46, medal: MedalEnum.bronze },
      { min: 46, max: 72, medal: MedalEnum.silver },
      { min: 72, max: 100, medal: MedalEnum.gold },
    ],
  },
  {
    min: 80,
    max: 85,
    degree: DegreeEnum.bachelor,
    thresholds: [
      { min: 20, max: 46, medal: MedalEnum.bronze },
      { min: 46, max: 72, medal: MedalEnum.silver },
      { min: 72, max: 100, medal: MedalEnum.gold },
    ],
  },
  {
    min: 85,
    max: 90,
    degree: DegreeEnum.master,
    thresholds: [
      { min: 20, max: 46, medal: MedalEnum.bronze },
      { min: 46, max: 72, medal: MedalEnum.silver },
      { min: 72, max: 100, medal: MedalEnum.gold },
    ],
  },
  {
    min: 90,
    max: 95,
    degree: DegreeEnum.doctor,
    thresholds: [
      { min: 20, max: 46, medal: MedalEnum.bronze },
      { min: 46, max: 72, medal: MedalEnum.silver },
      { min: 72, max: 100, medal: MedalEnum.gold },
    ],
  },
  {
    min: 95,
    max: 100,
    degree: DegreeEnum.professor,
    thresholds: [
      { min: 20, max: 46, medal: MedalEnum.bronze },
      { min: 46, max: 72, medal: MedalEnum.silver },
      { min: 72, max: 100, medal: MedalEnum.gold },
    ],
  },
]

export type AchievementData = {
  degree: DegreeEnum | null
  degreeProgress: number
  medal: MedalEnum | null
  medalProgress: number
}

export default class Achievement {

  getSimulatorWeight(simulator: ClientSimulatorData): number {
    return weights[simulator.settings.method || SimulatorMethod.FLASHCARD] || 1
  }

  calculate(simulators: ClientSimulatorData[]): AchievementData {
    const achievement = {
      medal: null,
      degree: null,
      degreeProgress: 0,
      medalProgress: 0
    } as AchievementData

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
    achievement.degreeProgress = maxProgress > 0 ? (totalWeightedProgress / maxProgress) * 100 : 0
    if (achievement.degreeProgress < 5) {
      return achievement
    }

    for (const threshold of thresholds) {
      if (achievement.degreeProgress > threshold.min && achievement.degreeProgress <= threshold.max) {
        achievement.degree = threshold.degree

        achievement.medalProgress = ((achievement.degreeProgress - threshold.min) / (threshold.max - threshold.min)) * 100
        for (const { min, max, medal } of threshold.thresholds) {
          if (achievement.medalProgress > min && achievement.medalProgress <= max) {
            achievement.medal = medal
            break
          }
        }
        break
      }
    }

    return achievement
  }
}
