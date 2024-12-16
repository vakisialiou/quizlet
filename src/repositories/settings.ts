import { ClientSettingsSimulatorData } from '@entities/ClientSettingsSimulator'
import ClientSettings, { ClientSettingsData } from '@entities/ClientSettings'
import { Prisma, PrismaEntry, Settings } from '@lib/prisma'

export type SettingsSelectType = {
  id: boolean,
  simulator: boolean,
}

export const SettingsSelect = {
  id: true,
  simulator: true
} as SettingsSelectType

type SettingsResult = Prisma.SettingsGetPayload<{
  select: typeof SettingsSelect
}>

export const createSettingsSelect = (data: SettingsResult): ClientSettings => {
  return new ClientSettings()
    .setId(data.id)
    .setSimulator(data?.simulator as ClientSettingsSimulatorData)
}

export const upsertSettingsSimulator = async (db: PrismaEntry, userId: string, data: { simulator: ClientSettingsSimulatorData }) => {
  const res = await db.settings.upsert({
    where: { userId },
    update: {
      simulator: data.simulator,
      updatedAt: new Date(),
    },
    create: {
      userId,
      simulator: data.simulator,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  return res.id
}

export const getSettings = async (db: PrismaEntry, userId: string): Promise<ClientSettingsData | null> => {
  if (!userId) {
    return null
  }

  const settings = await db.settings.findUnique({
    where: { userId },
    select: { ...SettingsSelect }
  })

  if (!settings) {
    return null
  }

  return createSettingsSelect(settings as Settings).serialize()
}
