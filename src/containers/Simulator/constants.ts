import { SimulatorMethod } from '@entities/ClientSettingsSimulator'

export const simulatorMethodList = [
  { id: 1, name: 'Flashcard', inverted: false, method: SimulatorMethod.FLASHCARD },
  { id: 2, name: 'Flashcard inverse', inverted: true, method: SimulatorMethod.FLASHCARD },
  { id: 3, name: 'Pick', inverted: false, method: SimulatorMethod.PICK },
  { id: 4, name: 'Pick inverse', inverted: true, method: SimulatorMethod.PICK },
  { id: 5, name: 'Input', inverted: false, method: SimulatorMethod.INPUT },
  { id: 6, name: 'Input inverse', inverted: true, method: SimulatorMethod.INPUT },
]

export const getSimulatorNameById = (id: number): string | null => {
  const item = simulatorMethodList.find((item) => item.id === id)
  return item?.name || null
}