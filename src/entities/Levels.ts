
export enum EnumLevels {
  beginner = 'beginner',
  middle = 'middle',
  expert = 'expert',
}

type TypeRange = {
  min: number,
  max: number,
  level: EnumLevels
}

export default class Levels {
  private readonly ranges: TypeRange[]
  private levels: EnumLevels[]
  private degreeRate: number
  private single: boolean

  constructor(degreeRate: number, single: boolean) {
    this.ranges = [
      { min: 30, max: 60, level: EnumLevels.beginner },
      { min: 60, max: 90, level: EnumLevels.middle },
      { min: 90, max: 100, level: EnumLevels.expert },
    ]

    this.single = single
    this.degreeRate = degreeRate
    this.levels = this.getLevels()
  }

  setSingle(value: boolean): Levels {
    this.single = value
    this.recalculateLevels()
    return this
  }

  setDegreeRate(value: number): Levels {
    this.degreeRate = value
    this.recalculateLevels()
    return this
  }

  getLevel(index = 0): EnumLevels {
    return this.levels[index] || null
  }

  hasNoLevels(): boolean {
    return this.levels.length === 0
  }

  hasLevel(value: EnumLevels): boolean {
    return this.levels.includes(value)
  }

  private getLevels(): EnumLevels[] {
    const { degreeRate, single } = this
    return this.ranges
      .filter(({ min, max }) => {
        return (degreeRate >= min && degreeRate < max) || (!single && degreeRate >= min) || degreeRate === 100
      })
      .map(({ level }) => level)
  }

  private recalculateLevels(): Levels {
    this.levels = this.getLevels()
    return this
  }
}
