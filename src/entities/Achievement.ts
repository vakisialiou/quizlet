import {ClientSimulatorData, SimulatorStatus, SimulatorType} from '@entities/ClientSimulator'

enum DegreeEnum {
  preschool = 'preschool',
  primary = 'primary',
  secondary = 'secondary',
  student = 'student',
  bachelor = 'bachelor',
  master = 'master',
  doctor = 'doctor',
  professor = 'professor',
}

enum MedalEnum {
  bronze = 'bronze',
  silver = 'silver',
  gold = 'gold',
}

const weights = {
  [SimulatorType.FLASHCARD]: 1,
  [SimulatorType.PICK]: 1.2,
  [SimulatorType.INPUT]: 4,
}

const thresholds = [
  {
    min: 0,
    max: 25,
    degree: DegreeEnum.preschool,
    thresholds: [
      { min: 20, max: 46, medal: MedalEnum.bronze },
      { min: 46, max: 72, medal: MedalEnum.silver },
      { min: 72, max: 100, medal: MedalEnum.gold },
    ],
  },
  {
    min: 25,
    max: 45,
    degree: DegreeEnum.primary,
    thresholds: [
      { min: 20, max: 46, medal: MedalEnum.bronze },
      { min: 46, max: 72, medal: MedalEnum.silver },
      { min: 72, max: 100, medal: MedalEnum.gold },
    ],
  },
  {
    min: 45,
    max: 65,
    degree: DegreeEnum.secondary,
    thresholds: [
      { min: 20, max: 46, medal: MedalEnum.bronze },
      { min: 46, max: 72, medal: MedalEnum.silver },
      { min: 72, max: 100, medal: MedalEnum.gold },
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
  medal: MedalEnum | null
}

export default class Achievement {

  getSimulatorWeight(simulator: ClientSimulatorData): number {
    return weights[simulator.type || SimulatorType.FLASHCARD] || 1
  }

  calculate(simulators: ClientSimulatorData[]): AchievementData {
    const achievement = { medal: null, degree: null } as AchievementData
    // Выборка завершенных симуляторов
    const completedSimulators = [...simulators].filter(({ status, active }) => active === false && status === SimulatorStatus.DONE)

    if (completedSimulators.length < 3) {
      return achievement
    }

    // Расчет общего взвешенного прогресса
    const totalWeightedProgress = completedSimulators.reduce((accumulator, simulator) => {
      // Подсчет взвешенного прогресса
      const weight = this.getSimulatorWeight(simulator)
      return accumulator + (simulator.progress * weight)
    }, 0)

    // Максимально возможный прогресс
    const maxProgress = completedSimulators.reduce((accumulator, simulator) => {
      const weight = this.getSimulatorWeight(simulator)
      return accumulator + (100 * weight)
    }, 0)

    // Общий процент
    const overallProgress = (totalWeightedProgress / maxProgress) * 100
    if (overallProgress < 10) {
      return achievement
    }

    for (const threshold of thresholds) {
      if (overallProgress > threshold.min && overallProgress <= threshold.max) {
        achievement.degree = threshold.degree

        const relativeProgress = ((overallProgress - threshold.min) / (threshold.max - threshold.min)) * 100
        for (const { min, max, medal } of threshold.thresholds) {
          if (relativeProgress > min && relativeProgress <= max) {
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
