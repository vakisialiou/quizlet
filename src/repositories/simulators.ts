import ClientSimulator, { ClientSimulatorData, SimulatorStatus } from '@entities/ClientSimulator'
import { ClientSettingsSimulatorData } from '@entities/ClientSettingsSimulator'
import { prisma, Simulator } from '@lib/prisma'

export const findSimulatorsByFolderId = async (userId: string, folderId: string): Promise<ClientSimulatorData[]> => {
  const res = await prisma.simulator.findMany({
    where: { userId, folderId },
    select: {
      id: true,
      termId: true,
      active: true,
      status: true,
      folderId: true,
      termIds: true,
      historyIds: true,
      continueIds: true,
      rememberIds: true,
      settings: true
    },
  })

  return res.map(simulator => {
    const termIds = Array.isArray(simulator.termIds) ? simulator.termIds as string[] : []
    const historyIds = Array.isArray(simulator.historyIds) ? simulator.historyIds as string[] : []
    const continueIds = Array.isArray(simulator.continueIds) ? simulator.continueIds as string[] : []
    const rememberIds = Array.isArray(simulator.rememberIds) ? simulator.rememberIds as string[] : []

    return new ClientSimulator(simulator.folderId, simulator.status as SimulatorStatus)
      .setId(simulator.id)
      .setActive(simulator.active)
      .setTermId(simulator.termId)
      .setTermIds(termIds)
      .setHistoryIds(historyIds)
      .setContinueIds(continueIds)
      .setRememberIds(rememberIds)
      .setSettings(simulator.settings as ClientSettingsSimulatorData)
      .serialize()
  })
}

export const upsertSimulator = async (simulator: Simulator): Promise<string | null> => {
  const termIds = Array.isArray(simulator.termIds) ? simulator.termIds : []
  const historyIds = Array.isArray(simulator.historyIds) ? simulator.historyIds : []
  const continueIds = Array.isArray(simulator.continueIds) ? simulator.continueIds : []
  const rememberIds = Array.isArray(simulator.rememberIds) ? simulator.rememberIds : []
  const settings = simulator.settings || {}
  const res = await prisma.simulator.upsert({
    where: { id: simulator.id },
    update: {
      termIds,
      historyIds,
      continueIds,
      rememberIds,
      settings,
      termId: simulator.termId,
      active: simulator.active,
      status: simulator.status,
      updatedAt: simulator.updatedAt || new Date(),
    },
    create: {
      termIds,
      historyIds,
      continueIds,
      rememberIds,
      settings,
      id: simulator.id,
      userId: simulator.userId,
      termId: simulator.termId,
      active: simulator.active,
      status: simulator.status,
      folderId: simulator.folderId,
      createdAt: simulator.createdAt || new Date(),
      updatedAt: simulator.updatedAt || new Date()
    },
  })

  return res.id
}
