import ClientSimulator, { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import { ClientSettingsSimulatorData } from '@entities/ClientSettingsSimulator'
import { ProgressTrackerData } from '@entities/ProgressTracker'
import { Prisma, PrismaEntry } from '@lib/prisma'

export type SimulatorSelectType = {
  id: boolean,
  termId: boolean,
  active: boolean,
  status: boolean,
  folderId: boolean,
  termIds: boolean,
  historyIds: boolean,
  continueIds: boolean,
  rememberIds: boolean,
  settings: boolean,
  tracker: boolean,
  createdAt: boolean
  updatedAt: boolean
}

export const SimulatorSelect = {
  id: true,
  termId: true,
  active: true,
  status: true,
  folderId: true,
  termIds: true,
  historyIds: true,
  continueIds: true,
  rememberIds: true,
  settings: true,
  tracker: true,
  createdAt: true,
  updatedAt: true
} as SimulatorSelectType

type SimulatorResult = Prisma.SimulatorGetPayload<{
  select: typeof SimulatorSelect
}>

export const createSimulatorSelect = (data: SimulatorResult): ClientSimulator => {
  const termIds = Array.isArray(data.termIds) ? data.termIds as string[] : []
  const historyIds = Array.isArray(data.historyIds) ? data.historyIds as string[] : []
  const continueIds = Array.isArray(data.continueIds) ? data.continueIds as string[] : []
  const rememberIds = Array.isArray(data.rememberIds) ? data.rememberIds as string[] : []
  const tracker = data.tracker || {}
  const settings = data.settings || {}
  return new ClientSimulator(data.folderId, data.status as SimulatorStatus)
    .setId(data.id)
    .setTermIds(termIds)
    .setHistoryIds(historyIds)
    .setContinueIds(continueIds)
    .setRememberIds(rememberIds)
    .setActive(data.active)
    .setTermId(data.termId)
    .setTracker(tracker as ProgressTrackerData)
    .setSettings(settings as ClientSettingsSimulatorData)
    .setCreatedAt(data.createdAt)
    .setUpdatedAt(data.updatedAt)
}

export const findSimulatorsByFolderId = async (db: PrismaEntry, userId: string, folderId: string): Promise<ClientSimulatorData[]> => {
  const res = await db.simulator.findMany({
    where: { userId, folderId },
    select: { ...SimulatorSelect },
  })

  return res.map(simulator => createSimulatorSelect(simulator).serialize())
}

export const upsertSimulator = async (db: PrismaEntry, userId: string, data: ClientSimulatorData): Promise<string | null> => {
  const termIds = Array.isArray(data.termIds) ? data.termIds : []
  const historyIds = Array.isArray(data.historyIds) ? data.historyIds : []
  const continueIds = Array.isArray(data.continueIds) ? data.continueIds : []
  const rememberIds = Array.isArray(data.rememberIds) ? data.rememberIds : []
  const settings = data.settings || {}
  const tracker = data.tracker || {}
  const res = await db.simulator.upsert({
    where: { id: data.id },
    update: {
      termIds,
      historyIds,
      continueIds,
      rememberIds,
      settings,
      tracker,
      termId: data.termId,
      active: data.active,
      status: data.status,
      updatedAt: new Date(),
    },
    create: {
      userId,
      termIds,
      historyIds,
      continueIds,
      rememberIds,
      settings,
      tracker,
      id: data.id,
      termId: data.termId,
      active: data.active,
      status: data.status,
      folderId: data.folderId,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  return res.id
}
