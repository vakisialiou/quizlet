import { ClientSettingsSimulatorData } from '@entities/ClientSettingsSimulator'
import ClientSettings, { ClientSettingsData } from '@entities/ClientSettings'
import { prisma } from '@lib/prisma'

export const upsertSettingsSimulator = async (userId: string, settings: ClientSettingsSimulatorData) => {
  const res = await prisma.settings.upsert({
    where: { userId },
    update: {
      simulator: settings,
      updatedAt: new Date(),
    },
    create: {
      userId,
      simulator: settings,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  return res.id
}

export const getSettings = async (userId: string): Promise<ClientSettingsData | null> => {
  if (!userId) {
    return null
  }

  const settings = await prisma.settings.findUnique({
    where: { userId },
    select: {
      id: true,
      simulator: true
    }
  })

  if (!settings) {
    return null
  }

  return new ClientSettings()
    .setId(settings.id)
    .setSimulator(settings?.simulator as ClientSettingsSimulatorData)
    .serialize()
}
