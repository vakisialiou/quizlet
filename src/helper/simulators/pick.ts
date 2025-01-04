import { filterDeletedTerms, filterEmptyTerms } from '@helper/terms'
import { SimulatorData } from '@entities/Simulator'
import { TermData } from '@entities/Term'
import { shuffle } from '@lib/array'

function sliceRandomItems(items: TermData[], activeItemId: string, inverted: boolean, count: number): TermData[] {
  if (count < 1) {
    throw new Error(`Param "${count}" has to be more then 1.`)
  }

  return shuffle([...items])
    .filter(({ id, answer, question }) => {
      const str = inverted ? question : answer
      return !(id === activeItemId || !str)
    })
    .slice(0, count)
}

export function randomTermIds(items: TermData[], activeItemId: string, inverted: boolean, count: number): string[] {
  items = shuffle(filterDeletedTerms(filterEmptyTerms([...items])))

  const termIds = sliceRandomItems(items, activeItemId, inverted, count - 1)
    .map(({ id }) => id)

  return shuffle([...termIds, activeItemId])
}

export function setSettingsExtraTermIds(simulator: SimulatorData, randomTermIds: string[]): SimulatorData {
  simulator.settings.extra = { ...simulator.settings.extra, termIds: randomTermIds }
  return {...simulator }
}
