import { SimulatorSettingsData } from '@entities/SimulatorSettings'
import Settings, { SettingsData } from '@entities/Settings'
import { Prisma, PrismaEntry } from '@lib/prisma'

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

export const createSettingsSelect = (data: SettingsResult): Settings => {
  return new Settings()
    .setId(data.id)
    .setSimulator(data?.simulator as SimulatorSettingsData)
}

export const upsertSettingsSimulator = async (db: PrismaEntry, userId: string, data: { simulator: SimulatorSettingsData }) => {
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

export const getSettings = async (db: PrismaEntry, userId: string): Promise<SettingsData | null> => {
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
