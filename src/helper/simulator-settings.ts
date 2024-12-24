import { filterDeletedTerms, filterEmptyTerms } from '@helper/terms'
import { SimulatorMethod } from '@entities/ClientSettingsSimulator'
import { ClientSimulatorData } from '@entities/ClientSimulator'
import { ClientTermData } from '@entities/ClientTerm'
import { shuffle } from '@lib/array'

function sliceRandomItems(items: ClientTermData[], activeItemId: string, inverted: boolean, count: number): ClientTermData[] {
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

function pickUpExtraTermIds(items: ClientTermData[], activeItemId: string, inverted: boolean, count: number): string[] {
  items = shuffle(filterDeletedTerms(filterEmptyTerms([...items])))
  const termIds = sliceRandomItems(items, activeItemId, inverted, count - 1).map(({ id }) => id)
  return shuffle([...termIds, activeItemId])
}

export function ensureActualExtra(items: ClientTermData[], simulator: ClientSimulatorData): ClientSimulatorData {
  return {
    ...simulator,
    settings: {
      ...simulator.settings,
      extra: {
        termIds: (simulator.settings.method === SimulatorMethod.PICK && simulator.termId && items.length > 0)
          ? pickUpExtraTermIds(items, simulator.termId, simulator.settings.inverted, 4)
          : []
      }
    },
  }
}
