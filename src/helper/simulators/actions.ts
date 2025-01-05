import { getAvailableTermIds, selectRandomTermId, randomizeTermIds } from '@helper/simulators/general'
import { SimulatorData, SimulatorStatus } from '@entities/Simulator'
import { ProgressTrackerAction } from '@entities/ProgressTracker'
import SimulatorSettings from '@entities/SimulatorSettings'
import SimulatorTracker from '@entities/SimulatorTracker'
import { unique } from '@lib/array'

export const addHistoryId = (historyIds: string[], termId: string | null): string[] => {
  return termId ? [...historyIds, termId] : historyIds
}

export const addContinueId = (continueIds: string[], termId: string | null): string[] => {
  return termId ? unique([...continueIds, termId]) : continueIds
}

export const addRememberIds = (rememberIds: string[], termId: string | null): string[] => {
  return termId ? unique([...rememberIds, termId]) : rememberIds
}

export function actionTracker(simulator: SimulatorData, trackerAction: ProgressTrackerAction) {
  const tracker = new SimulatorTracker(JSON.parse(JSON.stringify(simulator)))

  if (simulator.termId) {
    tracker.calculate(trackerAction, simulator.termId)
  }

  return {
    ...simulator,
    tracker: tracker.serialize(),
  }
}

export function actionContinue(simulator: SimulatorData) {
  const termIds = getAvailableTermIds(simulator, { active: true, continue: true, remember: true })

  return actionExtraParamsUpdate({
    ...simulator,
    termId: termIds.length > 0 ? selectRandomTermId(termIds) : null,
    historyIds: addHistoryId(simulator.historyIds, simulator.termId),
    continueIds: addContinueId(simulator.continueIds, simulator.termId),
    status: termIds.length > 0 ? simulator.status : SimulatorStatus.FINISHING
  })
}

export function actionRemember(simulator: SimulatorData) {
  const termIds = getAvailableTermIds(simulator, { active: true, continue: true, remember: true })

  return actionExtraParamsUpdate({
    ...simulator,
    termId: termIds.length > 0 ? selectRandomTermId(termIds) : null,
    historyIds: addHistoryId(simulator.historyIds, simulator.termId),
    rememberIds: addRememberIds(simulator.rememberIds, simulator.termId),
    status: termIds.length > 0
      ? simulator.status
      : (simulator.continueIds.length === 0 ? SimulatorStatus.DONE : SimulatorStatus.FINISHING)
  })
}

export function actionRestart(simulator: SimulatorData) {
  const termIds = getAvailableTermIds(simulator, { active: false, continue: false, remember: true  })

  return actionExtraParamsUpdate({
    ...simulator,
    continueIds: [],
    termId: termIds.length > 0 ? termIds[0] : null,
    status: termIds.length > 0 ? SimulatorStatus.PROCESSING : SimulatorStatus.DONE
  })
}

export function actionBack(simulator: SimulatorData) {
  if (simulator.historyIds.length === 0) {
    return simulator
  }

  const historyIds = [...simulator.historyIds]
  const termId = historyIds.splice(-1)[0] || null

  return actionExtraParamsUpdate({
    ...simulator,
    termId,
    historyIds,
    needUpdate: true,
    continueIds: [...simulator.continueIds ].filter((uuid) => uuid !== termId),
    rememberIds: [...simulator.rememberIds ].filter((uuid) => uuid !== termId),
  })
}

export function actionDeactivate(simulator: SimulatorData) {
  return {
    ...simulator,
    active: false,
  }
}

export function actionExtraParamsUpdate(simulator: SimulatorData) {
  const termIds = [...simulator.termIds].filter((termId) => termId !== simulator.termId)
  const sliceTermIds = randomizeTermIds(termIds).slice(0, 3)
  return {
    ...simulator,
    settings: new SimulatorSettings(simulator.settings)
      .setExtraTermIds(simulator.termId ? randomizeTermIds([...sliceTermIds, simulator.termId]) : [])
      .serialize()
  }
}
